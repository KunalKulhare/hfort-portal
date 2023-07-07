const path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "dist", "public"),
        publicPath: "/",
        filename: "main.js",
    },
    devtool: "source-map",
    target: "web",
    devServer: {
        port: "3000",
        static: ["./public"],
        compress: true,
        hot: true,
        liveReload: false,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
            "styled-components": path.resolve("./node_modules", "styled-components"),
          }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        sourceMap: true
                    }
                }
            },
            {
                test: /\.css/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })
    ]
};
