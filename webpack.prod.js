const { merge } = require('webpack-merge'),
      common = require('./webpack.common.js'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin'),
      ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;

module.exports = merge(common, {
  target: ['web', 'es5'],
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new ImageminWebpackPlugin({
      test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/i,
      pngquant: {
        quality: '65-80'
      }
    }),
  ],
});
