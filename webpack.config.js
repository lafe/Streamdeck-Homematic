/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");

const appName = "dev.fernhomberg.streamdeck.homematic.sdPlugin";
const rootDistFolder = `dist/${appName}`;


module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.ts",
    relay: "./src/propertyInspector/relay.tsx"
  },
  devtool: "inline-source-map",
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, rootDistFolder),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          enforce: true
        },
      },
    },
  }
};