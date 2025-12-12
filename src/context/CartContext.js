import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { apiService } from '../services/apiService'; // <--- IMPORTACIÓN CRÍTICA

// Crear el contexto del carrito de compras
const CartContext = createContext();

/**
 * Hook personalizado para acceder al contexto del carrito
 */
export const useCart = () => {
  return useContext(CartContext);
};

// Constante: Costo de envío para órdenes menores a $15.000
const SHIPPING_COST = 3500;

/**
 * CartProvider Component
 */
export const CartProvider = ({ children }) => {
  // Obtener lista de productos del contexto de productos
  const { products } = useProducts();
  
  /**
   * Estado del carrito con inicialización desde localStorage
   */
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  /**
   * Efecto: Guardar carrito en localStorage cada vez que cambia
   */
  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Función: Agregar producto al carrito
   */
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

  /**
   * Función: Remover producto del carrito
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (window.showToast) window.showToast('Producto eliminado del carrito', 'success');
  }, []);

  /**
   * Función: Actualizar cantidad de un producto en el carrito
   */
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

  /**
   * Función: Vaciar el carrito
   */
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

  /**
   * Función: Calcular subtotal
   */
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }, [cartItems]);

  /**
   * Función: Calcular envío
   */
  const calculateShipping = useCallback(() => {
    const sub = calculateSubtotal();
    if (sub === 0 || sub >= 15000) {
      return 0;
    }
    return SHIPPING_COST;
  }, [calculateSubtotal]);

  /**
   * Función: Calcular total final
   */
  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateShipping();
  }, [calculateSubtotal, calculateShipping]);

  /**
   * Función: Obtener cantidad total de items
   */
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }, [cartItems]);

  /**
   * --- NUEVA FUNCIÓN: PROCESAR PAGO (CHECKOUT) ---
   * Maneja la comunicación con el backend para crear el pedido.
   */
  const checkout = useCallback(async () => {
    if (cartItems.length === 0) {
        if (window.showToast) window.showToast('El carrito está vacío', 'warning');
        return null;
    }

    const totalAmount = calculateTotal();
    
    // Construimos el objeto del pedido asegurando tipos numéricos correctos
    const orderData = {
        total: totalAmount,
        productos: cartItems.map(item => ({
            productoId: item.id,
            cantidad: Number(item.cantidad), // Convertir a Number para evitar problemas con la API
            precio: Number(item.precio)      // Convertir a Number
        }))
    };

    try {
        // Llamada segura a la API (el 'true' indica que requiere Token)
        const response = await apiService.post('/pedidos', orderData, true);
        
        // Si el pedido se creó con éxito, vaciamos el carrito
        clearCart(true); 
        
        return response; // Retorna { pedido: {...}, paymentUrl: '...' }

    } catch (error) {
        console.error("Error en checkout (Context):", error);
        throw error; // Lanzamos el error para que CartPage lo muestre
    }
  }, [cartItems, calculateTotal, clearCart]);

  // Objeto con todos los valores y funciones
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,                     // <--- Exponemos la función checkout
    subtotal: calculateSubtotal(),
    shippingCost: calculateShipping(),
    total: calculateTotal(),
    totalItems: getTotalItems(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};