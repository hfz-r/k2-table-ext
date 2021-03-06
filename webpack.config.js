const webpackMerge = require('webpack-merge');
const common = require('./internals/webpack.common');

const envs = {
  development: 'dev',
  production: 'prod',
};
/* eslint-disable global-require,import/no-dynamic-require */
const env = envs[process.env.NODE_ENV || 'development'];
const envConfig = require(`./internals/webpack.${env}.js`);
module.exports = webpackMerge(common, envConfig);
