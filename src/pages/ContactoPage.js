import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * Función: Validar formato de email
 * Esto lo que hace is: Verifica que el email tenga un formato válido usando expresión regular
 * Esto es para: Garantizar que los usuarios ingresen emails correctos antes de enviar el formulario
 */
const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * ContactoPage Component
 * Esto lo que hace is: Renderiza una página con formulario de contacto y información de ubicación
 * Esto es para: Permitir que los usuarios envíen mensajes de contacto a la empresa
 */
function ContactoPage() {
  // Hook para actualizar el título del documento
  useDocumentTitle('Contacto');
  
  /**
   * Estado: Datos del formulario
   * Esto lo que hace is: Almacena los valores de nombre, email, asunto y mensaje
   * Esto es para: Controlar los campos del formulario y permitir edición
   */
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  
  // Estado para almacenar errores de validación del formulario
  const [errors, setErrors] = useState({});
  // Estado para controlar caracteres restantes del mensaje (máx 500)
  const [charCount, setCharCount] = useState(500);
  // Estado para mostrar mensaje de éxito después de envío
  const [showSuccess, setShowSuccess] = useState(false);
  
  /**
   * Función: Manejar cambios en los campos del formulario
   * Esto lo que hace is: Actualiza el estado formData y cuenta caracteres restantes en el mensaje
   * Esto es para: Mantener sincronizados los valores del formulario con el estado
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    // Actualizar contador de caracteres si es el campo mensaje
    if (id === 'mensaje') {
      const remaining = 500 - value.length;
      setCharCount(remaining);
    }
  };
  
  /**
   * Función: Validar y enviar formulario
   * Esto lo que hace is: Valida todos los campos, muestra errores si hay, y envía si es válido
   * Esto es para: Garantizar que el formulario tenga datos correctos antes de procesar
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validar nombre (requerido, máx 100 caracteres)
    if (!formData.nombre || formData.nombre.trim().length === 0 || formData.nombre.length > 100) {
      newErrors.nombre = "El nombre es requerido (máx. 100 caracteres)";
    }
    
    // Validar email (requerido, formato válido)
    if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un correo válido.";
    }
    
    // Validar mensaje (requerido, máx 500 caracteres)
    if (!formData.mensaje || formData.mensaje.trim().length === 0 || formData.mensaje.length > 500) {
      newErrors.mensaje = "El mensaje es requerido (máx. 500 caracteres)";
    }

    setErrors(newErrors);
    
    // Si no hay errores, procesar el formulario
    if (Object.keys(newErrors).length === 0) {
      console.log('Formulario enviado:', formData);
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      // Limpiar el formulario
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      setCharCount(500);
      setErrors({});
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              
              {/* Encabezado de la página */}
              <div className="text-center mb-4">
                <i className="bi bi-chat-dots display-4" style={{ color: 'var(--verde-esmeralda)' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Contáctanos</h2>
                <p className="text-muted">Escríbenos y te responderemos a la brevedad.</p>
              </div>

              {/* Alerta de éxito después de enviar formulario */}
              {showSuccess && (
                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                  ¡Mensaje enviado correctamente! Te contactaremos pronto.
                </Alert>
              )}

              {/* Formulario de contacto */}
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

                  {/* Campo Correo Electrónico */}
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

                {/* Campo Asunto (opcional) */}
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

                {/* Campo Mensaje (requerido, máx 500 caracteres) */}
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
                  {/* Contador de caracteres restantes */}
                  <Form.Text className={charCount < 0 ? 'text-danger' : 'text-muted'}>
                    {charCount} caracteres restantes
                  </Form.Text>
                </Form.Group>

                {/* Botón de envío del formulario */}
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    <i className="bi bi-send me-2"></i>Enviar Mensaje
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              {/* Sección de información de contacto adicional */}
              <Row className="mt-4 text-center">
                {/* Información de ubicación */}
                <Col md={4} className="mb-3 mb-md-0">
                  <i className="bi bi-geo-alt fs-1" style={{ color: 'var(--verde-esmeralda)' }}></i>
                  <h5>Ubicación</h5>
                  <p className="text-muted">Av. Principal 123<br/>Santiago, Chile</p>
                </Col>
                {/* Información de teléfono */}
                <Col md={4} className="mb-3 mb-md-0">
                  <i className="bi bi-telephone fs-1" style={{ color: 'var(--verde-esmeralda)' }}></i>
                  <h5>Teléfono</h5>
                  <p className="text-muted">+56 2 2345 6789</p>
                </Col>
                {/* Información de email */}
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