import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Navigation() {
  // Placeholder para el estado de autenticación y el carrito
  const isLoggedIn = false; // Cambiará según el login
  const cartItemCount = 0; // Cambiará según el carrito
  const userName = 'Usuario'; // Cambiará según el usuario logueado

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
                {cartItemCount > 0 && (
                  <Badge bg="warning" text="dark" id="cartCount" className="ms-1">
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* Lógica de Autenticación (se implementará después) */}
            {isLoggedIn ? (
              // Si está logueado
              <NavDropdown title={<><i className="bi bi-person-circle me-1"></i>{userName}</>} id="userDropdown">
                {/* <LinkContainer to="/perfil"><NavDropdown.Item>Mi Perfil</NavDropdown.Item></LinkContainer> */}
                {/* <NavDropdown.Divider /> */}
                <NavDropdown.Item onClick={() => {/* Lógica de logout */ alert('Cerrando sesión...'); }}>
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
