const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (_, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@assets': path.resolve(__dirname, 'src/assets')
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react'], cacheDirectory: true } }
        },
        {
          test: /\.css$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProd && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new Dotenv({ 
        path: './.env.local',
        systemvars: true,
        safe: true 
      }),
      ...(isProd ? [new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css', chunkFilename: 'css/[id].[contenthash].css' })] : [])
    ],
    devServer: {
      static: './public',
      compress: true,
      port: 4001,
      open: true,
      hot: true,
      historyApiFallback: true,
      client: { overlay: { errors: true, warnings: false } }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all', priority: 10 },
          common: { name: 'common', minChunks: 2, chunks: 'all', priority: 5, reuseExistingChunk: true }
        }
      }
    },
    devtool: isProd ? 'source-map' : 'eval-source-map'
  };
};
