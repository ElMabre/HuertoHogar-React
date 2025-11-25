import { render, screen } from '@testing-library/react';
import App from './App';

// Definimos un test unitario básico. El string describe qué estamos probando.
test('renders learn react link', () => {
  // 1. Renderizado: "Montamos" la aplicación completa en un DOM virtual para poder inspeccionarla.
  render(<App />);

  // 2. Selección: Buscamos un elemento que contenga el texto "learn react" (/i = ignora mayúsculas).
  // Como nuestro App.js ahora tiene el Navbar y el Router, este test va a FALLAR porque ese texto ya no existe.
  // Deberíamos cambiar esto para que busque algo real, como "Huerto Hogar" o el Footer.
  const linkElement = screen.getByText(/learn react/i);

  // 3. Aserción (Assert): Confirmamos que el elemento efectivamente está en el documento.
  expect(linkElement).toBeInTheDocument();
});