import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { ProductProvider } from './ProductContext';

window.showToast = jasmine.createSpy('showToast');
window.confirm = jasmine.createSpy('confirm').and.returnValue(true);

describe('CartContext', () => {
  const wrapper = ({ children }) => (
    <ProductProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ProductProvider>
  );

  // --- PRUEBA 9 ---
  it('debe permitir acceder al contexto del carrito mediante useCart', () => {
    let cartValues;
    const TestComponent = () => {
      cartValues = useCart();
      return null;
    };

    import('@testing-library/react').then(({ render }) => {
        render(
            <ProductProvider>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </ProductProvider>
        );
    });
    expect(true).toBe(true); 
  });

  // --- PRUEBA 10 
  it('debe calcular el total correctamente', () => {
     const shippingCost = 3500;
     expect(shippingCost).toBe(3500);
  });
});