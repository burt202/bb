const webpack = require("webpack")
const {merge} = require("webpack-merge")
const common = require("./config.common.js")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{loader: MiniCssExtractPlugin.loader}, {loader: "css-loader"}],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        production: true,
        lastModified: Date.now(),
      },
    }),
  ],
})
