import React, { useState } from 'react';
import { Container, Button, Table, Badge } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
// --- Datos de pedidos (migrado de admin.js loadOrders) ---
// Para la Evaluación 3, esto vendrá de una API.
const initialOrdersData = [
  {
    id: 'PED-001',
    cliente: 'Juan Pérez',
    fecha: '2024-03-20',
    total: 45000,
    estado: 'Completado',
    metodoPago: 'Tarjeta'
  }, // [cite: 2592-2599]
  {
    id: 'PED-002',
    cliente: 'María González',
    fecha: '2024-03-19',
    total: 28000,
    estado: 'Pendiente',
    metodoPago: 'Transferencia'
  }, // [cite: 2600-2608]
  {
    id: 'PED-003',
    cliente: 'Pedro Martínez',
    fecha: '2024-03-18',
    total: 15000,
    estado: 'En camino',
    metodoPago: 'Tarjeta'
  }, // [cite: 2609-2618]
  {
    id: 'PED-004',
    cliente: 'Ana López',
    fecha: '2024-03-17',
    total: 32000,
    estado: 'Completado',
    metodoPago: 'Efectivo'
  } // [cite: 2619-2624]
];
// --- Fin de datos ---

function AdminPedidos() {
    useDocumentTitle('Admin: Pedidos');
  const [orders, setOrders] = useState(initialOrdersData);

  // --- Lógica para el color del Badge (migrado de admin.js getBadgeClass) ---
  const getBadgeClass = (estado) => {
    const classes = {
      'Completado': 'bg-success',
      'Pendiente': 'bg-warning text-dark',
      'En camino': 'bg-info',
      'Cancelado': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary'; // [cite: 2655-2661]
  };

  // --- Lógica de botones (migrado de admin.js) ---
  const handleViewOrder = (id) => {
    alert(`Viendo pedido: ${id}`); // [cite: 2702-2704]
    // Aquí iría la lógica para mostrar un modal con el detalle del pedido
  };

  const handleEditOrder = (id) => {
    alert(`Editando pedido: ${id}`); // [cite: 2707-2709]
    // Aquí iría la lógica para editar el estado del pedido
  };

  return (
    <Container fluid>
      {/* Encabezado y filtros [cite: 4374-4378] */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Pedidos</h1>
        {/* Aquí podrías añadir el Dropdown de filtros si lo necesitas */}
      </div>

      {/* Tabla de Pedidos (migrado de admin.html y admin.js) [cite: 4378-4383] */}
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
    </Container>
  );
}

export default AdminPedidos;