const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const base = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
              outputPath: 'image',
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, './typescript.json'),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                // require('autoprefixer')(),
                require('postcss-cssnext')(),
                require('cssnano')({
                  preset: 'default',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true, // 开启代码压缩
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};

let config = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    ...base,
    entry: './src/index.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
      library: 'library',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this',
    },
    devtool: 'none',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    plugins: [...base.plugins, new CleanWebpackPlugin()],
  };
} else {
  config = {
    ...base,
    entry: path.join(__dirname, 'example/src/index.tsx'),
    output: {
      path: path.join(__dirname, 'example/dist'),
      filename: 'bundle.js',
      library: 'library',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './example/src/index.html'),
        filename: 'index.html',
      }),
    ],
    // devServer: {
    //   contentBase: path.join(__dirname, '/dist/'),
    //   inline: true,
    //   host: 'localhost',
    //   port: 8080,
    // },
  };
}

module.exports = config;
