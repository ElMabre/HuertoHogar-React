import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, FormControl, Alert, Image as BsImage, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

/**
 * CartPage Component
 * Renderiza la página del carrito y maneja el flujo de pago con Mercado Pago
 */
function CartPage() {
  useDocumentTitle('Carrito de Compras');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingCost,
    total,
    totalItems
  } = useCart();

  const handleOpenCheckout = () => {
    if (!currentUser) {
        if (window.showToast) window.showToast('Debes iniciar sesión para comprar', 'warning');
        navigate('/login');
        return;
    }
    if (cartItems.length === 0) return;
    setShowPayModal(true);
  };

  /**
   * Función: Confirmar y procesar el pago (INTEGRACIÓN MERCADO PAGO)
   */
  const confirmPayment = async () => {
    const orderData = {
        total: total,
        productos: cartItems.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precio: item.precio
        }))
    };

    try {
        // 1. Enviamos el pedido al backend
        // El backend ahora devuelve: { pedido: {...}, paymentUrl: "https://..." }
        const response = await apiService.post('/pedidos', orderData, true); 

        if (window.showToast) window.showToast('Procesando pago...', 'info');
        
        // 2. Verificamos si recibimos la URL de pago de Mercado Pago
        if (response && response.paymentUrl) {
            // Limpiamos el carrito localmente antes de irnos (opcional, depende de tu flujo preferido)
            clearCart(true);
            
            // 3. REDIRECCIÓN: Enviamos al usuario a Mercado Pago
            window.location.href = response.paymentUrl;
        } else {
            // Fallback por si algo falla y no hay URL (ej. lógica antigua)
            if (window.showToast) window.showToast('Pedido creado, pero no se recibió enlace de pago.', 'warning');
            clearCart(true);
            setShowPayModal(false);
            navigate('/');
        }

    } catch (error) {
        console.error("Error en checkout:", error);
        if (window.showToast) window.showToast('Error al procesar pedido: ' + error.message, 'danger');
        setShowPayModal(false);
    }
  };

  const handleOpenClearCart = () => {
    if (cartItems.length === 0) {
        if (window.showToast) window.showToast('El carrito ya está vacío', 'info');
        return;
    }
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    clearCart(true);
    setShowClearModal(false);
    if (window.showToast) window.showToast('Carrito vaciado', 'success');
  };

  if (totalItems === 0) {
    return (
      <Container className="my-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="mt-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Parece que aún no has añadido productos.</p>
        <Button as={Link} to="/productos" variant="primary">
          <i className="bi bi-arrow-left me-2"></i>Ver productos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center section-title mb-4">Tu Carrito de Compras</h1>
      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Productos en tu carrito ({totalItems} items)</h5>
            </Card.Header>
            <Card.Body className="p-0">
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
                      <td>
                        <div className="d-flex align-items-center">
                          <BsImage
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
                      <td className="text-center">${item.precio.toLocaleString('es-CL')}</td>
                      <td className="text-center">
                        <FormControl
                          type="number"
                          value={item.cantidad}
                          min="1"
                          max={item.stock}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          style={{ width: '70px', display: 'inline-block' }}
                          className="text-center form-control-sm input-cantidad-carrito"
                        />
                      </td>
                      <td className="text-end">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      <td className="text-center">
                        <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>
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
              <Button variant="danger" onClick={handleOpenClearCart}>
                <i className="bi bi-trash me-1"></i>Vaciar Carrito
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={4}>
          <div style={{ position: 'relative', height: '100%' }}>
            <Card className="shadow-sm" style={{ position: 'sticky', top: '90px' }}>
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
                
                {subtotal < 15000 && shippingCost > 0 && (
                  <Alert variant='info' className="text-center py-2">
                    Añade ${(15000 - subtotal).toLocaleString('es-CL')} más para envío gratis.
                  </Alert>
                )}
                
                {subtotal >= 15000 && (
                  <Alert variant='success' className="text-center py-2">
                     ¡Tienes envío gratis!
                  </Alert>
                )}

                <div className="d-grid">
                  <Button variant="success" size="lg" onClick={handleOpenCheckout}>
                    Pagar con Mercado Pago
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark fw-bold">Confirmar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i className="bi bi-credit-card-2-front text-primary display-1"></i>
          </div>
          <p className="text-center fs-5 text-dark">
            Serás redirigido a <strong>Mercado Pago</strong> para completar tu transacción de <strong>${total.toLocaleString('es-CL')}</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowPayModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmPayment} className="px-4">
            Ir a Pagar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="fw-bold text-white">Vaciar Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4 mt-3">
            <i className="bi bi-exclamation-triangle text-danger display-1"></i>
          </div>
          <p className="text-center fs-5 text-dark">
            ¿Estás seguro de que deseas eliminar <strong>todos los productos</strong> del carrito?
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmClear} className="px-4">
            Sí, vaciar carrito
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default CartPage;