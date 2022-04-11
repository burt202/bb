const webpack = require("webpack")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const packageJson = require("../package.json")

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    publicPath: "/",
    path: path.join(__dirname, "../build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      crypto: false,
      buffer: false,
      path: false,
      fs: false,
      stream: false,
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: "./node_modules/sql.js/dist/sql-wasm.wasm", to: "sql-wasm.wasm"},
      ],
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
    }),
  ],
}
