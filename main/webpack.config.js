const path = require('path');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');

const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode:'development',
  devtool: 'inline-source-map',
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    // 多入口共享依赖，额外生成一个bundle，解决入口包含重复bundle的问题
    shared: 'lodash',
   },
  output: {
    filename: '[name].[contenthash:5].js',
    path: path.resolve(__dirname, 'dist'),
    // 每次构建前清理 /dist 文件夹
    clean: true,
    publicPath: './',
  },
  optimization: {
    /**
     * 1.runtime: 运行时生成的chunk,用来管理各个chunk之间的运行关系
     * 2.该字段是把runtime部分的代码抽离出来单独打包
     * 3.值：
     * 默认值是 false：每个入口 chunk 中直接嵌入 runtime。
     * true || 'multiple' || object：为每个入口添加一个只含有 runtime 的额外 chunk。
     * 'single': 会创建一个在所有生成 chunk 之间共享的运行时文件。
     * 
     * 4.这里配置为single是因为，对于每个 runtime chunk，导入的模块会被分别初始化，这里是同一页面引入了多个入口，所以应该只需要一个runtime
     * 5.该字段也可以用于优化持久化缓存, runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单, 模块信息清单在每次
     * 有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块信息
     * 的模块(通常会被包含在最后一个 bundle 中)缓存失效. optimization.runtimeChunk 就是告诉 webpack 是否要把这部分单独打包出来.
     * */
     runtimeChunk: 'single',
  },
  // webpack-dev-server 会从 output.path 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问。
  devServer: {
    // 将 dist 目录下的文件 serve 到 localhost:8080 下
    static: './dist',
    open:true
  },
  plugins: [
    // 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  module: {
    // 逆序， 第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，最后，webpack 期望链中的最后的 loader 返回 JavaScript。
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        //  Asset Modules 可以接收并加载任何文件，然后将其输出到构建目录。
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
      // 将toml、yaml 或 json5 文件作为 JSON 模块导入。
      {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
};