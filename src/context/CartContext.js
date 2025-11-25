import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useProducts } from './ProductContext';

// Crear el contexto del carrito de compras
const CartContext = createContext();

/**
 * Hook personalizado para acceder al contexto del carrito
 * Esto lo que hace es: Permite que los componentes accedan fácilmente al contexto del carrito
 * Esto es para: Simplificar el acceso a funciones y datos del carrito desde cualquier componente
 */
export const useCart = () => {
  return useContext(CartContext);
};

// Constante: Costo de envío para órdenes menores a $15.000
const SHIPPING_COST = 3500;

/**
 * CartProvider Component
 * Esto lo que hace es: Gestiona el estado del carrito de compras de toda la aplicación
 * Esto es para: Proporcionar funciones de agregar, remover, actualizar cantidad, calcular totales y persistir en localStorage
 */
export const CartProvider = ({ children }) => {
  // Obtener lista de productos del contexto de productos
  const { products } = useProducts();
  
  /**
   * Estado del carrito con inicialización desde localStorage
   * Esto lo que hace es: Carga el carrito guardado al iniciar la app, o inicia vacío si no existe
   * Esto es para: Persistir el carrito entre sesiones del usuario
   */
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  /**
   * Efecto: Guardar carrito en localStorage cada vez que cambia
   * Esto lo que hace es: Sincroniza el estado del carrito con localStorage automáticamente
   * Esto es para: Mantener el carrito persistido incluso si el usuario cierra la app
   */
  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Función: Agregar producto al carrito
   * Esto lo que hace es: Añade un producto al carrito o incrementa su cantidad si ya existe
   * Esto es para: Permitir que los usuarios agreguen productos al carrito
   */
  const addToCart = useCallback((productId, quantity = 1) => {
    // Buscar el producto en la lista de productos disponibles
    const product = products.find(p => p.id === productId);
    if (!product) {
      if (window.showToast) window.showToast('Producto no encontrado', 'danger');
      return;
    }

    setCartItems(prevItems => {
      // Buscar si el producto ya existe en el carrito
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      const currentQuantityInCart = existingItemIndex !== -1 ? prevItems[existingItemIndex].cantidad : 0;

      // Validar que hay stock suficiente para la cantidad solicitada
      if (product.stock < currentQuantityInCart + quantity) {
        if (window.showToast) window.showToast('No hay suficiente stock disponible', 'warning');
        return prevItems;
      }

      if (window.showToast) window.showToast('Producto añadido al carrito', 'success');

      // Si el producto ya existe, incrementar su cantidad
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += quantity;
        return updatedItems;
      } else {
        // Si es nuevo, agregarlo al carrito con los datos del producto
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
   * Esto lo que hace es: Elimina completamente un producto del carrito
   * Esto es para: Permitir que los usuarios eliminen productos que no desean comprar
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (window.showToast) window.showToast('Producto eliminado del carrito', 'success');
  }, []);

  /**
   * Función: Actualizar cantidad de un producto en el carrito
   * Esto lo que hace es: Cambia la cantidad de un producto o lo elimina si es <= 0
   * Esto es para: Permitir que los usuarios ajusten cuántas unidades desean comprar
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    // Convertir la cantidad a número
    const quantityNum = parseInt(newQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      // Si la cantidad es inválida o <= 0, remover el producto
      removeFromCart(productId);
      return;
    }

    // Buscar el producto en el inventario para validar stock
    const product = products.find(p => p.id === productId);
    if (!product) {
      if (window.showToast) window.showToast('Producto no encontrado en el inventario', 'danger');
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex === -1) return prevItems;

      // Limitar la cantidad a lo disponible en stock
      const finalQuantity = Math.min(quantityNum, product.stock);

      // Mostrar advertencia si se solicitó más de lo disponible
      if (quantityNum > product.stock) {
        if (window.showToast) window.showToast(`Solo quedan ${product.stock} unidades de ${product.nombre}`, 'warning');
      }

      // Actualizar la cantidad del producto
      const updatedItems = [...prevItems];
      updatedItems[itemIndex].cantidad = finalQuantity;
      return updatedItems;
    });
  }, [removeFromCart, products]);

  /**
   * Función: Vaciar el carrito
   * Esto lo que hace es: Elimina todos los productos del carrito (con confirmación opcional)
   * Esto es para: Permitir que los usuarios limpien su carrito rápidamente
   */
  const clearCart = useCallback((forceClear = false) => {
    // Si el carrito está vacío y no se fuerza, mostrar mensaje
    if (cartItems.length === 0 && !forceClear) {
      if (window.showToast) window.showToast('El carrito ya está vacío', 'info');
      return;
    }

    // Pedir confirmación o vaciar directamente si forceClear es true
    if (forceClear || window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      if (!forceClear && window.showToast) {
        window.showToast('Carrito vaciado', 'success');
      }
    }
  }, [cartItems]);

  /**
   * Función: Calcular subtotal del carrito
   * Esto lo que hace es: Suma el costo de todos los productos (cantidad × precio)
   * Esto es para: Obtener el monto antes de envío e impuestos
   */
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }, [cartItems]);

  /**
   * Función: Calcular costo de envío
   * Esto lo que hace is: Define envío gratis para órdenes >= $15.000, sino cuesta $3.500
   * Esto es para: Incentivar compras mayores con envío gratis
   */
  const calculateShipping = useCallback(() => {
    const sub = calculateSubtotal();
    // Envío gratis si la orden está vacía o supera $15.000
    if (sub === 0 || sub >= 15000) {
      return 0;
    }
    return SHIPPING_COST;
  }, [calculateSubtotal]);

  /**
   * Función: Calcular total final
   * Esto lo que hace es: Suma subtotal + costo de envío
   * Esto es para: Obtener el monto total que debe pagar el cliente
   */
  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateShipping();
  }, [calculateSubtotal, calculateShipping]);

  /**
   * Función: Obtener cantidad total de items en el carrito
   * Esto lo que hace es: Suma la cantidad de todas las unidades (no items únicos)
   * Esto es para: Mostrar el badge del carrito en la navbar con el total de productos
   */
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }, [cartItems]);

  // Objeto con todos los valores y funciones que proporciona el contexto
  const value = {
    cartItems,              // Array de productos en el carrito
    addToCart,              // Función para agregar productos
    removeFromCart,         // Función para eliminar productos
    updateQuantity,         // Función para cambiar cantidad
    clearCart,              // Función para vaciar el carrito
    subtotal: calculateSubtotal(),        // Monto antes de envío
    shippingCost: calculateShipping(),    // Costo de envío
    total: calculateTotal(),              // Monto total a pagar
    totalItems: getTotalItems(),          // Cantidad total de unidades
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};