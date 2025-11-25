import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
// --- 1. IMPORTAR useSearchParams ---
import { useSearchParams } from 'react-router-dom'; 
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

function ProductList() {
  useDocumentTitle('Productos');
  
  const { products } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(""); 
  const [searchFilter, setSearchFilter] = useState("");
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const urlCategory = searchParams.get('categoria');
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    } else {
      setCategoryFilter("");
    }
  }, [searchParams]); 

  useEffect(() => {
    let tempProducts = [...products];
    if (categoryFilter) {
      tempProducts = tempProducts.filter(p => p.categoria === categoryFilter);
    }
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      tempProducts = tempProducts.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.descripcion.toLowerCase().includes(searchTerm) ||
        p.origen.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, searchFilter]); 

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 section-title">Nuestros Productos</h1>
      
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
      
      <Row xs={1} md={2} lg={3} className="g-4" id="productGrid">
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