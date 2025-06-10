const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./kollywood_quizmaster/src/index.js",
  output: {
    path: path.resolve(__dirname, "../kollywood_quizmaster/dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./kollywood_quizmaster/public/index.html"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  // Added to allow connections from all hosts and fix "Invalid Host header" error
  devServer: {
    allowedHosts: "all"
  }
};
