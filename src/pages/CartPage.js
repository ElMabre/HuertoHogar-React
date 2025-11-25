import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, FormControl, Alert, Image as BsImage, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

/**
 * CartPage Component
 * Esto lo que hace es: Renderiza la página del carrito de compras con listado de productos, resumen y opciones de pago
 * Esto es para: Permitir que los usuarios visualicen sus compras, ajusten cantidades, y procesen el pago
 */
function CartPage() {
  // Hook para actualizar el título del documento
  useDocumentTitle('Carrito de Compras');
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  // Obtener información del usuario actual
  const { currentUser } = useAuth();
  // Estado para controlar la visibilidad del modal de pago
  const [showPayModal, setShowPayModal] = useState(false);
  // Estado para controlar la visibilidad del modal de vaciar carrito
  const [showClearModal, setShowClearModal] = useState(false);
  // Obtener datos y funciones del contexto del carrito
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

  /**
   * Función: Abrir modal de checkout
   * Esto lo que hace is: Valida que el usuario esté logueado y el carrito tenga productos antes de proceder
   * Esto es para: Asegurar que solo usuarios autenticados pueden comprar
   */
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
   * Función: Confirmar y procesar el pago
   * Esto lo que hace is: Envía los datos del pedido al backend y limpia el carrito si es exitoso
   * Esto es para: Crear la orden en la base de datos y completar la transacción
   */
  const confirmPayment = async () => {
    // Preparar datos del pedido con productos y total
    const orderData = {
        total: total,
        productos: cartItems.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precio: item.precio
        }))
    };

    try {
        // Enviar pedido al backend (requiere autenticación)
        await apiService.post('/pedidos', orderData, true); 

        if (window.showToast) window.showToast('¡Pedido realizado con éxito!', 'success');
        
        // Limpiar el carrito completamente después de compra exitosa
        clearCart(true); 
        
        // Cerrar modal y redirigir a inicio
        setShowPayModal(false);
        navigate('/'); 
    } catch (error) {
        console.error("Error en checkout:", error);
        if (window.showToast) window.showToast('Error al procesar pedido: ' + error.message, 'danger');
        setShowPayModal(false);
    }
  };

  /**
   * Función: Abrir modal de confirmación para vaciar carrito
   * Esto lo que hace is: Valida que el carrito no esté vacío antes de mostrar el modal
   * Esto es para: Evitar mostrar modal si ya está vacío
   */
  const handleOpenClearCart = () => {
    if (cartItems.length === 0) {
        if (window.showToast) window.showToast('El carrito ya está vacío', 'info');
        return;
    }
    setShowClearModal(true);
  };

  /**
   * Función: Confirmar vaciamiento del carrito
   * Esto lo que hace is: Elimina todos los productos del carrito después de confirmación
   * Esto es para: Permitir que usuarios limpien su carrito completamente
   */
  const handleConfirmClear = () => {
    clearCart(true);
    setShowClearModal(false);
    if (window.showToast) window.showToast('Carrito vaciado', 'success');
  };

  /**
   * Vista: Carrito vacío
   * Esto lo que hace is: Muestra un mensaje y botón para volver a productos si el carrito está vacío
   * Esto es para: Orientar al usuario cuando no tiene artículos
   */
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
        {/* Columna izquierda: Tabla de productos en el carrito */}
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Productos en tu carrito ({totalItems} items)</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {/* Tabla responsiva con productos */}
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
                  {/* Renderizar cada producto del carrito */}
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        {/* Imagen y nombre del producto con enlace a detalle */}
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
                      {/* Precio unitario del producto */}
                      <td className="text-center">${item.precio.toLocaleString('es-CL')}</td>
                      {/* Control para cambiar cantidad (editable) */}
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
                      {/* Subtotal: precio × cantidad */}
                      <td className="text-end">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      {/* Botón para remover el producto del carrito */}
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
            {/* Pie de tarjeta con opciones de navegación */}
            <Card.Footer className="bg-light d-flex justify-content-between align-items-center py-3">
              {/* Botón para volver a comprar más productos */}
              <Button as={Link} to="/productos" variant="outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>Seguir Comprando
              </Button>
              
              {/* Botón para vaciar todo el carrito */}
              <Button variant="danger" onClick={handleOpenClearCart}>
                <i className="bi bi-trash me-1"></i>Vaciar Carrito
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* Columna derecha: Resumen de compra (sticky) */}
        <Col lg={4}>
          <div style={{ position: 'relative', height: '100%' }}>
            <Card className="shadow-sm" style={{ position: 'sticky', top: '90px' }}>
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Resumen de Compra</h5>
              </Card.Header>
              <Card.Body>
                {/* Desglose de costos */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span id="subtotal">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span id="shipping">${shippingCost.toLocaleString('es-CL')}</span>
                </div>
                <hr />
                {/* Total final a pagar */}
                <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                  <span>Total:</span>
                  <span id="cartTotal">${total.toLocaleString('es-CL')}</span>
                </div>
                
                {/* Alerta si falta dinero para envío gratis */}
                {subtotal < 15000 && shippingCost > 0 && (
                  <Alert variant='info' className="text-center py-2">
                    Añade ${(15000 - subtotal).toLocaleString('es-CL')} más para envío gratis.
                  </Alert>
                )}
                
                {/* Alerta de envío gratis si se alcanzó el monto */}
                {subtotal >= 15000 && (
                  <Alert variant='success' className="text-center py-2">
                     ¡Tienes envío gratis!
                  </Alert>
                )}

                {/* Botón para proceder al pago */}
                <div className="d-grid">
                  <Button variant="success" size="lg" onClick={handleOpenCheckout}>
                    Proceder al Pago
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Modal: Confirmación de pago */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark fw-bold">Confirmar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i className="bi bi-credit-card-2-front text-success display-1"></i>
          </div>
          <p className="text-center fs-5 text-dark">
            ¿Estás seguro de que deseas procesar el pago por <strong>${total.toLocaleString('es-CL')}</strong>?
          </p>
          <p className="text-center text-muted small">
            Al confirmar, se generará tu pedido y te enviaremos los detalles.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowPayModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmPayment} className="px-4">
            Confirmar y Pagar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Confirmación para vaciar carrito */}
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
          <p className="text-center text-muted small">
            Esta acción no se puede deshacer.
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