import React, { createContext, useContext, useState } from 'react';

// 1. Datos de productos iniciales (CON DESCRIPCIONES COMPLETAS Y UNIDADES)
const initialProducts = [
  { 
    id: 'FR001', 
    nombre: 'Manzanas Fuji', 
    precio: 1200, 
    categoria: 'frutas', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/manzana.jpg', 
    stock: 150, 
    // Descripción completa del PDF [cite: 7233-7234]
    descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.', 
    origen: 'Valle del Maule',
    unidad: 'por kilo' // Añadido 
  },
  { 
    id: 'FR002', 
    nombre: 'Naranjas Valencia', 
    precio: 1000, 
    categoria: 'frutas', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/naranja.jpg', 
    stock: 200, 
    // Descripción completa del PDF [cite: 7238-7239]
    descripcion: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.', 
    origen: 'Región de Valparaíso',
    unidad: 'por kilo' // Añadido [cite: 7236]
  },
  { 
    id: 'FR003', 
    nombre: 'Plátanos Cavendish', 
    precio: 800, 
    categoria: 'frutas', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/platano.jpg', 
    stock: 250, 
    // Descripción completa del PDF [cite: 7243-7244]
    descripcion: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.', 
    origen: 'Región de O\'Higgins',
    unidad: 'por kilo' // Añadido [cite: 7241]
  },
  { 
    id: 'VR001', 
    nombre: 'Zanahorias Orgánicas', 
    precio: 900, 
    categoria: 'verduras', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/zanahoria.jpg', 
    stock: 100, 
    // Descripción completa del PDF [cite: 7252-7253]
    descripcion: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.', 
    origen: 'Región de O\'Higgins',
    unidad: 'por kilo' // Añadido [cite: 7250]
  },
  { 
    id: 'VR002', 
    nombre: 'Espinacas Frescas', 
    precio: 700, 
    categoria: 'verduras', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/espinaca.jpg', 
    stock: 80, 
    // Descripción completa del PDF [cite: 7257-7258]
    descripcion: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.', 
    origen: 'Región Metropolitana',
    unidad: 'por bolsa de 500g' // Añadido 
  },
  { 
    id: 'VR003', 
    nombre: 'Pimientos Tricolores', 
    precio: 1500, 
    categoria: 'verduras', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/pimiento.jpg', 
    stock: 120, 
    // Descripción completa del PDF [cite: 7263-7264]
    descripcion: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.', 
    origen: 'Región de Valparaíso',
    unidad: 'por kilo' // Añadido [cite: 7261]
  },
  { 
    id: 'PO001', 
    nombre: 'Miel Orgánica', 
    precio: 5000, 
    categoria: 'organicos', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/miel.jpg', 
    stock: 50, 
    // Descripción completa del PDF [cite: 7272]
    descripcion: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.', 
    origen: 'Región del Maule',
    unidad: 'por frasco de 500g' // Añadido [cite: 7270]
  },
  { 
    id: 'PO002', 
    nombre: 'Quinua Orgánica', 
    precio: 3500, 
    categoria: 'organicos', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/quinua.jpg', 
    stock: 75, 
    // Descripción expandida
    descripcion: 'Quinua orgánica de alta calidad, perfecta para ensaladas y platos saludables. Es una excelente fuente de proteína vegetal y fibra.', 
    origen: 'Región de La Araucanía',
    unidad: 'por bolsa de 1kg' // Añadido (lógico)
  },
  { 
    id: 'PL001', 
    nombre: 'Leche Entera', 
    precio: 1200, 
    categoria: 'lacteos', 
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/leche.jpg', 
    stock: 60, 
    // Descripción expandida
    descripcion: 'Leche entera fresca de vacas criadas en praderas naturales. Rica en calcio y vitaminas, ideal para toda la familia.', 
    origen: 'Región de Los Lagos',
    unidad: 'por litro' // Añadido (lógico)
  }
];

// 2. Crear el Contexto
const ProductContext = createContext();

// 3. Crear el Hook para consumir el contexto
export const useProducts = () => {
  return useContext(ProductContext);
};

// 4. Crear el Proveedor
export const ProductProvider = ({ children }) => {
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