import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Form,
  Breadcrumb,
  Alert
} from "react-bootstrap";
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useDocumentTitle(product ? product.nombre : 'Detalle del Producto');
  const { addToCart } = useCart();
  const { getProductById } = useProducts();

  useEffect(() => {
    const foundProduct = getProductById(id);
    setProduct(foundProduct);
    setQuantity(1);
  }, [id, getProductById]);

  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > product.stock) {
      value = product.stock;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, quantity);
  };

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que buscas no existe o fue removido.</p>
          <hr />
          <Button as={Link} to="/productos" variant="danger">
            Volver a Productos
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.nombre}</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={6} className="mb-4">
          <Image
            src={product.imagen || "https://via.placeholder.com/600x400?text=Imagen+no+disponible"}
            alt={product.nombre}
            fluid
            rounded
            className="shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain", width: "100%", background: "#fff" }}
          />
        </Col>
        <Col md={6} className="mb-4">
          <Badge bg="success" className="mb-2">{product.categoria}</Badge>
          <h1 style={{ color: "#8B4513" }}>{product.nombre}</h1>
          <p className="text-muted">Origen: {product.origen}</p>

          <div className="d-flex align-items-center mb-3">
            <h3 style={{ color: "#2E8B57" }} className="me-3 mb-0">
              ${product.precio.toLocaleString("es-CL")}
              {product.unidad && <span className="text-muted fs-5 ms-2" style={{ fontWeight: 400 }}>{product.unidad}</span>}
            </h3>
            <Badge bg={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>
              {product.stock > 10 ? "En stock" : product.stock > 0 ? "Últimas unidades" : "Sin Stock"}
            </Badge>
          </div>
          <p>{product.descripcion}</p>

          {product.stock > 0 ? (
            <Row className="align-items-center mb-4">
              <Col xs="auto"><Form.Label htmlFor="cantidad" className="mb-0">Cantidad:</Form.Label></Col>
              <Col xs={4} sm={3} md={4} lg={3}>
                <Form.Control type="number" id="cantidad" value={quantity} min="1" max={product.stock} onChange={handleQuantityChange} />
              </Col>
              <Col xs="auto"><span className="text-muted">(Disponible: {product.stock})</span></Col>
            </Row>
          ) : (
            <Alert variant="danger" className="mt-3">Agotado</Alert>
          )}

          <div className="d-grid gap-2 d-md-flex">
            <Button variant="warning" onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-fill">
              <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
            </Button>
            <Button variant="outline-success" className="flex-fill">
              <i className="bi bi-heart me-2"></i>Guardar
            </Button>
          </div>

          <div className="mt-4">
            <div className="d-flex align-items-center text-muted">
              <i className="bi bi-truck me-2"></i>
              <span>Envío gratis en compras sobre $15.000</span>
            </div>
            <div className="d-flex align-items-center text-muted mt-1">
              <i className="bi bi-arrow-clockwise me-2"></i>
              <span>Devolución gratuita en 7 días</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;