import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';

// Inicialización del DOM virtual de React 18.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // ARQUITECTURA DE ESTADO GLOBAL (Context API):
  // Aquí envolvemos a <App /> con todos nuestros proveedores de datos.
  // Esto evita el "Prop Drilling" y hace que la info esté disponible en cualquier página.

  // 1. Nivel Superior: Autenticación
  // Lo ponemos primero porque saber "quién es el usuario" suele ser requisito para todo lo demás.
  <AuthProvider>
    
    {/* 2. Nivel Medio: Productos
        Carga el catálogo desde la API. Debe envolver al carrito porque el carrito 
        necesita validarse contra productos existentes. */}
    <ProductProvider>
      
      {/* 3. Nivel Interno: Carrito
          Maneja la lógica de compra. Al estar aquí dentro, tiene acceso a los datos 
          de Productos y del Usuario si fuera necesario. */}
      <CartProvider>
        <App />
      </CartProvider>
      
    </ProductProvider>
  </AuthProvider>
);