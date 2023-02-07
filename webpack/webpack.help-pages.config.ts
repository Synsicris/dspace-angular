const pathHelp = require('path');
const CopyWebpackPluginHelp = require('copy-webpack-plugin');

const copyWebpackOptions = {
  patterns: [
    {
      from: pathHelp.join(__dirname, '..', 'src', 'help-pages'),
      to: './',
    },
  ]
};

module.exports = {
  mode: 'production',
  entry: {
    'help': './src/help-pages/empty.html'
  },
  output: {
    path: pathHelp.resolve(__dirname, '..' , 'dist/help/pages'),
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
    new CopyWebpackPluginHelp(copyWebpackOptions),
  ]
};
