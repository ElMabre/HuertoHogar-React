import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

/**
 * AdminPage Component
 * Esto lo que hace es: Renderiza el layout del panel administrativo con menú lateral y contenido dinámico
 * Esto es para: Proporcionar una interfaz centralizada para que administradores gestionen productos, usuarios, pedidos y configuración
 */
function AdminPage() {
  // Obtener información del usuario actual logueado
  const { currentUser } = useAuth(); 
  // Hook para conocer la ruta actual y destacar el menú activo
  const location = useLocation();

  return (
    <Container fluid>
      <Row>
     
        {/* Menú lateral (Sidebar) sticky con opciones de administración */}
        <Col md={3} lg={2} className="bg-light sidebar pt-3 vh-100"
          style={{
            position: 'sticky', 
            top: 0, 
            borderRight: '1px solid #dee2e6' 
          }}>
          
          {/* Información del usuario actual en el sidebar */}
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
          
          {/* Navegación del sidebar con enlaces a diferentes módulos */}
          <Nav className="flex-column">
            {/* Enlace al Dashboard (página de inicio del admin) */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/dashboard" 
                className={location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            
            {/* Encabezado de sección: GESTIÓN */}
            <li className="nav-item mt-3 px-3">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>GESTIÓN</span>
            </li>

            {/* Enlace a la gestión de productos (crear, editar, eliminar) */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/productos" 
                className={location.pathname.startsWith('/admin/productos') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-box-seam me-2"></i>Productos
              </Nav.Link>
            </Nav.Item>
            
            {/* Enlace a la gestión de usuarios (crear, editar, eliminar, cambiar rol) */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/usuarios" 
                className={location.pathname.startsWith('/admin/usuarios') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-people me-2"></i>Usuarios
              </Nav.Link>
            </Nav.Item>
            
            {/* Enlace a la gestión de pedidos (visualizar, editar estado, ver detalles) */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/admin/pedidos" 
                className={location.pathname.startsWith('/admin/pedidos') ? 'active bg-success text-white' : ''}
              >
                <i className="bi bi-cart-check me-2"></i>Pedidos
              </Nav.Link>
            </Nav.Item>
            
            {/* Encabezado de sección: CONFIGURACIÓN */}
            <li className="nav-item mt-3 px-3">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>CONFIGURACIÓN</span>
            </li>
            
            {/* Enlace a la configuración del sistema (nombre tienda, email, envío, etc.) */}
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

        {/* Área de contenido principal - renderiza el componente específico según la ruta */}
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          {/* Outlet es un componente de react-router que renderiza el componente de la ruta activa */}
          <Outlet /> 
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;