const webpack = require("webpack")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const packageJson = require("../package.json")

module.exports = {
  entry: ["./src/js/index.tsx"],
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
        {from: "src/favicon.ico", to: "favicon.ico"},
        {from: "src/thumb.png", to: "thumb.png"},
        {from: "./node_modules/sql.js/dist/sql-wasm.wasm", to: "sql-wasm.wasm"},
        {from: "src/images/tick.svg", to: "tick.svg"},
        {from: "src/images/cross.svg", to: "cross.svg"},
        {from: "src/images/flags/aus.svg", to: "aus.svg"},
        {from: "src/images/flags/bra.svg", to: "bra.svg"},
        {from: "src/images/flags/can.svg", to: "can.svg"},
        {from: "src/images/flags/chn.svg", to: "chn.svg"},
        {from: "src/images/flags/deu.svg", to: "deu.svg"},
        {from: "src/images/flags/fra.svg", to: "fra.svg"},
        {from: "src/images/flags/gbr.svg", to: "gbr.svg"},
        {from: "src/images/flags/ind.svg", to: "ind.svg"},
        {from: "src/images/flags/kor.svg", to: "kor.svg"},
        {from: "src/images/flags/nld.svg", to: "nld.svg"},
        {from: "src/images/flags/nzl.svg", to: "nzl.svg"},
        {from: "src/images/flags/rus.svg", to: "rus.svg"},
        {from: "src/images/flags/usa.svg", to: "usa.svg"},
      ],
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
    }),
  ],
}
