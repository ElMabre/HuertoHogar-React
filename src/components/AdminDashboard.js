import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los módulos de Chart.js para usar gráficos de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Datos de ventas mensuales para el gráfico anual
const salesData = {
  labels: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ], 
  datasets: [{
    label: 'Ventas ($ CLP)', 
    data: [
      120000, 95000, 134000, 150000, 170000, 160000,
      180000, 175000, 190000, 210000, 220000, 245000
    ], 
    backgroundColor: '#2E8B57', 
  }]
};

// Configuración del gráfico: formatea valores en formato moneda CLP
const salesOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }, 
    title: { display: false }, 
  },
  scales: {
    y: {
      beginAtZero: true, 
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString('es-CL'); 
        }
      }
    }
  }
};

// Listado de productos más vendidos
const popularProducts = [
  { name: 'Manzanas Fuji', count: 45 }, 
  { name: 'Naranjas Valencia', count: 38 }, 
  { name: 'Zanahorias Orgánicas', count: 32 }, 
  { name: 'Miel Orgánica', count: 28 }, 
  { name: 'Espinacas Frescas', count: 25 }, 
];

// Componente principal del panel administrativo con métricas y gráficos
function AdminDashboard() {
  useDocumentTitle('Admin: Dashboard');
  return (
    <Container fluid>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      {/* Tarjetas de métricas principales: ventas, pedidos, usuarios y productos */}
      <Row>
        <Col md={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted">Total Ventas</h6>
                  <h3 className="card-text">$2.450.000</h3>
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-currency-dollar display-6 text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted">Total Pedidos</h6>
                  <h3 className="card-text">156</h3> 
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-cart-check display-6 text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted">Total Usuarios</h6>
                  <h3 className="card-text">89</h3> 
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-people display-6 text-info"></i> 
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted">Productos</h6>
                  <h3 className="card-text">24</h3> 
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-box-seam display-6 text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sección de gráfico de ventas mensuales y productos más vendidos */}
      <Row>
        <Col md={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Ventas Mensuales</h6>
            </Card.Header>
            <Card.Body>
              {/* Gráfico de barras con datos de ventas del año */}
              <Bar data={salesData} options={salesOptions} height={100} /> 
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Productos Populares</h6>
            </Card.Header>
            {/* Listado de productos más vendidos con contadores */}
            <ListGroup variant="flush">
              {popularProducts.map((product) => (
                <ListGroup.Item key={product.name} className="d-flex justify-content-between align-items-center">
                  {product.name}
                  <Badge bg="primary" pill>{product.count}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;