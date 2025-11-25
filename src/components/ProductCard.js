import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * ProductCard Component
 * Esto lo que hace es: Renderiza una tarjeta visual para cada producto en el catálogo
 * Esto es para: Mostrar información básica del producto (nombre, precio, imagen, categoría)
 * y permitir que el usuario agregue el producto al carrito o vea más detalles
 */
function ProductCard({ product }) {
  // Obtener la función addToCart del contexto del carrito
  const { addToCart } = useCart();

  // Validar que el producto existe, si no retorna null
  if (!product) {
    return null;
  }

  // Esto lo que hace es: Agregar el producto al carrito si tiene stock disponible
  // Esto es para: Permitir al usuario comprar el producto desde la tarjeta
  const handleAddToCart = () => {
    // Verificar que el producto tiene stock disponible antes de agregarlo
    if (product && product.stock > 0) {
      addToCart(product.id, 1);
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      {/* Imagen del producto con enlace a la página de detalles */}
      <Link to={`/producto/${product.id}`} style={{ textDecoration: "none" }}>
        <Card.Img
          variant="top"
          src={
            product.imagen ||
            "https://via.placeholder.com/400x300?text=Imagen+no+disponible"
          }
          alt={product.nombre}
          style={{
            height: "200px",
            objectFit: "contain",
            background: "#fff",
            padding: "1rem",
          }}
        />
      </Link>
      {/* Contenido principal de la tarjeta con nombre, descripción y precio */}
      <Card.Body className="d-flex flex-column">
        {/* Nombre del producto */}
        <Card.Title style={{ color: "#8B4513" }}>{product.nombre}</Card.Title>
        
        {/* Descripción truncada a 80 caracteres para mantener el diseño compacto */}
        <Card.Text>
          {product.descripcion
            ? `${product.descripcion.substring(0, 80)}...`
            : "Descripción no disponible."}
        </Card.Text>

        {/* Precio del producto formateado en moneda CLP y unidad de medida */}
        <div className="mb-2">
          <span className="fw-bold fs-5" style={{ color: "#2E8B57" }}>
            ${product.precio ? product.precio.toLocaleString("es-CL") : "N/A"}
          </span>
          {product.unidad && (
            <span className="text-muted ms-1" style={{ fontSize: '0.9rem' }}>
              {product.unidad}
            </span>
          )}
        </div>

        {/* Categoría y origen del producto como metadata informativa */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {product.categoria && (
            <Badge bg="secondary">{product.categoria}</Badge>
          )}
          {product.origen && (
            <small className="text-muted">
              Origen: {product.origen}
            </small>
          )}
        </div>

        {/* Acciones de la tarjeta: agregar al carrito y ver detalles */}
        <div className="mt-auto d-grid gap-2">
          {/* Botón para agregar al carrito con estado deshabilitado si no hay stock */}
          <Button
            variant="warning"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <i className="bi bi-cart-plus me-1"></i>
            {product.stock > 0 ? "Añadir al carrito" : "Sin Stock"}
          </Button>
          {/* Enlace para ver información completa del producto */}
          <Link
            to={`/producto/${product.id}`}
            className="btn btn-outline-secondary w-100"
          >
            Ver detalles
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;