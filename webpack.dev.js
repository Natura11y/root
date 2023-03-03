const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const devPages = {

    // Default
    
    'Index': 'index',

    // Components

    'Accordion': 'accordion',
    'Alert': 'alert',
    'Article': 'article',
    'Aspect Ratio': 'aspect-ratio',
    'Button': 'button',
    'Border': 'border',
    'Backdrop': 'backdrop',
    'Card': 'card',
    'Color': 'color',
    'Footer': 'footer',
    'Form': 'form',
    'Grid': 'grid',
    'Modal': 'modal',
    'Navigation': 'navigation',
    'Spacer': 'spacer',
    'Tab': 'tab',
    'Table': 'table',
    'Typography': 'typography'
}

const devDir = './dist/html';

const devPage = `${devPages.Backdrop}.html`;

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    devServer: {
        port: 8000, 
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
                        loader: 'postcss-loader'
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