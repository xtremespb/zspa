const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const babelConfig = require("./babel.config");

fs.removeSync(path.resolve(__dirname, "dist"));

module.exports = (env, argv) => ({
    context: path.resolve(`${__dirname}/src`),
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[fullhash:8].js"
    },
    target: ["web", "es5"],
    resolve: {
        extensions: [".js", ".marko"]
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: "babel-loader",
            options: {
                cacheDirectory: true,
                ...babelConfig()
            }
        }, {
            test: /\.(woff(2)?|ttf|eot|otf|png|jpg|svg)(\?v=\d+\.\d+\.\d+)?$/,
            type: "asset/resource",
            generator: {
                filename: "asset.[hash:8][ext]"
            }
        }, {
            test: /\.marko$/,
            loader: "@marko/webpack/loader",
        }, {
            test: /\.s?css$/,
            use: [{
                    loader: argv.mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                }, {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        sourceMap: false,
                        url: true,
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            config: path.resolve(`${__dirname}/postcss.config.js`),
                        },
                    },
                },
                {
                    loader: "sass-loader"
                },
            ].filter(i => i !== null)
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "typeof window": "'object'",
            "process.browser": true
        }),
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        argv.mode === "production" ? new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            experimentalUseImportModule: true,
        }) : () => {},
        argv.mode === "production" ? new CompressionPlugin() : () => {},
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./favicon/favicon.ico"
                },
                {
                    from: "./favicon/site.webmanifest"
                },
                {
                    from: "./favicon/favicon-16x16.png"
                },
                {
                    from: "./favicon/favicon-32x32.png"
                },
                {
                    from: "./favicon/android-chrome-512x512.png"
                },
                {
                    from: "./favicon/apple-touch-icon.png"
                },
                {
                    from: "./favicon/android-chrome-192x192.png"
                },
                {
                    from: "./misc/robots.txt"
                },
            ]
        })
    ],
    node: {
        __dirname: true,
        __filename: true
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: 3,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    filename: "npm.[contenthash:8].js",
                },
                style: {
                    name: "style",
                    test: /style\.s?css$/,
                    chunks: "all",
                    enforce: true,
                    minChunks: 2,
                    filename: "style.[contenthash:8].js",
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            }
        },
        usedExports: true,
        minimizer: argv.mode === "production" ? [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: {
                                removeAll: true
                            },
                        },
                    ],
                },
            }),
        ] : []
    }
});
