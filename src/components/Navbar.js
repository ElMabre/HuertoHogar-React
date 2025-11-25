import React from 'react';
import { Navbar, Nav, NavDropdown, Badge, Container } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Componente de barra de navegación principal con carrito y menú de usuario
function Navigation() {
  // Obtiene datos del carrito y usuario autenticado
  const { totalItems } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Cierra sesión y redirige al inicio
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" style={{ backgroundColor: '#2E8B57' }}>
      <Container>
        {/* Logo y nombre de la marca */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-flower1 me-2"></i>HuertoHogar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Enlaces de navegación principal */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          
          {/* Carrito y menú de usuario */}
          <Nav>
            {/* Icono de carrito con badge del total de items */}
            <Nav.Link as={Link} to="/carrito" className="position-relative me-3">
              <i className="bi bi-cart3 fs-5"></i>
              {totalItems > 0 && (
                <Badge
                  bg="warning"
                  text="dark"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.65em', padding: '0.3em 0.5em' }}
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>

            {/* Menú condicional: si está autenticado muestra menú de usuario, sino muestra botones de login/registro */}
            {currentUser ? (
              <NavDropdown
                title={
                  <>
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser.nombre}
                  </>
                }
                id="userDropdown"
                align="end"
              >
                {/* Solo administradores ven el panel admin */}
                {currentUser.rol === 'ADMIN' && (
                  <NavDropdown.Item as={Link} to="/admin/dashboard">Panel Admin</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;