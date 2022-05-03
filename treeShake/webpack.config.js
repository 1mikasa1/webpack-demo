const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean:true
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
};