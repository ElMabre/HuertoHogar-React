import React from 'react';
import { Container, Row, Col, Card, Table, Button, FormControl, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importar el hook del carrito

function CartPage() {
  // Obtener datos y funciones del contexto del carrito
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingCost,
    total,
    totalItems // Usaremos totalItems para verificar si está vacío
  } = useCart();

  // Placeholder para la función de pago
  const handleCheckout = () => {
    alert('Funcionalidad de pago en desarrollo.');
    // Lógica futura: verificar login, redirigir a checkout, etc.
  };

  // Si el carrito está vacío
  if (totalItems === 0) {
    return (
      <Container className="my-5 text-center">
         {/* Icono y mensaje de carrito vacío */}
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="mt-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Parece que aún no has añadido productos.</p>
        <Button as={Link} to="/productos" variant="primary">
          <i className="bi bi-arrow-left me-2"></i>Ver productos
        </Button>
      </Container>
    );
  }

  // Si hay items en el carrito
  return (
    <Container className="my-5">
      <h1 className="text-center section-title mb-4">Tu Carrito de Compras</h1>
      <Row>
        {/* Columna de la Tabla de Items */}
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Productos en tu carrito ({totalItems} items)</h5>
            </Card.Header>
            <Card.Body className="p-0"> {/* p-0 para que la tabla ocupe todo */}
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center" style={{ minWidth: '120px' }}>Cantidad</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-center">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      {/* Nombre e Imagen */}
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.imagen || 'https://via.placeholder.com/50x50?text=N/A'}
                            alt={item.nombre}
                            rounded
                            style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '15px' }}
                          />
                          <Link to={`/producto/${item.id}`} className="text-decoration-none text-dark fw-medium">
                            {item.nombre}
                          </Link>
                        </div>
                      </td>
                      {/* Precio */}
                      <td className="text-center">${item.precio.toLocaleString('es-CL')}</td>
                      {/* Cantidad */}
                      <td className="text-center">
                        <FormControl
                          type="number"
                          value={item.cantidad}
                          min="1"
                          max={item.stock} // Usar el stock guardado en el item
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          style={{ width: '70px', display: 'inline-block' }}
                          className="text-center form-control-sm input-cantidad-carrito"
                        />
                      </td>
                      {/* Subtotal Item */}
                      <td className="text-end">${(item.prescio * item.cantidad).toLocaleString('es-CL')}</td>
                      {/* Botón Quitar */}
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Quitar ${item.nombre}`}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
             <Card.Footer className="bg-light d-flex justify-content-between align-items-center py-3">
               <Button as={Link} to="/productos" variant="outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>Seguir Comprando
               </Button>
               <Button variant="danger" onClick={clearCart}>
                    <i className="bi bi-trash me-1"></i>Vaciar Carrito
               </Button>
             </Card.Footer>
          </Card>
        </Col>

        {/* Columna del Resumen de Compra */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '80px' }}> {/* sticky-top para que siga al hacer scroll */}
            <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Resumen de Compra</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span id="subtotal">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span id="shipping">${shippingCost.toLocaleString('es-CL')}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                <span>Total:</span>
                <span id="cartTotal">${total.toLocaleString('es-CL')}</span>
              </div>
              {/* Mensaje envío gratis */}
              {subtotal < 15000 && shippingCost > 0 && (
                 <Alert variant='info' className="text-center py-2">
                    Añade ${ (15000 - subtotal).toLocaleString('es-CL') } más para envío gratis.
                 </Alert>
              )}
               {subtotal >= 15000 && (
                 <Alert variant='success' className="text-center py-2">
                    ¡Tienes envío gratis!
                 </Alert>
              )}

              <div className="d-grid">
                <Button variant="success" size="lg" onClick={handleCheckout}>
                  Proceder al Pago
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;