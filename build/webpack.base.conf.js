const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'));

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`,
        path: PATHS.dist
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
    rules: [
        {
            test: /\.pug$/,
            loaders: [
                {
                    loader: "html-loader"
                },
                {
                    loader: "pug-html-loader",
                    options: {
                        pretty: true
                    }
                }
            ]
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        },
        {
            test: /\.(png|gif|jpg|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                MiniCssExtractPlugin.loader,
                {
                loader: 'css-loader',
                options: { sourceMap: true }
                },
                {
                loader: 'postcss-loader',
                options: { sourceMap: true, config: { path: './postcss.config.js' } }
                },
                {
                loader: 'sass-loader',
                options: { sourceMap: true }
                }
            ]
        }
    ]
    },
    devServer: {
        overlay: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[hash].css`
        }),
        new CopyWebpackPlugin([
        {
            from: `${PATHS.src}/${PATHS.assets}images`,
            to: `${PATHS.assets}images`,
        },
        {
            from: `${PATHS.src}/${PATHS.assets}fonts`,
            to: `${PATHS.assets}fonts`,
        },
        {
            from: `${PATHS.src}/static`,
            to: '',
        }
        ]),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`
        }))
    ]
}
