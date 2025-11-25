import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
function AdminPage() {
  const { currentUser } = useAuth(); 
  const location = useLocation();


  return (
    <Container fluid>
      <Row>
     
        <Col md={3} lg={2} className="bg-light sidebar pt-3 vh-100"
          style={{
            position: 'sticky', 
            top: 0, 
            borderRight: '1px solid #dee2e6' 
          }}>
          {currentUser && (
            <div className="px-3 mb-3 text-center">
              <i className="bi bi-person-circle fs-4 me-2" style={{color: 'var(--verde-esmeralda)'}}></i>
              <span style={{
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
              }}>
                {currentUser.nombre}
              </span>
            </div>
          )}
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/dashboard" 
                className={location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            
            {/* Título de Sección */}
            <li className="nav-item mt-3 px-3">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>GESTIÓN</span>
            </li>

            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/productos" 
                className={location.pathname.startsWith('/admin/productos') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-box-seam me-2"></i>Productos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/usuarios" 
                className={location.pathname.startsWith('/admin/usuarios') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-people me-2"></i>Usuarios
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/pedidos" 
                className={location.pathname.startsWith('/admin/pedidos') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-cart-check me-2"></i>Pedidos
              </Nav.Link>
            </Nav.Item>
            
            {/* Título de Sección */}
            <li className="nav-item mt-3 px-3">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>CONFIGURACIÓN</span>
            </li>
            
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/configuracion" 
                className={location.pathname.startsWith('/admin/configuracion') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-gear me-2"></i>Configuración
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Contenido Principal */}
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <Outlet /> 
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;