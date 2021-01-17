var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: __dirname + '/src/index.jsx',
    module: {
	loaders: [
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
	extensions: ['', '.js', '.jsx']
    },
    plugins: [HTMLWebpackPluginConfig],
    node: {
	child_process: "empty",
	fs: "empty"
    }
};
