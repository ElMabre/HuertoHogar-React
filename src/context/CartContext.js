import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const SHIPPING_COST = 3500;

export const CartProvider = ({ children }) => {
  const { products } = useProducts();
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      if (window.showToast) window.showToast('Producto no encontrado', 'danger');
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      const currentQuantityInCart = existingItemIndex !== -1 ? prevItems[existingItemIndex].cantidad : 0;

      if (product.stock < currentQuantityInCart + quantity) {
        if (window.showToast) window.showToast('No hay suficiente stock disponible', 'warning');
        return prevItems;
      }

      if (window.showToast) window.showToast('Producto añadido al carrito', 'success');

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
  }, [products]);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (window.showToast) window.showToast('Producto eliminado del carrito', 'success');
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      if (window.showToast) window.showToast('Producto no encontrado en el inventario', 'danger');
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex === -1) return prevItems;

      const finalQuantity = Math.min(quantityNum, product.stock);

      if (quantityNum > product.stock) {
        if (window.showToast) window.showToast(`Solo quedan ${product.stock} unidades de ${product.nombre}`, 'warning');
      }

      const updatedItems = [...prevItems];
      updatedItems[itemIndex].cantidad = finalQuantity;
      return updatedItems;
    });
  }, [removeFromCart, products]);

  const clearCart = useCallback((forceClear = false) => {
    if (cartItems.length === 0 && !forceClear) {
      if (window.showToast) window.showToast('El carrito ya está vacío', 'info');
      return;
    }

    if (forceClear || window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      if (!forceClear && window.showToast) {
        window.showToast('Carrito vaciado', 'success');
      }
    }
  }, [cartItems]);

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }, [cartItems]);

  const calculateShipping = useCallback(() => {
    const sub = calculateSubtotal();
    if (sub === 0 || sub >= 15000) {
      return 0;
    }
    return SHIPPING_COST;
  }, [calculateSubtotal]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateShipping();
  }, [calculateSubtotal, calculateShipping]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }, [cartItems]);

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