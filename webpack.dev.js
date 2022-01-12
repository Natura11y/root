const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const devDir = './dist/html';

// const devIndex = 'buttons.html';
// const devIndex = 'footers.html';
// const devIndex = 'inform.html';
// const devIndex = 'accordion.html';
const devIndex = 'typography.html';

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    devServer: {
        port: 8080, 
        hot: true,
        open: true,
        static: {
            directory: path.resolve(__dirname, devDir),
            staticOptions: {
                index: devIndex
            },
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `./${devDir}/${devIndex}`,
            inject: 'body'
        })
    ]
});