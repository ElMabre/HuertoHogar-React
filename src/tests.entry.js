import './setup-jasmine.js';
const context = require.context('./', true, /\.spec\.js$/);
context.keys().forEach(context);