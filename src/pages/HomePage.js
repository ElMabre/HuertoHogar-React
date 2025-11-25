import React from 'react';
import { Container, Row, Col, Button, Image, Card, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

function HomePage() {
  useDocumentTitle('Inicio'); 
  const { getFeaturedProducts } = useProducts();
  const featuredProducts = getFeaturedProducts(3);  
  return (
    <>
      <Container fluid className="hero text-white text-center py-5">
        <Row className="justify-content-center py-5">
          <Col lg={8}>
            <Image
              src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/huertohogarlogoconfondo.png"
              alt="Logo HuertoHogar"
              className="mb-4 mx-auto d-block animate-fade-in"  // Asumimos que la animación CSS está en index.css o App.css
            />
            <h1 className="display-4 fw-bold mb-4">¡Bienvenido a HuertoHogar!</h1>
            <p className="lead mb-5">Productos frescos y naturales directo del campo a tu hogar.
            Conectamos a las familias chilenas con lo mejor de nuestra tierra.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button as={Link} to="/productos" variant="warning" size="lg">Ver Productos</Button>
              <Button as={Link} to="/nosotros" variant="outline-light" size="lg">Conócenos</Button>
            </div>
          </Col>
        </Row>
      </Container>

      { /* Beneficios Section */ }
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">¿Por qué elegir HuertoHogar?</h2>
            <p className="text-muted">Te ofrecemos la mejor experiencia en productos frescos y naturales</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <i className="bi bi-truck display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Envío Rápido</h3>
                <p className="text-muted">Recibe tus productos frescos en la puerta de tu casa en 24-48 horas.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <i className="bi bi-arrow-repeat display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Frescura Garantizada</h3>
                <p className="text-muted">Productos cosechados en su punto óptimo y entregados directamente.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <i className="bi bi-heart display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Calidad Premium</h3>
                <p className="text-muted">Seleccionamos los mejores productos orgánicos y sostenibles para ti.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      { /* Productos Destacados */ }
      <Container fluid className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Productos Destacados</h2>
              <p className="text-muted">Descubre nuestros productos más populares</p>
            </Col>
          </Row>
          <Row xs={1} md={2} lg={3} className="g-4" id="featuredProducts">
            {featuredProducts.length > 0 ? (
              featuredProducts.map( product  => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col className="text-center"><p>Cargando productos...</p></Col>
            )}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/productos" variant="outline-success">Ver Todos los Productos</Button>
          </div>
        </Container>
      </Container>

      { /* Categorías */ }
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Nuestras Categorías</h2>
            <p className="text-muted">Explora nuestra variedad de productos frescos</p>
          </Col>
        </Row>
        <Row>
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=frutas" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/FrutasFrescas.avif" alt="Frutas Frescas" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Frutas Frescas</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=verduras" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/VerdurasOrganicas.avif" alt="Verduras Orgánicas" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Verduras Orgánicas</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=organicos" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/ProductosOrganicos.webp" alt="Productos Orgánicos" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Productos Orgánicos</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=lacteos" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/ProductosLacteos.avif" alt="Productos Lácteos" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Productos Lácteos</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      { /* Newsletter */ }
      <Container fluid className="py-5 bg-success text-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="mb-3">Suscríbete a nuestro Newsletter</h2>
              <p className="mb-4">Recibe ofertas exclusivas, recetas saludables y consejos para tu huerto urbano.</p>
              <Form>
                <Row className="g-2 justify-content-center">
                  <Col md={6}>
                    <InputGroup>
                      <Form.Control type="email" placeholder="Tu correo electrónico" required />
                      <Button variant="warning" type="submit">Suscribirme</Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Form>
              <small className="d-block mt-3">* Nos comprometemos a no compartir tu información.</small>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default HomePage;