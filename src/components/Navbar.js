import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext'; // <-- Importa el hook

function Navigation() {
  const { totalItems } = useCart(); // <-- Usa el hook

  // Placeholder para el estado de autenticación (se implementará después)
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
        <LinkContainer to="/">
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-flower1 me-2"></i>HuertoHogar
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="navbarNav" />

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

          <Nav>
            <LinkContainer to="/carrito">
              <Nav.Link>
                <i className="bi bi-cart3"></i>
                {totalItems > 0 && ( // <-- Muestra el badge si hay items
                  <Badge bg="warning" text="dark" id="cartCount" className="ms-1">
                    {totalItems}   {/* <-- Muestra el número real */}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {isLoggedIn ? (
              <NavDropdown title={<><i className="bi bi-person-circle me-1"></i>{userName}</>} id="userDropdown">
                <NavDropdown.Item onClick={handleLogout}> {/* Llama a handleLogout */}
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
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