const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const resolve = (dir) => path.join(__dirname, '.', dir);

const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = defineConfig({
  //强制编译依赖模块
  transpileDependencies: true,
  //开启环境的sourceMap还原混淆压缩代码至源代码
  productionSourceMap: true,
  //基本URL
  publicPath: '/scda-spider',
  //build后输入文件夹
  outputDir: 'dist',
  //静态文件夹目录
  assetsDir: 'assets',
  //开发服务配置
  devServer: {
    port: 8070,
    host: '127.0.0.1',
    https: false,
    open: true
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
    

    config.module
      .rule('scss') // 定义规则名称
      .test(/\.scss$/) // 匹配 .scss 文件
      .use('style-loader') // 添加 style-loader
      .loader('style-loader')
      .end()
      .use('css-loader') // 添加 css-loader
      .loader('css-loader')
      .options({
        importLoaders: 1,
        modules: true, // 如果需要 CSS Modules，可以设为 true
      })
      .end()
      .use('sass-loader') // 添加 sass-loader
      .loader('sass-loader');

    config.module
      .rule('babel') // 定义规则名称为 'babel'
      .test(/\.m?js$/) // 匹配 JavaScript 文件，包括 .js 和 .mjs
      .exclude.add(/node_modules/) // 排除 node_modules 目录
      .end()
      .use('babel-loader') // 使用 babel-loader
      .loader('babel-loader') 
      .options({
        // 传递给 babel-loader 的选项
        presets: ['@babel/preset-env'], // 添加 Babel 预设
        plugins: ['@babel/plugin-transform-runtime'], // 添加 Babel 插件
      })

    config.module
      .rule('images') // 定义规则
      .test(/\.(png|jpg|gif|svg)$/) // 匹配文件类型
      .type('asset') // 使用 asset 模式
      .parser({
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于 10 KB 的文件内嵌为 base64
        },
      })
      .set('generator', {
        filename: 'images/[hash][ext][query]', // 自定义输出路径
      });

    config
      .plugin('eslint') // 添加一个名为 "eslint" 的插件
      .use(ESLintPlugin, [{
        extensions: ['js', 'vue'], // 检查的文件类型
        fix: true, // 自动修复可修复的错误
        emitWarning: true, // 报告警告到控制台
        emitError: false, // 不阻止构建
      }]);

    config
      .plugin('html') // 定位到默认的 html-webpack-plugin 插件
      .tap((args) => {
        // 自定义插件选项
        args[0] = {
          ...args[0],
          title: 'scda', // 设置 HTML 页面标题
          template: './public/index.html', // 指定模板路径
          inject: true, // 自动注入资源（如 CSS/JS）
        };
        return args;
      });

    config
      .plugin('compression') // 添加一个名为 "compression" 的插件
      .use(CompressionPlugin, [{
        test: /\.(js|css|html|svg)$/, // 匹配需要压缩的文件类型
        filename: '[path][base].gz', // 生成的压缩文件命名规则
        algorithm: 'gzip', // 使用 gzip 压缩算法
        threshold: 10240, // 文件大于 10 KB 时才会被压缩
        minRatio: 0.8, // 只有压缩比低于 0.8 的文件才会被生成
      }]);

    config
      .plugin('clean') // 添加插件并命名为 "clean"
      .use(CleanWebpackPlugin, [{
        cleanOnceBeforeBuildPatterns: ['**/*'], // 清理所有文件
        protectWebpackAssets: false, // 是否保护 Webpack 生成的资源文件
      }]);
  }
})
