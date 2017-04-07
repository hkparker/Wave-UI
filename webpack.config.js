const path = require('path');
const webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, './src'),
	entry: {
		app: './app.js',
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist',
		filename: '[name].bundle.js',
	},
	resolve: {
        modules: [
            path.resolve(__dirname, 'src', 'js'),
            'node_modules',
        ],
    },
	devServer: {
		contentBase: path.resolve(__dirname, './src'),
	},
	module: {
		rules: [
			// Babel
			{
				test: '/\.js$/',
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015', 'stage-2'],
					},
				}],
			},
			// SASS
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
			// Add additional loaders as we have the needs
		]
	}
};