import * as HtmlWebpackPlugin from "html-webpack-plugin"
import {merge} from "webpack-merge"
import common from "./config.common"

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "postcss-loader"},
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: false,
      templateParameters: {
        production: false,
        lastModified: Date.now(),
      },
    }),
  ],
})
