import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useProducts } from './ProductContext'; // 1. Importa el hook de productos

// 1. Crear el Contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// 2. ELIMINA la lista 'initialProducts' de 28 líneas que estaba aquí.

const SHIPPING_COST = 3500; // Costo de envío fijo

// 3. Crear el Proveedor del Contexto
export const CartProvider = ({ children }) => {
  // 3. Obtén la lista de productos del ProductContext
  const { products } = useProducts(); 

  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para manipular el carrito ---
  const addToCart = useCallback((productId, quantity = 1) => {
    // 4. Busca el producto en 'products' (del context) en lugar de 'initialProducts'
    const product = products.find(p => p.id === productId); 
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
          stock: product.stock, // Guardamos el stock MÁXIMO al añadir
          cantidad: quantity
        }];
      }
    });
  }, [products]); // 5. Añade 'products' como dependencia

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    // Podríamos añadir toast de éxito aquí
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      removeFromCart(productId);
      return;
    }

    // 6. Busca el producto en 'products' (del context)
    const product = products.find(p => p.id === productId); 
    if (!product) {
      console.error("Producto no encontrado al actualizar cantidad:", productId);
      removeFromCart(productId); // Quitar si el producto ya no existe
      return;
    }

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex === -1) return prevItems; // Item no encontrado

      // 7. Validar contra el stock del producto original
      const finalQuantity = Math.min(quantityNum, product.stock); 
      if (quantityNum > product.stock) {
        alert(`Solo quedan ${product.stock} unidades de ${product.nombre}`); // Avisar si se limitó
      }

      const updatedItems = [...prevItems];
      updatedItems[itemIndex].cantidad = finalQuantity;
      return updatedItems;
    });
  }, [removeFromCart, products]); // 8. Añade 'products' como dependencia

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) {
      alert('El carrito ya está vacío'); // Temporal
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) { // Confirmación
      setCartItems([]);
      // Podríamos añadir toast de éxito aquí
    }
  }, [cartItems.length]);

  // --- Valores calculados ---
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }, [cartItems]);


  // El envío es 0 si el subtotal es 15000 o más, o si el carrito está vacío.
  const calculateShipping = useCallback(() => {
    const sub = calculateSubtotal();
    if (sub === 0 || sub >= 15000) {
      return 0;
    }
    return SHIPPING_COST;
  }, [calculateSubtotal]); // Depende de calculateSubtotal

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};