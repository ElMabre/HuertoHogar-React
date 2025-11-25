import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Footer de la aplicación con enlaces, contacto e información de la empresa
function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Estilos para los enlaces del footer
  const footerLinkStyle = {
    color: 'white',
    textDecoration: 'none'
  };

  const footerLinkHoverStyle = {
    color: 'var(--amarillo-mostaza)', 
  };
  
  // Componente reutilizable para enlaces con efecto hover
  const FooterLink = ({ to, children }) => {
    const [hover, setHover] = React.useState(false);
    return (
      <Nav.Link 
        as={Link} 
        to={to} 
        style={hover ? { ...footerLinkStyle, ...footerLinkHoverStyle } : footerLinkStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="p-0 mb-2" 
      >
        {children}
      </Nav.Link>
    );
  };


  return (
    <footer style={{ backgroundColor: '#343a40', color: 'white' }} className="py-4 mt-auto">
      <Container>
        <Row className="py-3">

          {/* Columna 1: Información sobre la empresa y redes sociales */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold" style={{color: 'var(--marron-claro)'}}>HuertoHogar</h5>
            <p style={{color: 'var(--gris-claro)'}}>
              Conectando a las familias chilenas con el campo desde 2019. Productos frescos y naturales directo a tu hogar.
            </p>
            {/* Enlaces a redes sociales */}
            <div className="d-flex gap-3">
              <a href="#" style={footerLinkStyle}><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" style={footerLinkStyle}><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" style={footerLinkStyle}><i className="bi bi-twitter fs-5"></i></a>
            </div>
          </Col>

          {/* Columna 2: Enlaces de navegación principal */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="fw-bold" style={{color: 'var(--marron-claro)'}}>Enlaces</h5>
            <Nav className="flex-column">
              <FooterLink to="/">Inicio</FooterLink>
              <FooterLink to="/productos">Productos</FooterLink>
              <FooterLink to="/nosotros">Nosotros</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contacto">Contacto</FooterLink>
            </Nav>
          </Col>

          {/* Columna 3: Categorías de productos */}
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="fw-bold" style={{color: 'var(--marron-claro)'}}>Categorías</h5>
            <Nav className="flex-column">
              <FooterLink to="/productos?categoria=frutas">Frutas Frescas</FooterLink>
              <FooterLink to="/productos?categoria=verduras">Verduras Orgánicas</FooterLink>
              <FooterLink to="/productos?categoria=organicos">Productos Orgánicos</FooterLink>
              <FooterLink to="/productos?categoria=lacteos">Productos Lácteos</FooterLink>
            </Nav>
          </Col>

          {/* Columna 4: Información de contacto */}
          <Col md={3}>
            <h5 className="fw-bold" style={{color: 'var(--marron-claro)'}}>Contacto</h5>
            <Nav className="flex-column" style={{color: 'var(--gris-claro)'}}>
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> Av. Principal 123, Santiago
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2"></i> +56 2 2345 6789
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope me-2"></i> contacto@huertohogar.cl
              </p>
            </Nav>
          </Col>

        </Row>
        <hr className="my-4" style={{borderColor: '#6c757d'}} />
        <Row className="align-items-center">
          <Col md={6}>
            {/* Año actual y derechos de autor dinámicos */}
            <p className="mb-0" style={{color: 'var(--gris-claro)'}}>
              © {currentYear} HuertoHogar - Todos los derechos reservados
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            {/* Enlaces legales */}
            <a href="#" style={footerLinkStyle} className="me-3">Términos y Condiciones</a>
            <a href="#" style={footerLinkStyle}>Política de Privacidad</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;