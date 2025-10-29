import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// Datos de productos (necesitamos acceso a ellos aquí también)
// En una app real, esto vendría de una API o un estado global centralizado
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

const SHIPPING_COST = 3500; // Costo de envío fijo

// 2. Crear el Proveedor del Contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para manipular el carrito ---

  const addToCart = useCallback((productId, quantity = 1) => {
    const product = initialProducts.find(p => p.id === productId);
    if (!product) {
      console.error("Producto no encontrado:", productId);
      alert('Producto no encontrado'); // Temporal
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      const currentQuantityInCart = existingItemIndex !== -1 ? prevItems[existingItemIndex].cantidad : 0;

      if (product.stock < currentQuantityInCart + quantity) {
        console.warn("Stock insuficiente para:", productId);
        alert('No hay suficiente stock disponible'); // Temporal
        return prevItems;
      }

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += quantity;
        return updatedItems;
      } else {
        return [...prevItems, {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.imagen,
          stock: product.stock,
          cantidad: quantity
        }];
      }
    });
  }, []); // useCallback para optimización

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    // Podríamos añadir toast de éxito aquí
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);

    // Si la cantidad no es válida o es cero o menos, eliminar el item
    if (isNaN(quantityNum) || quantityNum <= 0) {
      removeFromCart(productId);
      return;
    }

    // Buscar el producto original para verificar stock máximo
     const product = initialProducts.find(p => p.id === productId);
     if (!product) {
         console.error("Producto no encontrado al actualizar cantidad:", productId);
         removeFromCart(productId); // Quitar si el producto ya no existe
         return;
     }


    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex === -1) return prevItems; // Item no encontrado

      // Validar contra el stock del producto original
      const finalQuantity = Math.min(quantityNum, product.stock); // No permitir más que el stock

      if(quantityNum > product.stock) {
         alert(`Solo quedan ${product.stock} unidades de ${product.nombre}`); // Avisar si se limitó
      }


      const updatedItems = [...prevItems];
      updatedItems[itemIndex].cantidad = finalQuantity;
      return updatedItems;
    });
  }, [removeFromCart]); // Incluir removeFromCart como dependencia

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) {
       alert('El carrito ya está vacío'); // Temporal
       return;
    }
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) { // Confirmación
      setCartItems([]);
      // Podríamos añadir toast de éxito aquí
    }
  }, [cartItems.length]); // Depende de si hay items para mostrar confirmación

  // --- Valores calculados ---
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }, [cartItems]);

  const calculateShipping = useCallback(() => {
    return cartItems.length > 0 ? SHIPPING_COST : 0;
  }, [cartItems.length]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateShipping();
  }, [calculateSubtotal, calculateShipping]); // Depende de las otras funciones

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }, [cartItems]);

  // --- Valor que proveerá el contexto ---
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal: calculateSubtotal(),
    shippingCost: calculateShipping(),
    total: calculateTotal(),
    totalItems: getTotalItems(),
    // Podríamos añadir aquí la lista de productos `initialProducts` si fuera necesario
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};