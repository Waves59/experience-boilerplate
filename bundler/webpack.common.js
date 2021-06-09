const webpack = require('webpack');

const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, '../src');
const dirStatic = path.join(__dirname, '../static');
const dirStyles = path.join(__dirname, '../styles');
const dirNode = 'node_modules';

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  resolve: {
    modules: [dirApp, dirStatic, dirStyles, dirNode],
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: '',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 8 }],
        ],
      },
    }),

    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            return '[hash].[ext]';
          },
        },
      },

      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: 'warning', // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: ['gifsicle'],
              },
            },
          },
        ],
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            // options: {
            //   outputPath: 'assets/fonts/'
            // }
          },
        ],
      },

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
