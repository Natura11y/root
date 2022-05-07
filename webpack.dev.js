const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const devDir = './dist/html';
// const devDir = './dist/html/comps/birds-landing-page';

// const devIndex = 'accordion.html';
// const devIndex = 'alerts.html';
// const devIndex = 'backdrops.html';
// const devIndex = 'buttons.html';
// const devIndex = 'footers.html';
// const devIndex = 'aspect-ratios.html';
// const devIndex = 'articles.html';
// const devIndex = 'tables.html';
// const devIndex = 'spacers.html';
// const devIndex = 'buttons.html';
// const devIndex = 'modal.html';
// const devIndex = 'primary-navigation.html';
// const devIndex = 'form-validation.html';
const devIndex = 'forms.html';
// const devIndex = 'index.html';
// const devIndex = 'typography.html';

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
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'autoprefixer'
                                    ],
                                ],
                            },
                        },
                    },
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