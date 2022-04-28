const {merge} = require("webpack-merge")
const common = require("./config.common.js")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{loader: "style-loader"}, {loader: "css-loader"}],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        production: false,
        lastModified: Date.now(),
      },
    }),
  ],
})
