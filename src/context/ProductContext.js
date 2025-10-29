import React, { createContext, useContext, useState } from 'react';

// 1. Datos (los movemos aquí desde ProductList.js)
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

// 2. Crear el Contexto
const ProductContext = createContext();

// 3. Crear el Hook para consumir el contexto
export const useProducts = () => {
  return useContext(ProductContext);
};

// 4. Crear el Proveedor
export const ProductProvider = ({ children }) => {
  // Por ahora, los productos son estáticos, pero en el futuro podrían venir de una API
  const [products, setProducts] = useState(initialProducts);

  // Función para obtener un solo producto por ID
  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  // Funciones para obtener productos por categoría (como en el productManager.js original)
  const getProductsByCategory = (category) => {
    return products.filter(p => p.categoria === category);
  };

  // Funciones para productos destacados (como en main.js original)
  const getFeaturedProducts = (limit = 3) => {
    return products.slice(0, limit);
  };

  const value = {
    products,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};