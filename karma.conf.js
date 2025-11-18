// karma.conf.js
const webpackConfig = require('./webpack.config.test');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'src/tests.entry.js'
    ],


    preprocessors: {
      'src/tests.entry.js': ['webpack', 'sourcemap']
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    

    singleRun: true, 
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    concurrency: Infinity
  });
};