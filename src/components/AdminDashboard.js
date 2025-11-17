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

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Datos para el Gráfico (migrado de admin.js) ---
const salesData = {
  labels: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ], // [cite: 816-817]
  datasets: [{
    label: 'Ventas ($ CLP)', // [cite: 819]
    data: [
      120000, 95000, 134000, 150000, 170000, 160000,
      180000, 175000, 190000, 210000, 220000, 245000
    ], // [cite: 820-821]
    backgroundColor: '#2E8B57', // [cite: 822]
  }]
};

// --- Opciones para el Gráfico (migrado de admin.js) ---
const salesOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }, // [cite: 828]
    title: { display: false }, // [cite: 829]
  },
  scales: {
    y: {
      beginAtZero: true, // [cite: 839]
      ticks: {
        // Formatear ticks como moneda (ej. $100.000)
        callback: function(value) {
          return '$' + value.toLocaleString('es-CL'); // [cite: 842-844]
        }
      }
    }
  }
};

// --- Datos para Productos Populares (migrado de admin.html) ---
const popularProducts = [
  { name: 'Manzanas Fuji', count: 45 }, // [cite: 2441-2442]
  { name: 'Naranjas Valencia', count: 38 }, // [cite: 2443-2444]
  { name: 'Zanahorias Orgánicas', count: 32 }, // [cite: 2445-2446]
  { name: 'Miel Orgánica', count: 28 }, // [cite: 2447-2448]
  { name: 'Espinacas Frescas', count: 25 }, // [cite: 2449-2450]
];

function AdminDashboard() {
    useDocumentTitle('Admin: Dashboard');
  return (
    <Container fluid>
      {/* Encabezado */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>

      {/* Tarjetas de Estadísticas (migrado de admin.html) */}
      <Row>
        <Col md={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted">Total Ventas</h6>
                  <h3 className="card-text">$2.450.000</h3> {/* [cite: 2415] */}
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-currency-dollar display-6 text-success"></i> {/* [cite: 2417] */}
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
                  <h3 className="card-text">156</h3> {/* [cite: 2421] */}
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-cart-check display-6 text-primary"></i> {/* [cite: 2423] */}
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
                  <h3 className="card-text">89</h3> {/* [cite: 2426] */}
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-people display-6 text-info"></i> {/* [cite: 2428] */}
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
                  <h3 className="card-text">24</h3> {/* [cite: 2432] */}
                </div>
                <div className="flex-shrink-0">
                  <i className="bi bi-box-seam display-6 text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico y Productos Populares */}
      <Row>
        <Col md={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Ventas Mensuales</h6> {/* [cite: 2436] */}
            </Card.Header>
            <Card.Body>
              <Bar data={salesData} options={salesOptions} height={100} /> {/* [cite: 2437] */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Productos Populares</h6> {/* [cite: 2439] */}
            </Card.Header>
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