const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      reportFilename: '../analyzer/report.html'
    }
  },
  // chainWebpack: config => {
  //   config.module
  //     .rule('scss')
  //     .test(/\.scss$/)
  //     .use('vue-style-loader')
  //       .loader('css-loader')
  //       .loader('sass-loader')
  //       .tap(options => options)
  //       .end()
  // }
};