// webpack.config.test.js
module.exports = {
  mode: 'development', // Modo desarrollo para tests
  devtool: 'inline-source-map', // Genera sourcemaps para depuración
  module: {
    rules: [
      {
        test: /\.js$/, // Aplica esta regla a archivos .js
        exclude: /node_modules/, // No procesar archivos de node_modules
        use: {
          loader: 'babel-loader', // Usar babel-loader
          options: {
            // Configuración de Babel (usará los presets que instalamos)
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      // Podríamos añadir reglas para CSS aquí si fuera necesario para los tests
      // {
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },
    ]
  },
  // Resolve extensiones (permite importar sin escribir .js)
  resolve: {
    extensions: ['.js', '.jsx'], // Añadir .jsx si usas esa extensión
  }
};