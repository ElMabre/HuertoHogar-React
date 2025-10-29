import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext'; // <-- Importación del hook del carrito

function Navigation() {
  // Obtiene el número total de items del contexto del carrito
  const { totalItems } = useCart();

  // Placeholders para el estado de autenticación (se implementará después)
  const isLoggedIn = false;
  const userName = 'Usuario';

  // Placeholder para la función de logout
  const handleLogout = () => {
    alert('Cerrando sesión... (función real pendiente)');
    // Aquí iría la lógica real de logout
  };

  return (
    <Navbar expand="lg" variant="dark" style={{ backgroundColor: '#2E8B57' }} sticky="top">
      <Container>
        {/* Logo y Nombre */}
        <LinkContainer to="/">
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-flower1 me-2"></i>HuertoHogar
          </Navbar.Brand>
        </LinkContainer>

        {/* Botón menú móvil */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* Enlaces de navegación */}
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/productos">
              <Nav.Link>Productos</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/nosotros">
              <Nav.Link>Nosotros</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/blog">
              <Nav.Link>Blog</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contacto">
              <Nav.Link>Contacto</Nav.Link>
            </LinkContainer>
          </Nav>

          {/* Icono de carrito y enlaces de usuario */}
          <Nav>
            {/* Carrito */}
            <LinkContainer to="/carrito">
              <Nav.Link>
                <i className="bi bi-cart3"></i>
                {/* Muestra el contador SOLO si hay items en el carrito */}
                {totalItems > 0 && (
                  <Badge bg="warning" text="dark" id="cartCount" className="ms-1">
                    {totalItems} {/* Muestra el número real de items */}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* Lógica de Autenticación */}
            {isLoggedIn ? (
              // Si está logueado
              <NavDropdown title={<><i className="bi bi-person-circle me-1"></i>{userName}</>} id="userDropdown">
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Si NO está logueado
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/registro">
                  <Nav.Link>Registrarse</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;