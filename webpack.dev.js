const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const devPages = {

    // Default

    'Index': 'index',

    // Pages

    'Accordion': 'accordion',
    'Alert': 'alert',
    'Article': 'article',
    'Backdrop': 'backdrop',
    'Border': 'border',
    'Breadcrumb': 'breadcrumb',
    'Button': 'button',
    'Card': 'card',
    'Collapse': 'collapse',
    'Color': 'color',
    'Container': 'container',
    'Dropdown': 'dropdown',
    'Flyout': 'flyout',
    'Form': 'form',
    'Grid': 'grid',
    'Lightbox': 'lightbox',
    'MainMenu': 'main-menu',
    'MegaMenu': 'megamenu',
    'Modal': 'modal',
    'Navigation': 'navigation',
    'Spacer': 'spacer',
    'Tab': 'tab',
    'Table': 'table',
    'Track': 'track',
    'Typography': 'typography'
}

const devDir = './dist/html';
const devPage = `${devPages.Dropdown}.html`;

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    devServer: {
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