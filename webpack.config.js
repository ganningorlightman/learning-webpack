const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const optimization = () => {
    const config = {
        runtimeChunk: true,
        splitChunks: {
            chunks: "all"
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}
const filename = ext => isDev ? `[name].${ext}` : `[name].bundle.[hash].${ext}`;
const cssLoaders = extra => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        "css-loader"
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}
const babelOptions = preset => {
    const opts = {
        presets: [
            "@babel/preset-env"
        ],
        plugins: [
            "@babel/plugin-proposal-class-properties"
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}
const jsLoaders = () => {
    const loaders = [{
        loader: "babel-loader",
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push("eslint-loader")
    }

    return loaders
}
const plugins = () => {
    const base = [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title: "Webpack",
            favicon: "favicon.ico",
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
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "src/favicon.ico"),
        //             to: path.resolve(__dirname, "dist")
        //         },
        //     ]
        // }),
        new MiniCssExtractPlugin({
            filename: filename("css")
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.HotModuleReplacementPlugin(),
    ];

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode:"development",
    entry: {
        main: ["@babel/polyfill", "/index.jsx"],
        analytics: "/analytics.ts"
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", "json"],
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            "@": path.resolve(__dirname, "src"),
        },
    },
    target: isDev ? "web" : "browserslist",
    optimization: optimization(),
    devServer: {
        port: 4242,
        // https: true,
        // lazy: true,
        hot: true,
        open: true,
        progress: true,
        writeToDisk: true,
        compress: true,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
    },
    devtool: isDev ? "source-map" : false,
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-typescript")
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-react")
                }
            },
            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"],
            // },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders("sass-loader")
            },
            // {
            //     test: /\.(?:ico|gif|png|jpe?g|svg)$/i,
            //     use: ["file-loader"],
            //     type: "javascript/auto"
            // },
            {
                test: /\.(?:ico|gif|png|jpe?g)$/i,
                type: "asset/resource",
            },
            // {
            //     test: /\.(woff(2)?|eot|ttf|otf)$/,
            //     use: ["file-loader"],
            //     type: "javascript/auto"
            // },
            // {
            //     test: /\.(woff(2)?|eot|ttf|otf)$/,
            //     use: [
            //         {
            //             loader: "url-loader",
            //             options: {
            //                 limit: 8192,
            //             },
            //         },
            //     ],
            //     type: "javascript/auto"
            // },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset/inline",
            },
            // {
            //     test: /\.txt$/i,
            //     use: "raw-loader",
            //     type: "javascript/auto"
            // },
            {
                test: /\.txt$/i,
                type: "asset/source",
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"]
            },
            {
                test: /\.csv$/,
                use: ["csv-loader"]
            },
        ],
    }
}