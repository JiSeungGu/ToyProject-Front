const path = require('path');

module.exports = {
  // ... 기존 설정
  module: {
    rules: [
      // ... 기존 룰
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'source-map-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map', // 소스 맵 설정
};