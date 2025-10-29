import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';
import MapComponent from './MapComponent'; 

function NosotrosPage() {
  return (
    <Container className="my-5">

      <section className="row align-items-center mb-5">
        <Col lg={6} className="mb-4 mb-lg-0">
          <h1 className="section-title mb-4">Sobre HuertoHogar</h1>
          <p className="lead">Conectando a las familias chilenas con el campo desde 2019.</p>
          <p>HuertoHogar nació con la misión de llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.</p>
          <p>Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.</p>
        </Col>
        <Col lg={6}>
          <Image src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/CampoChileno.avif" alt="Campo chileno" fluid rounded className="shadow" />
        </Col>
      </section>

      {/* ... (Sección Misión y Visión) ... */}
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

      {/* ... (Sección Tiendas y Mapa) ... */}
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

      {/* ... (Sección Equipo) ... */}
      <section>
        <h2 className="text-center section-title mb-4">Nuestro Equipo</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="%PUBLIC_URL%/img/danilo.jpg" alt="Danilo Celis" className="team-photo" />
              <Card.Body>
                <Card.Title as="h5">Danilo Celis</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Testing</Card.Subtitle>
                <Card.Text>Estudiante De Ingenieria Informatica.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="%PUBLIC_URL%/img/matias.jpg" alt="Matias Guzman" className="team-photo" />
              <Card.Body>
                <Card.Title as="h5">Matias Guzman</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Backend</Card.Subtitle>
                <Card.Text>Estudiante De Ingenieria Informatica.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Img variant="top" src="%PUBLIC_URL%/img/felipe.jpg" alt="Felipe Quezada" className="team-photo" />
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