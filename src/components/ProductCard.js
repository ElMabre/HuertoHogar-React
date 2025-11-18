import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      // Esta función ya utiliza el window.showToast (del CartContext)
      addToCart(product.id, 1);
    }
  };

  return (
    <Card className="h-100 shadow-sm">
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
      <Card.Body className="d-flex flex-column">
        
        <Card.Title style={{ color: "#8B4513" }}>{product.nombre}</Card.Title>
        <Card.Text>
          {/* Esto usará la nueva descripción larga y la acortará */}
          {product.descripcion
            ? `${product.descripcion.substring(0, 80)}...`
            : "Descripción no disponible."}
        </Card.Text>
        
        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        {/* Precio y Unidad */}
        <div className="mb-2">
          <span className="fw-bold fs-5" style={{ color: "#2E8B57" }}>
            ${product.precio ? product.precio.toLocaleString("es-CL") : "N/A"}
          </span>
          {/* Mostramos la unidad de medida */}
          {product.unidad && (
            <span className="text-muted ms-1" style={{ fontSize: '0.9rem' }}>
              {product.unidad}
            </span>
          )}
        </div>
        
        {/* Categoría y Origen (reorganizado para mejor legibilidad) */}
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
        {/* --- FIN DE LA MODIFICACIÓN --- */}

        <div className="mt-auto d-grid gap-2">
          <Button
            variant="warning"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <i className="bi bi-cart-plus me-1"></i>
            {product.stock > 0 ? "Añadir al carrito" : "Sin Stock"}
          </Button>
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