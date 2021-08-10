const path = require('path'),
      globule = require('globule'),
      Sass = require('sass'),
      // Fiber = require('fibers'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      RemoveEmptyScripts = require('webpack-remove-empty-scripts'),
      Autoprefixer = require('autoprefixer'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),

      // setting : paths
      DIR_INPUT_ROOT = path.resolve(__dirname, './develop'),
      DIR_OUTPUT_ROOT = path.resolve(__dirname, './docs'),

      targetTypes = {
        scss: 'css',
        ts: 'js'
      };

const getEntries = (targetTypes) => {
  const entries = {};
  Object.keys(targetTypes).forEach(from => {
    const to = targetTypes[from],
          array = [`**/*.${from}`, `!**/_*.${from}`];
    globule.find(
      array,
      {
        cwd: DIR_INPUT_ROOT
      }
    ).forEach(filename => {
      entries[filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`)] = path.join(DIR_INPUT_ROOT, filename)
    })
  });
  return entries;
}

const handlerTemplates = [];
for (const [ target, source ] of Object.entries(getEntries({ pug: 'html' }))) {
  handlerTemplates.push(
    new HtmlWebpackPlugin({
      filename : target,
      template : source,
      inject: false
    })
  );
};

const config = {
  target: 'web',
  context: DIR_INPUT_ROOT,
  entry: getEntries(targetTypes),
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name.match(/\.css$/) ? `[name].js`: `[name]`;
    },
    path: DIR_OUTPUT_ROOT
  },
  resolve: {
    extensions: ['.js', '.ts'],
    // extensions: ['.js', '.es'],
    modules: ['node_modules'],
    alias: {}
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  stats: {
    children: true,
  },

  module: {
    rules: [
      // pug
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
              root: DIR_INPUT_ROOT
            }
          },
        ],
        exclude: /node_modules/
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  Autoprefixer({
                    grid: true
                  })
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: Sass,
              sassOptions: {
                // fiber: Fiber,
                fiber: false,
              }
            }
          }
        ]
      },

      // TypeScript
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              plugins: [
                '@babel/plugin-transform-runtime'
              ]
            }
          },
          {
            loader: 'ts-loader',
          }
        ],
        exclude: /node_modules\/(?!(micromodal|dom7|ssr-window|swiper)\/).*/,
      },

      // img
      {
        test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: `img/[name].[ext]`
            }
          }
        ]
      },
    ]
  },

  plugins: [
    ...handlerTemplates,
    new RemoveEmptyScripts(),
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*",
          noErrorOnMissing: true,
          globOptions: {
            // dot: true,
            dot: false,
            gitignore: true,
            ignore: Object.keys({ pug: 'html', scss: 'css', ts: 'js' }).map((ext) => `**/*.${ext}`),
          },
        },
      ],
    }),
  ],
};

module.exports = config;
