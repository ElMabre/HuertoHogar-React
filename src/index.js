import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  /* <React.StrictMode> 
     Se comenta StrictMode para evitar que los useEffect se ejecuten dos veces 
     en desarrollo, lo que causaba duplicidad en las notificaciones. 
  */
  <AuthProvider>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </AuthProvider>
  /* </React.StrictMode> */
);