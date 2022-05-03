const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  // watchOptions: {
  //   // 当修改test时不触发重新编译
  //   ignored: /test.js$/,
  // },
  entry: {
     app: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};