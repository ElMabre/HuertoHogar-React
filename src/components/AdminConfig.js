import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';

function AdminConfig() {
  useDocumentTitle('Admin: Configuración');
  
  // --- INICIO DE LA MODIFICACIÓN ---
  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    // Reemplazamos el 'alert' por 'window.showToast'
    if (window.showToast) {
      window.showToast('Configuración guardada (simulación)', 'success');
    } else {
      alert('Configuración guardada (simulación)');
    }
  };
  // --- FIN DE LA MODIFICACIÓN ---

  return (
    <Container fluid>
      { /* Encabezado */ }
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Configuración del Sistema</h1>
      </div>
      <Row>
        { /* Columna: Configuración General */ }
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Configuración General</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSaveChanges}>
                <Form.Group className="mb-3" controlId="storeName">
                  <Form.Label>Nombre de la Tienda</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue="HuertoHogar"
                  />
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
                  <Form.Control
                    type="tel"
                    defaultValue="+56 2 2345 6789"
                  />
                </Form.Group>

                <Button variant="success" type="submit">Guardar Cambios</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        { /* Columna: Configuración de Envíos */ }
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="card-title mb-0">Configuración de Envíos</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSaveChanges}>
                <Form.Group className="mb-3" controlId="shippingCost">
                  <Form.Label>Costo de Envío Estándar</Form.Label>
                  { /* El valor 3500 lo obtengo de tu cartManager.js antiguo */ }
                  <Form.Control
                    type="number"
                    min="0"
                    defaultValue="3500"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="freeShippingThreshold">
                  <Form.Label>Envío Gratis desde</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    defaultValue="15000"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="enableFreeShipping">
                  <Form.Check
                    type="checkbox"
                    label="Ofrecer envío gratis"
                    defaultChecked
                  />
                </Form.Group>

                <Button variant="success" type="submit">Guardar Cambios</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminConfig;