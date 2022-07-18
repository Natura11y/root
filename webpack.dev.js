const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const devPages = {

    // Default
    
    'Index': 'index',

    // Components

    'Accordion': 'accordion',
    'Alerts': 'alerts',
    'Articles': 'articles',
    'Aspect Ratios': 'aspect-ratios',
    'Buttons': 'buttons',
    'Backdrops': 'backdrops',
    'Footers': 'footers',
    'Forms': 'forms',
    'Grid': 'grid',
    'Modal': 'modal',
    'Navigation': 'navigation',
    'Spacers': 'spacers',
    'Tabs': 'tabs',
    'Tables': 'tables',
    'Typography': 'typography'
}

const devDir = './dist/html';

const devPage = `${devPages.Backdrops}.html`;

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
                index: devPage
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
            template: `./${devDir}/${devPage}`,
            inject: 'body'
        })
    ]
});