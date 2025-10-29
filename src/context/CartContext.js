import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// Datos de productos (necesitamos acceso a ellos aquí también, temporalmente duplicado)
const initialProducts = [
    { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, categoria: 'frutas', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/manzana.jpg', stock: 150, descripcion: 'Manzanas Fuji crujientes y dulces...', origen: 'Valle del Maule' },
    { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, categoria: 'frutas', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/naranja.jpg', stock: 200, descripcion: 'Jugosas y ricas en vitamina C...', origen: 'Región de Valparaíso' },
    { id: 'FR003', nombre: 'Plátanos Cavendish', precio: 800, categoria: 'frutas', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/platano.jpg', stock: 250, descripcion: 'Plátanos maduros y dulces...', origen: 'Región de O\'Higgins' },
    { id: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, categoria: 'verduras', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/zanahoria.jpg', stock: 100, descripcion: 'Zanahorias crujientes cultivadas sin pesticidas...', origen: 'Región de O\'Higgins' },
    { id: 'VR002', nombre: 'Espinacas Frescas', precio: 700, categoria: 'verduras', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/espinaca.jpg', stock: 80, descripcion: 'Espinacas frescas y nutritivas...', origen: 'Región Metropolitana' },
    { id: 'VR003', nombre: 'Pimientos Tricolores', precio: 1500, categoria: 'verduras', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/pimiento.jpg', stock: 120, descripcion: 'Pimientos rojos, amarillos y verdes...', origen: 'Región de Valparaíso' },
    { id: 'PO001', nombre: 'Miel Orgánica', precio: 5000, categoria: 'organicos', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/miel.jpg', stock: 50, descripcion: 'Miel pura y orgánica...', origen: 'Región del Maule' },
    { id: 'PO002', nombre: 'Quinua Orgánica', precio: 3500, categoria: 'organicos', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/quinua.jpg', stock: 75, descripcion: 'Quinua orgánica de alta calidad...', origen: 'Región de La Araucanía' },
    { id: 'PL001', nombre: 'Leche Entera', precio: 1200, categoria: 'lacteos', imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/leche.jpg', stock: 60, descripcion: 'Leche entera fresca...', origen: 'Región de Los Lagos' }
  ];


// 2. Crear el Proveedor del Contexto
export const CartProvider = ({ children }) => {
  // Estado principal: array de items en el carrito
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito inicial desde localStorage
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  // Efecto para guardar en localStorage cada vez que cartItems cambie
  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para manipular el carrito ---

  // Función para añadir un producto (similar a tu cartManager)
  const addToCart = (productId, quantity = 1) => {
    const product = initialProducts.find(p => p.id === productId);
    if (!product) {
      console.error("Producto no encontrado:", productId);
      // showToast('Producto no encontrado', 'danger'); // Implementar toasts después
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);

      // Verificar stock general
      const currentQuantityInCart = existingItemIndex !== -1 ? prevItems[existingItemIndex].cantidad : 0;
      if (product.stock < currentQuantityInCart + quantity) {
         console.warn("Stock insuficiente para:", productId);
        // showToast('No hay suficiente stock disponible', 'warning');
        alert('No hay suficiente stock disponible'); // Temporal
        return prevItems; // No modificar el carrito si no hay stock
      }


      if (existingItemIndex !== -1) {
        // Producto ya existe, actualizar cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += quantity;
        return updatedItems;
      } else {
        // Producto no existe, añadirlo
        return [...prevItems, {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.imagen,
          stock: product.stock, // Guardamos el stock para referencia
          cantidad: quantity
        }];
      }
    });
    // showToast(`${product.nombre} añadido al carrito`, 'success'); // Implementar toasts después
  };

  // --- Otras funciones (removeFromCart, updateQuantity, clearCart, etc.) ---
  // Las añadiremos en el siguiente paso

  // --- Valores calculados (totalItems, subtotal, total) ---
   const getTotalItems = () => {
     return cartItems.reduce((total, item) => total + item.cantidad, 0);
   };

  // --- Valor que proveerá el contexto ---
  const value = {
    cartItems,
    addToCart,
    // ... (otras funciones que añadiremos)
    totalItems: getTotalItems(),
  };

  // Retorna el Provider "envolviendo" a los componentes hijos
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};