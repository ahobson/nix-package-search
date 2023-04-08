const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const {
  outputConfig,
  copyPluginPatterns,
  scssConfig,
  entryConfig,
  terserPluginConfig,
} = require('./env.config')

const publicPath = '/nix-package-search'

module.exports = (env, options) => {
  return {
    mode: options.mode,
    entry: entryConfig,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
          type: 'javascript/auto',
          loader: 'file-loader',
          options: {
            name: 'static/[path][name].[ext]',
            context: path.resolve(__dirname, 'src/assets'),
            emitFile: false,
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'javascript/auto',
          exclude: /images/,
          loader: 'file-loader',
          options: {
            context: path.resolve(__dirname, 'src/assets'),
            name: 'static/[path][name].[ext]',
            emitFile: false,
          },
        },
      ],
    },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    output: {
      filename: 'static/js/[name].bundle.js',
      path: path.resolve(__dirname, outputConfig.destPath),
      publicPath: publicPath,
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(terserPluginConfig)],
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin(copyPluginPatterns),
      new MiniCssExtractPlugin({ filename: scssConfig.destFileName }),
      new webpack.DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify(publicPath),
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        minify: false,
      }),
      new WebpackAssetsManifest({
        publicPath: true,
      }),
    ],
  }
}
