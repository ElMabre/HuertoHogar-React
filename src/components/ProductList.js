import ProductCard from './ProductCard'; // Sin llaves {}
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'; // Para la estructura de la cuadrícula

// Datos de productos (temporalmente hardcodeados, tomados de tu productManager.js)
const initialProducts = [
  { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, categoria: 'frutas', imagen: 'img/manzana.jpg', stock: 150, descripcion: 'Manzanas Fuji crujientes y dulces...', origen: 'Valle del Maule' },
  { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, categoria: 'frutas', imagen: 'img/naranja.jpg', stock: 200, descripcion: 'Jugosas y ricas en vitamina C...', origen: 'Región de Valparaíso' },
  { id: 'FR003', nombre: 'Plátanos Cavendish', precio: 800, categoria: 'frutas', imagen: 'img/platano.jpg', stock: 250, descripcion: 'Plátanos maduros y dulces...', origen: 'Región de O\'Higgins' },
  { id: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, categoria: 'verduras', imagen: 'img/zanahoria.jpg', stock: 100, descripcion: 'Zanahorias crujientes cultivadas sin pesticidas...', origen: 'Región de O\'Higgins' },
  { id: 'VR002', nombre: 'Espinacas Frescas', precio: 700, categoria: 'verduras', imagen: 'img/espinaca.jpg', stock: 80, descripcion: 'Espinacas frescas y nutritivas...', origen: 'Región Metropolitana' },
  { id: 'VR003', nombre: 'Pimientos Tricolores', precio: 1500, categoria: 'verduras', imagen: 'img/pimiento.jpg', stock: 120, descripcion: 'Pimientos rojos, amarillos y verdes...', origen: 'Región de Valparaíso' },
  { id: 'PO001', nombre: 'Miel Orgánica', precio: 5000, categoria: 'organicos', imagen: 'img/miel.jpg', stock: 50, descripcion: 'Miel pura y orgánica...', origen: 'Región del Maule' },
  { id: 'PO002', nombre: 'Quinua Orgánica', precio: 3500, categoria: 'organicos', imagen: 'img/quinua.jpg', stock: 75, descripcion: 'Quinua orgánica de alta calidad...', origen: 'Región de La Araucanía' },
  { id: 'PL001', nombre: 'Leche Entera', precio: 1200, categoria: 'lacteos', imagen: 'img/leche.jpg', stock: 60, descripcion: 'Leche entera fresca...', origen: 'Región de Los Lagos' }
];

function ProductList() {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState([]);

  // Simula la carga de productos cuando el componente se monta
  useEffect(() => {
    // En un futuro, aquí haríamos una llamada a una API
    // Por ahora, usamos los datos hardcodeados
    setProducts(initialProducts);
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  return (
    <div>
      {/* Título (opcional, podría estar en la página que usa este componente) */}
      {/* <h2 className="mb-4">Nuestros Productos</h2> */}

      {/* Cuadrícula de productos */}
      <Row xs={1} md={2} lg={3} className="g-4"> {/* Define columnas por tamaño de pantalla */}
        {products.length > 0 ? (
          products.map(product => (
            // Cada producto se renderiza en una columna con su ProductCard
            <Col key={product.id}>
              <ProductCard product={product} /> {/* Pasa el objeto producto como prop */}
            </Col>
          ))
        ) : (
          // Mensaje si no hay productos (o mientras cargan)
          <Col>
            <p>Cargando productos...</p> {/* Podría ser un spinner */}
          </Col>
        )}
      </Row>
    </div>
  );
}

export default ProductList;