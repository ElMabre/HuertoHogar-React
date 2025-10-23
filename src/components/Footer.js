import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Usamos Container para centrar

function Footer() {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual

  return (
    // Usamos las clases de Bootstrap y estilos en línea para replicar el original
    <footer style={{ backgroundColor: '#343a40', color: 'white' }} className="py-4 mt-auto">
      <Container className="text-center">
        <Row>
          <Col>
            {/* Información de Copyright */}
            <p className="mb-2">&copy; {currentYear} HuertoHogar - Todos los derechos reservados</p>

            {/* Enlaces a Redes Sociales (iconos de Bootstrap) */}
            <div className="mt-2">
              <a href="#" style={{ color: 'white', textDecoration: 'none' }} className="me-3">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }} className="me-3">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                <i className="bi bi-twitter fs-5"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
