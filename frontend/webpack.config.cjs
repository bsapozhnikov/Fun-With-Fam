const path = require("path");
const HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, 'src', 'index.html'),
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: path.join(__dirname, 'src', 'index'),
    mode: 'development',
    module: {
	rules: [
	    {
		test: /\.jsx?$/,
		exclude: /node_modules/,
		loader: 'babel-loader'
	    },
	    {
		test: /\.tsx?$/,
		exclude: /node_modules/,
		loader: 'ts-loader'
	    },
	    {
		test: /\.css$/i,
		use: [
		     'style-loader',
	     		{
				loader: 'typings-for-css-modules-loader',
				options: {
					modules: true
				}
			}
		]
	    }
	]
    },
    output: {
	filename: 'transformed.js',
	path: path.join(__dirname, 'build')
    },
    resolve: {
	extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.css'],
        fallback: {
	    child_process: false,
	    fs: false
	}
    },
    plugins: [HTMLWebpackPluginConfig]
};
