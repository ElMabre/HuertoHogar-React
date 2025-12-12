var webpackConfig = require('./webpack.config.test.js');

module.exports = function(config) {
  config.set({
    // Frameworks que estás usando
    frameworks: ['jasmine', 'webpack'],

    // Archivo de entrada de tus pruebas (según tus logs)
    files: [
      'src/tests.entry.js'
    ],

    // Preprocesar con webpack para entender React/JSX
    preprocessors: {
      'src/tests.entry.js': ['webpack']
    },

    // Configuración de Webpack (importada del archivo externo o definida aquí si falla)
    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false, // En servidor CI/CD suele ser false
    singleRun: true,  // Para que corra una vez y termine (ideal para scripts)

    // --- AQUÍ ESTÁ LA SOLUCIÓN DEL NAVEGADOR ---
    // Usamos un lanzador personalizado para EC2
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // Vital para correr como root/usuario en Linux
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9222'
        ]
      }
    }
  });
};
