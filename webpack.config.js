const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ["./src/js/entry.js", './src/stylesheet/app.scss'],
  output: {
   filename: '[name].bundle.js',
   path: path.resolve(__dirname, 'public')
  },
  resolve: {
   alias: {
    'omrComponents': path.resolve(__dirname, 'src/js/Components'),
    'omrActions': path.resolve(__dirname, 'src/js/Actions'),
    'omrReducers': path.resolve(__dirname, 'src/js/Reducers'),
    'omrTools': path.resolve(__dirname, 'src/js/Tools'),
   }
  },
  module: {
   rules: [
    { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
    {
     test: /\.(scss|css|sass)$/,
     exclude: /node_modules/,
     use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    }
   ]
  },
  plugins: [
   new ExtractTextPlugin({
    filename: '[name].bundle.css',
    publicPath: path.resolve(__dirname, 'public'),
    allChunks: true
   })
  ]
}
