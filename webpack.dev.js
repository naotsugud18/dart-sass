const { merge } = require('webpack-merge'),
      common = require('./webpack.common.js'),
      path = require('path'),
      internalIp = require('internal-ip'),
      localhost = internalIp.v4.sync(),
      localhostPort = 8080;

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    // host: localhost,
    // port: localhostPort,
    disableHostCheck: true,
    open: true,
    // openPage: ``,
    contentBase: path.resolve(__dirname, './public'),
    watchContentBase: true,
    historyApiFallback: true,
    compress: true,
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /(?:node_modules|\.css$)/,
  },
});
