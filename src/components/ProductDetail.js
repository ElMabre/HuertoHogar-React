import React, { useState, useEffect } from "react";
// Importa useParams para leer parámetros de la URL
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Form, // Importar Form para el input de cantidad
  Breadcrumb,
  Alert // Importar Alert para mensajes
} from "react-bootstrap";
import { useCart } from '../context/CartContext'; 
import { useProducts } from '../context/ProductContext'; // Importar el hook de productos

function ProductDetail() {
  // Obtiene el parámetro 'id' de la URL (ej: /producto/FR001 -> id = 'FR001')
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad
  
  // Obtener funciones de los contextos
  const { addToCart } = useCart();
  const { getProductById } = useProducts();

  // Efecto para buscar el producto cuando el 'id' cambia
  useEffect(() => {
    // Usar la función del contexto
    const foundProduct = getProductById(id); 
    setProduct(foundProduct);
    setQuantity(1); // Reset quantity when product changes
  }, [id, getProductById]); // Añadir getProductById a las dependencias

  // Función para manejar el cambio en el input de cantidad
  const handleQuantityChange = ( event ) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > product.stock) {
      value = product.stock; // No permitir más que el stock
    }
    setQuantity(value);
  };

  // Función "Añadir al carrito" (ahora es real)
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, quantity);
    alert(`${quantity} x ${product.nombre} añadido(s) al carrito.`); // Placeholder para un toast
  };

  // Si el producto aún no se ha encontrado (o está cargando)
  if (!product) {
    return (
      <Container className="my-5">
        {/* Mensaje mejorado para producto no encontrado */}
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>
            El producto que buscas no existe o fue removido.
          </p>
          <hr />
          <Button as={Link} to="/productos" variant="danger">
            Volver a Productos
          </Button>
        </Alert>
      </Container>
    );
  }

  // Renderiza el detalle del producto encontrado
  return (
    <Container className="my-5">
      { /* Breadcrumb */ }
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>
          Productos
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        { /* Columna de la Imagen */ }
        <Col md={6} className="mb-4">
          <Image
            src={
              product.imagen ||
              "https://via.placeholder.com/600x400?text=Imagen+no+disponible"
            }
            alt={product.nombre}
            fluid // Hace la imagen responsiva
            rounded
            className="shadow-sm"
            style={{
              maxHeight: "400px",
              objectFit: "contain",
              width: "100%",
              background: "#fff"
              // <-- Aquí estaba el error, ya fue eliminado
            }}
          />
        </Col>

        { /* Columna de Detalles */ }
        <Col md={6} className="mb-4">
          <Badge bg="success" className="mb-2">
            {product.categoria}
          </Badge>
          <h1 style={{ color: "#8B4513" }}>{product.nombre}</h1>
          <p className="text-muted">Origen: {product.origen}</p>
          <div className="d-flex align-items-center mb-3">
            <h3 style={{ color: "#2E8B57" }} className="me-3 mb-0">
              ${product.precio.toLocaleString("es-CL")}
            </h3>
            <Badge bg={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>
              {product.stock > 10
                ? "En stock"
                : product.stock > 0
                ? "Últimas unidades"
                : "Sin Stock"}
            </Badge>
          </div>
          <p>{product.descripcion}</p>

          { /* Sección de Cantidad */ }
          {product.stock > 0 ? ( // Solo mostrar si hay stock
            <Row className="align-items-center mb-4">
              <Col xs="auto">
                <Form.Label htmlFor="cantidad" className="mb-0">
                  Cantidad:
                </Form.Label>
              </Col>
              <Col xs={4} sm={3} md={4} lg={3}>
                {/* Usar Form.Control para el input */}
                <Form.Control
                  type="number"
                  id="cantidad"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={handleQuantityChange} 
                />
              </Col>
              <Col xs="auto">
                <span className="text-muted">
                  (Disponible: {product.stock})
                </span>
              </Col>
            </Row>
          ) : (
            <Alert variant="danger" className="mt-3">Agotado</Alert>
          )}

          { /* Botones */ }
          <div className="d-grid gap-2 d-md-block">
            <Button
              variant="warning"
              onClick={handleAddToCart}
              disabled={product.stock <= 0} // Deshabilitar si no hay stock
              className="me-md-2 mb-2 mb-md-0"
              style={{ minWidth: "180px" }}
            >
      M         <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
            </Button>
          </div>

          { /* Información Adicional (basado en detalle.html) */ }
          <div className="mt-4">
            <div className="d-flex align-items-center text-muted">
              <i className="bi bi-truck me-2"></i>
  ara          <span>Envío gratis en compras sobre $15.000</span>
            </div>
            <div className="d-flex align-items-center text-muted mt-1">
              <i className="bi bi-arrow-clockwise me-2"></i>
              <span>Devolución gratuita en 7 días</span>
      sv    </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;