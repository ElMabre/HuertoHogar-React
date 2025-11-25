import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext'; 

import ProductCard from './ProductCard';

/**
 * Suite de pruebas para ProductCard
 * Esto es para: Validar que el componente renderiza correctamente la información del producto
 * y que todos los elementos visuales (nombre, precio, unidad, etc.) se muestren apropiadamente
 */
describe('ProductCard', () => {

  // Objeto mock que simula los datos de un producto para las pruebas
  const mockProduct = {
    id: 'TEST001',
    nombre: 'Manzana de Prueba',
    precio: 1500,
    descripcion: 'Esta es una manzana para probar',
    imagen: '',
    stock: 10,
    categoria: 'frutas',
    origen: 'Test-Land',
    unidad: 'por kilo'
  };

  /**
   * Función auxiliar para renderizar el componente ProductCard con sus proveedores necesarios
   * Esto lo que hace es: Envuelve el componente con los Context providers (Router, ProductProvider, CartProvider)
   * que son requeridos para que el componente funcione correctamente en las pruebas
   */
  const renderComponent = () => {
    render(
      <Router>
        <ProductProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </ProductProvider>
      </Router>
    );
  };

  // --- PRUEBA 7 ---
  /**
   * Prueba: Validar que se renderiza el nombre y precio del producto
   * Esto lo que hace es: Verifica que el componente muestre correctamente el nombre "Manzana de Prueba"
   * y el precio formateado como "$1.500" en el DOM
   */
  it('debe renderizar el nombre y el precio del producto', () => {
    renderComponent();
    
    expect(screen.getByText('Manzana de Prueba')).toBeTruthy();
    expect(screen.getByText('$1.500')).toBeTruthy();
  });

  // --- PRUEBA 8 ---
  /**
   * Prueba: Validar que se renderiza la unidad de medida del producto
   * Esto lo que hace es: Verifica que el componente muestre correctamente la unidad "por kilo"
   * que indica cómo se vende el producto (por kilogramo)
   */
  it('debe renderizar la unidad de medida del producto', () => {
    renderComponent();
    
    expect(screen.getByText('por kilo')).toBeTruthy();
  });

});