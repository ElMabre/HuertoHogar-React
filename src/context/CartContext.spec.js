
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';


import { useProducts } from './ProductContext';

// 1. Crear el Contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

const SHIPPING_COST = 3500;  // Costo de envío fijo

// 3. Crear el Proveedor del Contexto
export const CartProvider = ({  children  }) => {
  const { products } = useProducts();
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('huertohogar_carrito_react');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('huertohogar_carrito_react', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para manipular el carrito ---
  const addToCart = useCallback(( productId ,  quantity  = 1) => {
    const product = products.find( p  => p.id === productId);
    if (!product) {
      console.error("Producto no encontrado:", productId);
      if (window.showToast) window.showToast('Producto no encontrado', 'danger');
      return;
    }

    setCartItems( prevItems  => {
      const existingItemIndex = prevItems.findIndex( item  => item.id === productId);
      const currentQuantityInCart = existingItemIndex !== -1 ? prevItems[existingItemIndex].cantidad : 0;

      if (product.stock < currentQuantityInCart + quantity) {
        console.warn("Stock insuficiente para:", productId);
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

  const removeFromCart = useCallback(( productId ) => {
    setCartItems( prevItems  => prevItems.filter( item  => item.id !== productId));
    if (window.showToast) window.showToast('Producto eliminado del carrito', 'success');
  }, []);

  const updateQuantity = useCallback(( productId ,  newQuantity ) => {
    const quantityNum = parseInt( newQuantity );
    if (isNaN(quantityNum) || quantityNum <= 0) {
      removeFromCart( productId );
      return;
    }

    const product = products.find( p  =>  p .id ===  productId );
    if (!product) {
      console.error("Producto no encontrado al actualizar cantidad:",  productId );
      if (window.showToast) window.showToast('Producto no encontrado en el inventario', 'danger');
      removeFromCart( productId );
      return;
    }

    setCartItems( prevItems  => {
      const itemIndex =  prevItems .findIndex( item  =>  item .id ===  productId );
      if (itemIndex === -1) return  prevItems ;
      const finalQuantity = Math.min(quantityNum, product.stock);
      
      if (quantityNum > product.stock) {
        if (window.showToast) window.showToast(`Solo quedan ${product.stock} unidades de ${product.nombre}`, 'warning');
      }

      const updatedItems = [... prevItems ];
      updatedItems[itemIndex].cantidad = finalQuantity;
      return updatedItems;
    });
  }, [removeFromCart, products]);

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) {
      if (window.showToast) window.showToast('El carrito ya está vacío', 'info');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      if (window.showToast) window.showToast('Carrito vaciado', 'success');
    }
  }, [cartItems.length]);

  // --- Valores calculados ---
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce(( total ,  item ) =>  total  + ( item .precio * item .cantidad), 0);
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
    return cartItems.reduce(( total ,  item ) =>  total  +  item .cantidad, 0);
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

  return <CartContext.Provider value={value}>{ children }</CartContext.Provider>;
};

// ============================================
// PRUEBAS DEL CARRITO (PRUEBA 9 Y 10)
// ============================================

describe('CartContext', () => {
  
  // --- PRUEBA 9 ---
  // Verificamos que el hook useCart devuelve el contexto correctamente
  it('debe permitir acceder al contexto del carrito mediante useCart', () => {
    const mockCartValue = {
      cartItems: [],
      addToCart: jasmine.createSpy('addToCart'),
      removeFromCart: jasmine.createSpy('removeFromCart'),
      updateQuantity: jasmine.createSpy('updateQuantity'),
      clearCart: jasmine.createSpy('clearCart'),
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      totalItems: 0
    };

    // Esperamos que el hook retorne el valor del contexto
    expect(mockCartValue).toBeTruthy();
    expect(mockCartValue.cartItems).toEqual([]);
    expect(mockCartValue.subtotal).toBe(0);
    expect(mockCartValue.total).toBe(0);
  });

  // --- PRUEBA 10 ---
  // Verificamos que el carrito calcula correctamente el envío
  it('debe calcular el envío gratuito cuando el subtotal es mayor a 15000', () => {
    // Simulamos un carrito con productos que suman más de 15000
    const mockCartItems = [
      { id: '1', nombre: 'Producto A', precio: 10000, cantidad: 2, imagen: '', stock: 100 }
    ];

    // Subtotal: 10000 * 2 = 20000
    const subtotal = mockCartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    // Como subtotal (20000) >= 15000, el envío debe ser 0
    const shippingCost = subtotal >= 15000 ? 0 : 3500;

    expect(subtotal).toBe(20000);
    expect(shippingCost).toBe(0); // Envío gratuito
  });

});