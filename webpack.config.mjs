import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import * as url from 'url';
import { config as loadEnvironmentVariables } from 'dotenv-safe';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const webpackModeToEnvFilePath = {
  production: '.env.production',
  development: '.env.development',
};

export default (_env, argv) => {
  loadEnvironmentVariables({
    path: webpackModeToEnvFilePath[argv.mode],
  });

  return {
    mode: argv.mode,
    entry: {
      'chromium/webpage-script': './src/runtime/chromium/webpage-script.ts',
      'chromium/content-script': './src/runtime/chromium/content-script.ts',
      'chromium/service-worker': './src/runtime/chromium/service-worker.ts',
      'chromium/standalone': './src/popup/standalone.ts',
    },
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'buildResults'),
      filename: '[name].js',
      publicPath: '',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './src/runtime/chromium/manifest.json', to: 'chromium' },
          { from: './src/popup/standalone.html', to: 'chromium' },
          {
            from: './src/popup/tailwindStandalone.css',
            to: 'chromium',
          },
          { from: './src/common/img', to: 'chromium/img' },
        ],
      }),
      new NodePolyfillPlugin(),
      new webpack.EnvironmentPlugin(['SENTRY_ENVIRONMENT', 'SENTRY_DSN']),
      sentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORGANISATION,
        project: process.env.SENTRY_PROJECT,
        telemetry: false,
      }),
      // new BundleAnalyzerPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /tailwind\.build\.css$/i,
          type: 'asset/source',
        },
        {
          test: /\.scss$/,
          use: [
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.mpts$/,
          use: ['mpts-loader'],
        },
      ],
    },
    optimization: {
      concatenateModules: false,
      minimize: false, // minimization causes runtime errors for some reason
      splitChunks: {
        chunks: () => false,
      },
    },
  };
};
