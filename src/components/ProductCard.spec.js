import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext'; 

import ProductCard from './ProductCard';

describe('ProductCard', () => {

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
  it('debe renderizar el nombre y el precio del producto', () => {
    renderComponent();
    
    expect(screen.getByText('Manzana de Prueba')).toBeTruthy();
    expect(screen.getByText('$1.500')).toBeTruthy();
  });

  // --- PRUEBA 8 ---
  it('debe renderizar la unidad de medida del producto', () => {
    renderComponent();
    
    expect(screen.getByText('por kilo')).toBeTruthy();
  });

});