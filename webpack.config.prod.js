const path = require('path');
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'none',
  // modules are on a per file level
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  // plugisn are applied to general workflow
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};