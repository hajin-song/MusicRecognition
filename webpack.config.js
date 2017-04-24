const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./src/entry.js",
  output: {
   filename: './public/[name].bundle.js'
  },
  resolve: {
   alias: {
    'omrComponents': path.resolve(__dirname, 'src/Components'),
    'omrActions': path.resolve(__dirname, 'src/Actions'),
    'omrReducers': path.resolve(__dirname, 'src/Reducers'),
   }
  },
  module: {
   loaders: [
    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
   ]
  }
}
