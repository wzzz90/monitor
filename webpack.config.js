const path = require('path');
//webpack打包项目  htmlwebpackplugin生产产出html文件
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: './src/index.js', //入口文件
	context: process.cwd(), //上下文目录
	mode: 'development', //开发模式
	output: {
		path: path.resolve(__dirname, 'dist'), //输出目录
		filename: 'monitor.js', //文件名
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'), //devserver静态文件根目录
	},
	plugins: [
		new htmlWebpackPlugin({ template: './src/index.html', inject: 'head' }),
	],
};
