// karma.conf.js
const webpackConfig = require('./webpack.config.test'); // Usaremos un archivo separado para la config de Webpack

module.exports = function(config) {
  config.set({
    // Frameworks a usar (Jasmine en este caso)
    frameworks: ['jasmine'],

    // Archivos a cargar en el navegador
    // Usamos un patrón glob para incluir todos los archivos .spec.js o .test.js
    files: [
      'src/**/*.spec.js', // Patrón común para archivos de prueba
      'src/**/*.test.js'  // Otro patrón común
    ],

    // Preprocesadores a usar en los archivos de prueba
    // Le decimos a Karma que use Webpack para empaquetar los tests (y manejar imports, JSX)
    // y que use sourcemaps para facilitar la depuración
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/**/*.test.js': ['webpack', 'sourcemap']
    },

    // Configuración de Webpack (referencia al archivo externo)
    webpack: webpackConfig,

    // Configuración para el middleware de Webpack (necesario)
    webpackMiddleware: {
      stats: 'errors-only' // Muestra solo errores en la consola
    },

    // Reporters: cómo mostrar los resultados
    // 'progress' muestra el avance en la consola
    reporters: ['progress'],

    // Puerto para el servidor de Karma
    port: 9876,

    // Habilitar colores en la salida
    colors: true,

    // Nivel de logging
    // config.LOG_INFO es un buen punto de partida
    logLevel: config.LOG_INFO,

    // Auto-vigilancia: re-ejecutar tests al guardar archivos?
    autoWatch: true, // Muy útil durante el desarrollo

    // Navegadores a usar
    // karma-chrome-launcher debe estar instalado
    browsers: ['Chrome'],

    // Ejecución única: si es true, Karma lanza el navegador, corre tests y sale
    // Poner en false para desarrollo (autoWatch)
    singleRun: false,

    // Límite de concurrencia (cuántos navegadores lanzar simultáneamente)
    concurrency: Infinity
  });
};