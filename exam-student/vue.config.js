'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './', // 部署应用包时的基本 URL
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  devServer: {
    // open: true,
    // host: 'localhost',
    // port: 80,
    // https: false,
    // hotOnly: false,
    // proxy: {
    //   '/api': {
    //     target: "http://110.41.189.159:8081",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径：去掉路径中开头的'/api'
    //   }
    // }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  chainWebpack: (config, isServer) => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'static/images/[name].[hash:8].[ext]',
      });
  },

}
