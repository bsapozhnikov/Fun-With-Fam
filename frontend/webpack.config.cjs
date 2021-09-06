var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: __dirname + '/src/index.jsx',
    mode: 'development',
    module: {
	rules: [
	    {
		test: /\.jsx?$/,
		exclude: /node_modules/,
		loader: 'babel-loader'
	    }
	]
    },
    output: {
	filename: 'transformed.js',
	path: __dirname + '/build'
    },
    resolve: {
	extensions: ['', '.js', '.jsx'],
        fallback: {
	    child_process: false,
	    fs: false
	}
    },
    plugins: [HTMLWebpackPluginConfig]
};
