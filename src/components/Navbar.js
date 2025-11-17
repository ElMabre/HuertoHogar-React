import React from 'react';
import { Navbar, Nav, NavDropdown, Badge, Container } from 'react-bootstrap';
// Importa NavLink para resaltar el enlace activo
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; // Hook del carrito
import { useAuth } from '../context/AuthContext'; // 1. Importar el hook de autenticación

function Navigation() {
  const { totalItems } = useCart(); // Obtener totalItems del carrito
  // 2. Obtener currentUser y logout del AuthContext
  const { currentUser, logout } = useAuth(); 
  const navigate = useNavigate(); // Para redirigir al cerrar sesión

  // 3. Función para manejar el logout
  const handleLogout = () => {
    logout(); // Llama a la función logout del AuthContext
    navigate('/'); // Redirige al Home después de cerrar sesión
    // Ya NO necesitamos recargar la página
  };

  return (
    // 4. Usamos sticky="top" para que la navbar quede fija arriba
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" style={{backgroundColor: '#2E8B57 !important'}}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-flower1 me-2"></i>HuertoHogar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Usamos NavLink para que el enlace activo tenga la clase 'active' */}
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Nav>
            {/* Enlace al carrito con contador */}
            <Nav.Link as={Link} to="/carrito" className="position-relative">
              <i className="bi bi-cart3 fs-5"></i> {/* Icono un poco más grande */}
              {totalItems > 0 && (
                <Badge 
                  bg="warning" 
                  text="dark" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.65em', padding: '0.3em 0.5em' }} // Ajuste fino del tamaño/posición
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>

            {/* 5. Lógica condicional para mostrar enlaces de usuario */}
            {currentUser ? (
              // Si hay un usuario logueado:
              <NavDropdown 
                title={ // Título del dropdown con icono y nombre
                  <>
                    <i className="bi bi-person-circle me-1"></i> 
                    {currentUser.nombre}
                  </>
                } 
                id="userDropdown" 
                align="end" // Alinea el menú a la derecha
              >
                {/* Opción adicional: Ir al perfil (si tuvieras una página de perfil) */}
                {/* <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item> */}
                
                {/* Mostrar enlace a Admin SOLO si el rol es 'admin' */}
                {currentUser.rol === 'admin' && (
                  <NavDropdown.Item as={Link} to="/admin">Panel Admin</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Si NO hay un usuario logueado:
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