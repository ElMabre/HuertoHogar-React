import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
// Importaremos Link de react-router-dom para el botón "Ver detalles"
import { Link } from 'react-router-dom';

// El componente recibe un objeto 'product' como prop
function ProductCard({ product }) {

  // Si no hay datos de producto, no renderizar nada (o un placeholder)
  if (!product) {
    return null;
  }

  // Función placeholder para añadir al carrito (la implementaremos después)
  const handleAddToCart = () => {
    console.log('Añadiendo al carrito:', product.id);
    // Aquí iría la lógica para llamar a la función global o del contexto del carrito
    // Ejemplo: cartManager.addToCart(product.id);
    // showToast(`${product.nombre} añadido al carrito`, 'success');
    alert(`${product.nombre} añadido (función real pendiente)`); // Temporal
  };

  return (
    <Card className="h-100 shadow-sm">
      {/* Enlace a la página de detalle */}
      <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none' }}>
        <Card.Img
          variant="top"
          src={product.imagen || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'} // Usa imagen del producto o placeholder
          alt={product.nombre}
          style={{ height: '200px', objectFit: 'contain', background: '#fff', padding: '1rem' }} // Estilos similares al CSS original
        />
      </Link>
      <Card.Body className="d-flex flex-column"> {/* Flex column para empujar botones abajo */}
        <Card.Title style={{ color: '#8B4513' }}>{product.nombre}</Card.Title>
        <Card.Text>
          {/* Muestra descripción corta si existe */}
          {product.descripcion ? `${product.descripcion.substring(0, 80)}...` : 'Descripción no disponible.'}
        </Card.Text>

        {/* Precio y Categoría */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold" style={{ color: '#2E8B57' }}>
            ${product.precio ? product.precio.toLocaleString('es-CL') : 'N/A'}
          </span>
          {product.categoria && (
            <Badge bg="secondary">{product.categoria}</Badge>
          )}
        </div>
        {/* Origen (si existe) */}
        {product.origen && (
           <small className="text-muted d-block mt-1 mb-3">Origen: {product.origen}</small>
        )}


        {/* Botones - Usamos mt-auto para empujar al final */}
        <div className="mt-auto d-grid gap-2">
          <Button variant="warning" onClick={handleAddToCart} disabled={product.stock <= 0}>
            <i className="bi bi-cart-plus me-1"></i>
            {product.stock > 0 ? 'Añadir al carrito' : 'Sin Stock'}
          </Button>
          <Link to={`/producto/${product.id}`} className="btn btn-outline-secondary w-100">
            Ver detalles
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;