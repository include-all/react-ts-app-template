const path = require('path')

const { resolve } = path

// plugin
// js注入html模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 复制文件
const CopyPlugin = require('copy-webpack-plugin')
// 打包进度条
const WebpackBar = require('webpackbar')
// 编译时检查ts
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// 提取css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 删除无关样式
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { isDev, PROJECT_PATH } = require('../constant')

// css-loaders的方法提取
const getCssLoaders = (importLoaders) => [
	isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
	{
		loader: 'css-loader',
		options: {
			modules: false,
			sourceMap: isDev,
			importLoaders,
		},
	},
	{
		loader: 'postcss-loader',
		options: {
			ident: 'postcss',
			plugins: [
				// 修复一些和 flex 布局相关的 bug
				require('postcss-flexbugs-fixes'),
				require('postcss-preset-env')({
					autoprefixer: {
						grid: true,
						flexbox: 'no-2009',
					},
					stage: 3,
				}),
				require('postcss-normalize'),
			],
			sourceMap: isDev,
		},
	},
]

module.exports = {
	entry: {
		app: resolve(PROJECT_PATH, './src/index.tsx'),
	},
	output: {
		filename: `js/[name]${isDev ? '' : '.[chunkhash:8]'}.js`,
		path: resolve(PROJECT_PATH, './dist'),
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json'],
		alias: {
			'@': resolve(PROJECT_PATH, './src'),
			'@comps': resolve(PROJECT_PATH, './src/components'),
			'@utils': resolve(PROJECT_PATH, './src/utils'),
		},
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimizer: [
			// terser
			!isDev && new OptimizeCssAssetsPlugin(),
		].filter(Boolean),
	},
	performance: {
		hints: false,
	},
	module: {
		rules: [
			// react
			{
				test: /\.(tsx?|js)$/,
				loader: 'babel-loader',
				options: { cacheDirectory: true },
				exclude: /node_modules/,
			},
			// 样式
			{
				test: /\.css/,
				use: getCssLoaders(1),
			},
			{
				test: /\.less$/,
				use: [
					...getCssLoaders(2),
					{
						loader: 'less-loader',
						options: {
							sourceMap: isDev,
						},
					},
				],
			},
			// 图片
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10 * 1024, // 10k一下base64,以上直接文件
							name: '[name].[contenthash:8].[ext]',
							outputPath: 'assets/images',
						},
					},
				],
			},
			{
				test: /\.(ttf|woff|woff2|eot|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[contenthash:8].[ext]',
							outputPath: 'assets/fonts',
						},
					},
				],
			},
		],
	},
	//
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve(PROJECT_PATH, './public/index.html'),
			filename: 'index.html',
			cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
		}),
		// 复制文件
		new CopyPlugin({
			patterns: [
				{
					context: resolve(PROJECT_PATH, './public'),
					from: '*',
					to: resolve(PROJECT_PATH, './dist'),
					toType: 'dir',
				},
			],
		}),
		// 进度条
		new WebpackBar({
			name: isDev ? '正在启动' : '正在打包',
			color: '#fa8c16',
		}),
		// 打包时检查ts有无错误
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: resolve(PROJECT_PATH, './tsconfig.json'),
			},
		}),
		// 抽离css
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css',
			ignoreOrder: false,
		}),
		new PurgeCSSPlugin({
			paths: glob.sync(`${resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
			whitelist: ['html', 'body'],
		}),
	],
}
