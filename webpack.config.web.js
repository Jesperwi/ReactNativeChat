const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.web.js', // Your web entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
        // Rule for JS, JSX, TS, and TSX files
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript', // Include this line if you're using TypeScript
              ],
              plugins: [
                '@babel/plugin-transform-react-jsx', // Add your plugin here
                // You can add more plugins as needed
              ],
            },
          },
        },
        // Rule for image files
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                // Specify the name and directory for your images
                name: '[name].[ext]',
                outputPath: 'assets/images/',
              },
            },
          ],
        },
        // Add more rules for other file types as needed...
      ],
  },
  resolve: {
    alias: {
      // Alias to use web versions of React Native components
      'react-native$': 'react-native-web',
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.web.js'], // Resolve .web.js files first
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html', // Path to a template HTML file
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};
