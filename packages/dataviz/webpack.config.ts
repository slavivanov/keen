import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

export default {
  mode: 'production',
  entry: {
    main: `./src/index.ts`,
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist', 'umd'),
    library: 'KeenVisualizer',
    libraryExport: 'KeenVisualizer',
    libraryTarget: 'umd',
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.umd.json',
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};
