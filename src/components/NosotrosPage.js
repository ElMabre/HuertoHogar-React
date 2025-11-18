import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';
import MapComponent from './MapComponent';
import useDocumentTitle from '../hooks/useDocumentTitle';
function NosotrosPage() {
  useDocumentTitle('Nosotros');
  return (
    <Container className="my-5">
      <section className="row align-items-center mb-5">
        <Col md={6} className="mb-4 mb-md-0"> {/* <-- CORREGIDO DE 'lg' A 'md' */}
          <h1 className="section-title mb-4">Sobre HuertoHogar</h1>
          <p className="lead">Conectando a las familias chilenas con el campo desde 2019.</p>
          <p>HuertoHogar nació con la misión de llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.</p>
          <p>Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.</p>
        </Col>
        <Col md={6}> 
          <Image src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/CampoChileno.avif" alt="Campo chileno" fluid rounded className="shadow" />
        </Col>
      </section>
      <section className="row mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm text-center p-4">
            <Card.Body>
              <i className="bi bi-bullseye display-4 mb-3" style={{ color: '#2E8B57' }}></i>
              <Card.Title as="h3">Misión</Card.Title>
              <Card.Text>
                Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm text-center p-4">
            <Card.Body>
              <i className="bi bi-eye display-4 mb-3" style={{ color: '#2E8B57' }}></i>
              <Card.Title as="h3">Visión</Card.Title>
              <Card.Text>
                Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional... y compromiso con la sostenibilidad.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </section>
      <section className="mb-5">
        <h2 className="text-center section-title mb-4">Nuestros Valores</h2>
        <Row className="text-center">
          <Col md={3} xs={6} className="mb-4">
            <i className="bi bi-tree fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Sostenibilidad</h5>
            <p className="text-muted">Promovemos prácticas agrícolas responsables con el medio ambiente</p>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <i className="bi bi-heart fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Calidad</h5>
            <p className="text-muted">Productos seleccionados con los más altos estándares de calidad</p>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <i className="bi bi-people fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Comunidad</h5>
            <p className="text-muted">Apoyamos a agricultores y comunidades locales</p>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <i className="bi bi-shield-check fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Confianza</h5>
            <p className="text-muted">Transparencia en cada etapa de nuestro proceso</p>
          </Col>
        </Row>
      </section>

      <section className="mb-5">
        <h2 className="text-center section-title mb-4">Nuestras Tiendas</h2>
        <p className="text-center text-muted mb-4">Contamos con presencia en las principales ciudades de Chile.</p>
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <Card className="h-100 shadow-sm">
              <Card.Header as="h5" className="bg-success text-white">
                <i className="bi bi-geo-alt me-2"></i>Ubicaciones
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Santiago</strong> - Av. Principal 123</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Puerto Montt</strong> - Costanera 456</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Villarica</strong> - Calle Lagos 789</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Viña del Mar</strong> - Av. del Mar 321</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Valparaíso</strong> - Cerro Alegre 654</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-geo-fill me-2 text-success"></i><strong>Concepción</strong> - Barrio Universitario 987</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h5" className="bg-success text-white">
                <i className="bi bi-map me-2"></i>Mapa de Ubicaciones
              </Card.Header>
              <Card.Body className="p-0" style={{minHeight: '400px'}}>
                <MapComponent />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <h2 className="text-center section-title mb-4">Nuestro Equipo</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/danilo.jpg" alt="Danilo Celis" className="team-photo" />
              <Card.Body>
                <Card.Title as="h5">Danilo Celis</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Testing</Card.Subtitle>
                <Card.Text>Estudiante De Ingenieria Informatica.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/Matias.jpg" alt="Matias Guzman" className="team-photo" />
              <Card.Body>
                <Card.Title as="h5">Matias Guzman</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Backend</Card.Subtitle>
                <Card.Text>Estudiante De Ingenieria Informatica.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/felipe.jpg" alt="Felipe Quezada" className="team-photo" />
              <Card.Body>
                <Card.Title as="h5">Felipe Quezada</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Frontend</Card.Subtitle>
                <Card.Text>Estudiante De Ingenieria Informatica.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default NosotrosPage;