// 1. IMPORTACIONES ACTUALIZADAS
import React, { useState } from 'react';
import { Container, Button, Table, Badge, Modal, Form, ListGroup, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';

// 2. DATOS SIMULADOS ACTUALIZADOS (con productos)
const initialOrdersData = [
  {
    id: 'PED-001',
    cliente: 'Juan Pérez',
    fecha: '2024-03-20',
    total: 45000,
    estado: 'Completado',
    metodoPago: 'Tarjeta',
    productos: [
      { id: 'FR001', nombre: 'Manzanas Fuji', cantidad: 3, precio: 1200 },
      { id: 'PO001', nombre: 'Miel Orgánica', cantidad: 1, precio: 5000 },
      { id: 'VR001', nombre: 'Zanahorias', cantidad: 2, precio: 900 }
    ]
  },
  {
    id: 'PED-002',
    cliente: 'María González',
    fecha: '2024-03-19',
    total: 28000,
    estado: 'Pendiente',
    metodoPago: 'Transferencia',
    productos: [
      { id: 'FR002', nombre: 'Naranjas Valencia', cantidad: 5, precio: 1000 },
      { id: 'PL001', nombre: 'Leche Entera', cantidad: 2, precio: 1200 }
    ]
  },
  {
    id: 'PED-003',
    cliente: 'Pedro Martínez',
    fecha: '2024-03-18',
    total: 15000,
    estado: 'En camino',
    metodoPago: 'Tarjeta',
    productos: [
      { id: 'VR002', nombre: 'Espinacas Frescas', cantidad: 4, precio: 700 }
    ]
  },
  {
    id: 'PED-004',
    cliente: 'Ana López',
    fecha: '2024-03-17',
    total: 32000,
    estado: 'Completado',
    metodoPago: 'Efectivo',
    productos: [
      { id: 'VR003', nombre: 'Pimientos Tricolores', cantidad: 2, precio: 1500 }
    ]
  }
];
// --- Fin de datos ---

function AdminPedidos() {
  useDocumentTitle('Admin: Pedidos');
  const [orders, setOrders] = useState(initialOrdersData);

  // 3. ESTADOS PARA LOS MODALS
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- Lógica para el color del Badge ---
  const getBadgeClass = (estado) => {
    const classes = {
      'Completado': 'bg-success',
      'Pendiente': 'bg-warning text-dark',
      'En camino': 'bg-info',
      'Cancelado': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
  };

  // 4. FUNCIONES MODIFICADAS (Abren Modals en lugar de Toasts)
  const handleViewOrder = (id) => {
    const order = orders.find(o => o.id === id);
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (id) => {
    const order = orders.find(o => o.id === id);
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  // 5. NUEVA FUNCIÓN PARA GUARDAR EL ESTADO DEL PEDIDO
  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const formData = new FormData(e.target);
    const newStatus = formData.get('orderStatus');

    // Simular la actualización en el estado local
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id ? { ...order, estado: newStatus } : order
      )
    );

    // Mostrar notificación de éxito
    if (window.showToast) {
      window.showToast('Estado del pedido actualizado', 'success');
    }

    handleCloseModals();
  };


  return (
    <Container fluid>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Pedidos</h1>
      </div>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Método Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaPedidos">
            {orders.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.fecha}</td>
                <td>${pedido.total.toLocaleString('es-CL')}</td>
                <td>
                  <Badge className={getBadgeClass(pedido.estado)}>
                    {pedido.estado}
                  </Badge>
                </td>
                <td>{pedido.metodoPago}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => handleViewOrder(pedido.id)}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleEditOrder(pedido.id)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* 6. AÑADIR LOS MODALS */}
      
      {/* Modal para Ver Pedido */}
      <Modal show={showViewModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Pedido: {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Row>
              <Col md={6}>
                <h5>Información del Cliente</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Cliente:</strong> {selectedOrder.cliente}</ListGroup.Item>
                  <ListGroup.Item><strong>Fecha:</strong> {selectedOrder.fecha}</ListGroup.Item>
                  <ListGroup.Item><strong>Método Pago:</strong> {selectedOrder.metodoPago}</ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Estado:</strong>
                    <Badge className={`ms-2 ${getBadgeClass(selectedOrder.estado)}`}>
                      {selectedOrder.estado}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item><strong>Total:</strong> ${selectedOrder.total.toLocaleString('es-CL')}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <h5>Productos del Pedido</h5>
                <ListGroup variant="flush">
                  {selectedOrder.productos?.map(prod => (
                    <ListGroup.Item key={prod.id} className="d-flex justify-content-between">
                      <span>{prod.nombre} (x{prod.cantidad})</span>
                      <span>${(prod.precio * prod.cantidad).toLocaleString('es-CL')}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar Pedido (Estado) */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Pedido: {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveStatus}>
          <Modal.Body>
            <p><strong>Cliente:</strong> {selectedOrder?.cliente}</p>
            <p><strong>Total:</strong> ${selectedOrder?.total.toLocaleString('es-CL')}</p>
            <Form.Group controlId="orderStatus">
              <Form.Label>Cambiar Estado del Pedido</Form.Label>
              <Form.Select name="orderStatus" defaultValue={selectedOrder?.estado} required>
                <option value="Pendiente">Pendiente</option>
                <option value="En camino">En camino</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Guardar Estado
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
    </Container>
  );
}

export default AdminPedidos;