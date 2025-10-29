import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap'; // 1. Importar Container y Form
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext'; // 2. Importar el hook de productos

// 3. ELIMINAR "initialProducts" (ya no se necesita aquí)

function ProductList() {
  // 4. Obtener la lista completa de productos del contexto
  const { products } = useProducts();

  // Estados para los filtros
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // 5. Lógica para filtrar productos (como en el productManager.js original)
  useEffect(() => {
    let tempProducts = [...products];

    // Filtrar por categoría
    if (categoryFilter) {
      tempProducts = tempProducts.filter(p => p.categoria === categoryFilter);
    }

    // Filtrar por búsqueda (nombre, descripción, origen)
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.descripcion.toLowerCase().includes(searchTerm) ||
        p.origen.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, searchFilter]); // Se ejecuta cuando cambian los productos o los filtros

  return (
    // 6. Usar el componente Container de React Bootstrap
    <Container className="my-5">
      <h1 className="text-center mb-4 section-title">Nuestros Productos</h1>

      {/* 7. Añadir los filtros (basado en productos.html) */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Select 
            id="categoriaFilter"
            value={categoryFilter}
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

      {/* 8. Grid de productos (ahora usa filteredProducts) */}
      <Row xs={1} md={2} lg={3} className="g-4" id="productGrid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          // 9. Mensaje de "No hay productos" (basado en productos.html)
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