import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';

// Función de validación (basada en tu validaciones.js)
const validateEmail = (email) => {
  if (!email) return false;
  // Simplificamos la regex para React, ya que la restricción de dominios no estaba en el HTML
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

function ContactoPage() {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para el contador de caracteres
  const [charCount, setCharCount] = useState(500);

  // Estado para mostrar mensaje de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  // Manejador para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // Lógica del contador de caracteres
    if (id === 'mensaje') {
      const remaining = 500 - value.length;
      setCharCount(remaining);
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones (basadas en tu validaciones.js y contacto.js)
    if (!formData.nombre || formData.nombre.trim().length === 0 || formData.nombre.length > 100) {
      newErrors.nombre = "El nombre es requerido (máx. 100 caracteres)";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un correo válido.";
    }
    if (!formData.mensaje || formData.mensaje.trim().length === 0 || formData.mensaje.length > 500) {
      newErrors.mensaje = "El mensaje es requerido (máx. 500 caracteres)";
    }

    setErrors(newErrors);

    // Si no hay errores, procesar el envío
    if (Object.keys(newErrors).length === 0) {
      console.log('Formulario enviado:', formData);
      // Aquí iría la lógica para enviar a un backend
      
      // Mostrar éxito y limpiar formulario
      setShowSuccess(true);
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      setCharCount(500);
      setErrors({});
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };


  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              
              <div className="text-center mb-4">
                <i className="bi bi-chat-dots display-4" style={{ color: 'var(--verde-esmeralda)' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Contáctanos</h2>
                <p className="text-muted">Escríbenos y te responderemos a la brevedad.</p>
              </div>

              {/* Mensaje de éxito */}
              {showSuccess && (
                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                  ¡Mensaje enviado correctamente! Te contactaremos pronto.
                </Alert>
              )}

              {/* Formulario de Contacto */}
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  {/* Campo Nombre */}
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="nombre">
                      <Form.Label>Nombre</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Tu nombre"
                          required
                          maxLength={100}
                          value={formData.nombre}
                          onChange={handleChange}
                          isInvalid={!!errors.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.nombre}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  {/* Campo Correo */}
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="email">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="tu@email.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Campo Asunto */}
                <Form.Group className="mb-3" controlId="asunto">
                  <Form.Label>Asunto</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="bi bi-chat"></i></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Asunto del mensaje"
                      maxLength={200}
                      value={formData.asunto}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Campo Mensaje */}
                <Form.Group className="mb-3" controlId="mensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-chat-text"></i></InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      maxLength={500}
                      value={formData.mensaje}
                      onChange={handleChange}
                      isInvalid={!!errors.mensaje}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mensaje}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className={charCount < 0 ? 'text-danger' : 'text-muted'}>
                    {charCount} caracteres restantes
                  </Form.Text>
                </Form.Group>

                {/* Botón de envío */}
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    <i className="bi bi-send me-2"></i>Enviar Mensaje
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              {/* Información de contacto adicional */}
              <Row className="mt-4 text-center">
                <Col md={4} className="mb-3 mb-md-0">
                  <i className="bi bi-geo-alt fs-1" style={{ color: 'var(--verde-esmeralda)' }}></i>
                  <h5>Ubicación</h5>
                  <p className="text-muted">Av. Principal 123<br/>Santiago, Chile</p>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <i className="bi bi-telephone fs-1" style={{ color: 'var(--verde-esmeralda)' }}></i>
                  <h5>Teléfono</h5>
                  <p className="text-muted">+56 2 2345 6789</p>
                </Col>
                <Col md={4}>
                  <i className="bi bi-envelope fs-1" style={{ color: 'var(--verde-esmeralda)' }}></i>
                  <h5>Email</h5>
                  <p className="text-muted">contacto@huertohogar.cl</p>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactoPage;