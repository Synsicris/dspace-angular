const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyWebpackOptions = {
  patterns: [
    {
      from: path.join(__dirname, '..', 'src', 'help-pages'),
      to: './',
    },
  ]
};

module.exports = {
  mode: 'production',
  entry: {
    'help': './src/help-pages/de-synsicrishelp_index.html'
  },
  output: {
    path: path.resolve(__dirname, '..' , 'dist/help/pages'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: '../dist/help/pages',
  },
  plugins: [
    new CopyWebpackPlugin(copyWebpackOptions),
  ]
};
