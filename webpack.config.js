const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  {
    name: "renderer",
    entry: "./src/renderer/index.tsx",
    target: "electron-renderer",
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: "source-map",
    plugins: [new MiniCssExtractPlugin({ filename: "renderer.css" })],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    output: {
      filename: "renderer.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
];
