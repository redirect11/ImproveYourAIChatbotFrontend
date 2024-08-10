const path = require('path');
const { library } = require('webpack');

module.exports = {
  entry: {
    main: './src/index.js', // Entry point per il Chatbot
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].lib.bundle.js',
    globalObject: 'this',
    library: {
      name: 'VideoAiChatbot',
      type: 'umd',
    },
  },
  module: {
    rules: [  
      {
          test: /\.(css|scss)$/,
          use: [
          'style-loader',
          {
              loader: 'css-loader',
              options: {
              importLoaders: 1,
              modules: {
                  localIdentName: "[name]__[local]___[hash:base64:6]",
              },
              }
          }
          ],
          include: /\.module\.css$/
      },
      {
          test: /\.(css|scss)$/,
          use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          ],
          exclude: /\.module\.css$/
      },
      {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
          loader: 'babel-loader',
          options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
          }
          }
      },
      {
          test: /\.svg$/,
          use:  ['@svgr/webpack', 'file-loader'],		
          issuer: {
              and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
      }
  
      ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  }
};
