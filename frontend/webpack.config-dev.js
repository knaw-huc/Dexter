const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    hot: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
      },
    },
  },

  entry: {
    app: './src/index.tsx',
  },

  mode: 'development',

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },

  output: {
    filename: '[name]-[fullhash].bundle.js',
    chunkFilename: 'js/[id].chunk.js',
    //path: path.resolve(__dirname, "dist"),
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Dexter's Lab",
      template: 'index.template.html',
      favicon: 'src/assets/favicon-32x32.png',
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(require('./package.json').version),
    }),
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    fallback: { url: false },
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  cache: {
    type: 'filesystem',
  },
};
