import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const __dirname = path.resolve();

export default {
  mode: isProduction ? 'production' : 'development',
  watch: !isProduction,
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
