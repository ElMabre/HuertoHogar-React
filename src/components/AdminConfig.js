import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Panel de administración para configurar parámetros del sistema
function AdminConfig() {
  // Actualiza el título de la página
  useDocumentTitle("Admin: Configuración");

  // Manejador para guardar cambios de configuración (simulación)
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (window.showToast) {
      window.showToast("Configuración guardada (simulación)", "success");
    } else {
      alert("Configuración guardada (simulación)");
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Configuración del Sistema</h1>
      </div>
      <Row>
        {/* Tarjeta de configuración general de la tienda */}
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Configuración General</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSaveChanges}>
                {/* Datos principales del negocio */}
                <Form.Group className="mb-3" controlId="storeName">
                  <Form.Label>Nombre de la Tienda</Form.Label>
                  <Form.Control type="text" defaultValue="HuertoHogar" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="storeEmail">
                  <Form.Label>Email de Contacto</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue="contacto@huertohogar.cl"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="storePhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="tel" defaultValue="+56 2 2345 6789" />
                </Form.Group>

                <Button variant="success" type="submit">
                  Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tarjeta de configuración de políticas de envío */}
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Configuración de Envíos</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSaveChanges}>
                {/* Parámetros de costo y envío gratis */}
                <Form.Group className="mb-3" controlId="shippingCost">
                  <Form.Label>Costo de Envío Estándar</Form.Label>
                  <Form.Control type="number" min="0" defaultValue="3500" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="freeShippingThreshold">
                  <Form.Label>Envío Gratis desde</Form.Label>
                  <Form.Control type="number" min="0" defaultValue="15000" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="enableFreeShipping">
                  <Form.Check
                    type="checkbox"
                    label="Ofrecer envío gratis"
                    defaultChecked
                  />
                </Form.Group>

                <Button variant="success" type="submit">
                  Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminConfig;
