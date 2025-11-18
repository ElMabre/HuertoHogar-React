import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Table, Badge, Modal, Form, ListGroup, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiService } from '../services/apiService';

function AdminPedidos() {
  useDocumentTitle('Admin: Pedidos');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/admin/pedidos', true);
      
      const mappedOrders = data.map(pedido => ({
        ...pedido,
        cliente: pedido.usuario ? `${pedido.usuario.nombre} ${pedido.usuario.apellido}` : 'Usuario Desconocido',
        productos: pedido.detalles ? pedido.detalles.map(d => ({
            id: d.producto.id,
            nombre: d.producto.nombre,
            cantidad: d.cantidad,
            precio: d.precioUnitario
        })) : []
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      if (window.showToast) window.showToast('Error al cargar pedidos: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getBadgeClass = (estado) => {
    const classes = {
      'Completado': 'bg-success',
      'Pendiente': 'bg-warning text-dark',
      'En camino': 'bg-info text-dark',
      'Cancelado': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const formData = new FormData(e.target);
    const newStatus = formData.get('orderStatus');

    try {
      await apiService.patch(`/admin/pedidos/${selectedOrder.id}/estado`, { estado: newStatus });
      
      if (window.showToast) window.showToast('Estado del pedido actualizado', 'success');
      
      await fetchOrders();
      handleCloseModals();
    } catch (error) {
      console.error(error);
      if (window.showToast) window.showToast('Error al actualizar: ' + error.message, 'danger');
    }
  };

  return (
    <Container fluid>
      <style type="text/css">
        {`
          .custom-admin-modal .modal-content {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #dee2e6 !important;
          }
          .custom-admin-modal .modal-title,
          .custom-admin-modal h5,
          .custom-admin-modal strong,
          .custom-admin-modal span,
          .custom-admin-modal p,
          .custom-admin-modal .list-group-item {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          .custom-admin-modal label.form-label {
            color: #000000 !important;
            font-weight: 700 !important;
          }
          .custom-admin-modal .form-select {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ced4da !important;
          }
        `}
      </style>

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Pedidos</h1>
        <Button variant="outline-secondary" size="sm" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
        </Button>
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
            {loading ? (
                 <tr><td colSpan="7" className="text-center">Cargando pedidos...</td></tr>
            ) : orders.length === 0 ? (
                 <tr><td colSpan="7" className="text-center">No hay pedidos registrados.</td></tr>
            ) : (
                orders.map(pedido => (
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
                        onClick={() => handleViewOrder(pedido)}
                    >
                        <i className="bi bi-eye"></i>
                    </Button>
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleEditOrder(pedido)}
                    >
                        <i className="bi bi-pencil"></i>
                    </Button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showViewModal} onHide={handleCloseModals} size="lg" className="custom-admin-modal">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Pedido: #{selectedOrder?.id}</Modal.Title>
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
                  {selectedOrder.productos?.map((prod, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
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

      <Modal show={showEditModal} onHide={handleCloseModals} className="custom-admin-modal">
        <Modal.Header closeButton>
          <Modal.Title>Editar Estado Pedido: #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveStatus}>
          <Modal.Body>
            <p><strong>Cliente:</strong> {selectedOrder?.cliente}</p>
            <p><strong>Total:</strong> ${selectedOrder?.total?.toLocaleString('es-CL')}</p>
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