// src/tests.entry.js
import './setup-jasmine.js';

// Esta línea busca en el directorio actual (./) y todas sus subcarpetas (true)
// cualquier archivo que termine en .spec.js
const context = require.context('./', true, /\.spec\.js$/);

// Carga todos los archivos de prueba encontrados
context.keys().forEach(context);