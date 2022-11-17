const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;
const filename = ext => isDev ? `[name].${ext}` : `[name].bundle.[hash].${ext}`;

const jsLoaders = () => {
    const loaders = ["babel-loader"];
    if (isDev) {
        loaders.push("eslint-loader");
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: ["@babel/polyfill", "./index.js"],
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "build"),
        publicPath: "/"
    },
    resolve: {
        modules: ["node_modules", path.resolve(__dirname, "src")],
        extensions: [".js"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "core": path.resolve(__dirname, "src/core")
        }
    },
    devtool: isDev ? "source-map" : false,
    target: isDev ? "web" : "browserslist",
    devServer: {
        port: 4242,
        hot: true,
        open: true,
        progress: true,
        writeToDisk: true,
        compress: true,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "build"),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "index.html",
            filename: "index.html",
            hash: isProd,
            inject: true,
            scriptLoading: "defer",
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd,
                useShortDoctype: isProd,
                keepClosingSlash: isProd,
                html5: isProd,
                minifyJS: isProd,
                minifyCSS: isProd,
                minifyURLs: isProd,
                removeAttributeQuotes: isProd,
                removeOptionalTags: isProd,
                removeRedundantAttributes: isProd,
                removeEmptyAttributes: isProd,
                removeStyleLinkTypeAttributes: isProd,
                removeScriptTypeAttributes: isProd,
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon.ico"),
                    to: path.resolve(__dirname, "build")
                },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename("css")
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
        ],
    },
};