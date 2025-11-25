import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom'; 
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

function ProductList() {
  useDocumentTitle('Productos');
  
  // Consumimos el contexto global. 'products' ya trae la data cargada desde la API (ver ProductContext).
  const { products } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(""); 
  const [searchFilter, setSearchFilter] = useState("");

  // Hook de React Router para leer la Query String (ej: ?categoria=frutas).
  // Esto es vital para que si un usuario comparte un link filtrado, la página cargue con ese filtro aplicado.
  const [searchParams] = useSearchParams();

  // EFECTO 1: Sincronización URL -> Estado Local
  // Se dispara al cargar la página o si cambia la URL.
  useEffect(() => {
    const urlCategory = searchParams.get('categoria');
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    } else {
      setCategoryFilter("");
    }
  }, [searchParams]); 

  // EFECTO 2: Motor de Filtrado
  // Se dispara cada vez que cambia la lista original (products) o los filtros del usuario.
  useEffect(() => {
    // Importante: Creamos una copia del array [...products] para no mutar el estado original accidentalmente.
    let tempProducts = [...products];

    // 1. Aplicar filtro de categoría exacta
    if (categoryFilter) {
      tempProducts = tempProducts.filter(p => p.categoria === categoryFilter);
    }

    // 2. Aplicar búsqueda de texto (nombre, descripción u origen)
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      tempProducts = tempProducts.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.descripcion.toLowerCase().includes(searchTerm) ||
        p.origen.toLowerCase().includes(searchTerm)
      );
    }
    
    // Actualizamos la lista que ve el usuario
    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, searchFilter]); 

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 section-title">Nuestros Productos</h1>
      
      {/* Sección de Controles (Filtros y Búsqueda) */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Select
            id="categoriaFilter"
            value={categoryFilter} 
            // Al cambiar, actualizamos el estado, lo que dispara el EFECTO 2 de arriba.
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="frutas">Frutas Frescas</option>
            <option value="verduras">Verduras Orgánicas</option>
            <option value="organicos">Productos Orgánicos</option>
            <option value="lacteos">Productos Lácteos</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            id="searchProduct"
            placeholder="Buscar productos..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </Col>
      </Row>
      
      {/* Grilla de Productos */}
      <Row xs={1} md={2} lg={3} className="g-4" id="productGrid">
        {/* Renderizado condicional: Mostramos las tarjetas o un mensaje de error si no hay coincidencias */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col className="text-center mt-5" id="noProducts">
            <i className="bi bi-search display-4 text-muted"></i>
            <h3 className="text-muted mt-3">No se encontraron productos</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ProductList;