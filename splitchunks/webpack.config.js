const path = require('path');
 
 const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * SplitChunksPlugin
 * 1.定义：使用SplitChunksPlugin 插件可将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
 * 2.默认只提取异步chunk
 * 
 * */ 
 
 module.exports = {
   mode:'development',
   devtool: 'inline-source-map',
   entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'async', //'all' || 'async' || 'initial'  all: 对所有chunk生效  async: 只对异步chunk生效，（如通过import()引入的模块） initial: 入口中引入的chunk
      minSize: 20000, //生成 chunk 的最小体积（以 bytes 为单位）。
      minRemainingSize: 0, //webpack5引入， 拆分后剩余的 chunk 最小体积。
      minChunks: 1, //拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 按需加载时的最大并行请求数。
      maxInitialRequests: 30, //入口点的最大并行请求数。
      enforceSizeThreshold: 50000,  // 强制执行拆分的体积阈值
      // 缓存组，每一项都具有splitChunks的属性，并继承了它的配置
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, //匹配模块路径，兼容了window文件路径
          priority: -10, //权重，数字越大表示优先级越高。一个 module 可能会满足多个 cacheGroups 的正则匹配，到底将哪个缓存组应用于这个module，取决于优先级；
          reuseExistingChunk: true, // 表示是否使用已有的 chunk，true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的，即几个chunk复用被拆分出去的一个module；
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
 };