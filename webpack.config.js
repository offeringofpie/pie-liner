const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const clip = require('clipboardy');
const NotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

const stats = {
  all: false,
  assets: true,
  cachedAssets: true,
  children: false,
  chunks: false,
  entrypoints: true,
  errorDetails: true,
  errors: true,
  hash: true,
  modules: false,
  performance: true,
  publicPath: true,
  timings: true,
  warnings: false,
  exclude: ['node_modules']
};

module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: {
      index: './src/index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx', '.tsx', '.css'],
      modules: ['node_modules'],
      symlinks: false,
      cacheWithContext: false,
      alias: {
        '@': path.join(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader', 'import-glob'],
          exclude: /node_modules/
        },
        {
          enforce: 'pre',
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                import: true,
                sourceMap: argv.mode === 'production',
                localIdentName:
                  argv.mode === 'production'
                    ? '[contentHash:3]-[emoji:3]'
                    : '[local]__[contentHash:3]'
              }
            },
            'postcss-loader',
            'typed-css-modules-loader'
          ]
        },
        {
          test: __dirname + '/src/index.html',
          use: ['html-loader']
        }
      ]
    },
    plugins: [
      new WebpackBar(),
      new NotifierPlugin({
        alwaysNotify: true,
        skipFirstNotification: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        meta: {
          viewport: 'width=device-width, initial-scale=1'
        },
        excludeAssets: [/admin.*/, '/src/js/services/sw.js', '/worker.js']
      })
    ],
    performance: {
      hints: false
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6
          }
        })
      ]
    },
    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    stats: stats,
    devServer: {
      stats: stats,
      port: 4000,
      historyApiFallback: true,
      after: function(app, server) {
        clip.writeSync('http://localhost:4000/');
      }
    },
    devtool: argv.mode === 'production' ? false : 'inline-source-map'
  };
};
