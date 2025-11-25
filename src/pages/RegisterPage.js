import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';

const regionesComunas = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
  "Biobío": ["Concepción", "Los Ángeles", "Talcahuano", "San Pedro de la Paz"],
  "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Puerto Varas"]
};

const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validarPassword = (pass) => {
  return pass.length >= 4 && pass.length <= 10;
};

const validarRun = (run) => {
  // Validación simple de formato (ej: 12345678-9)
  const regex = /^[0-9]{7,8}-[0-9kK]$/;
  return regex.test(run.trim());
};

function RegistrationPage() {
  useDocumentTitle('Registro');
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', run: '', email: '', password: '',
    confirmPassword: '', region: '', comuna: '', direccion: '', terminos: false
  });

  const [errors, setErrors] = useState({});
  const [comunas, setComunas] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (formData.region && regionesComunas[formData.region]) {
      setComunas(regionesComunas[formData.region]);
    } else {
      setComunas([]);
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
    
    // Limpiar error del campo al escribir
    if (errors[id]) setErrors({ ...errors, [id]: null });
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre obligatorio.";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido obligatorio.";
    if (!validarRun(formData.run)) newErrors.run = "RUN inválido (ej: 12345678-9).";
    if (!validarEmail(formData.email)) newErrors.email = "Debe ser un correo válido.";
    if (!validarPassword(formData.password)) newErrors.password = "Contraseña debe tener entre 4 y 10 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
    if (!formData.region) newErrors.region = "Región obligatoria.";
    if (!formData.comuna) newErrors.comuna = "Comuna obligatoria.";
    if (!formData.direccion.trim()) newErrors.direccion = "Dirección obligatoria.";
    if (!formData.terminos) newErrors.terminos = "Debes aceptar los términos.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setServerError('');

    try {
      // Llamada al AuthContext 
      await register(formData);
      
      setShowSuccess(true);
      if (window.showToast) window.showToast('¡Cuenta creada exitosamente!', 'success');

      // Redirigir después de unos segundos
      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (error) {
      console.error("Error en registro:", error);
      setServerError(error.message || "Ocurrió un error al intentar registrarse.");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus display-4" style={{ color: '#2E8B57' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Crear Cuenta</h2>
                <p className="text-muted">Regístrate para disfrutar de todos nuestros servicios</p>
              </div>

              {showSuccess && (
                <Alert variant="success">
                  ¡Registro exitoso! Bienvenido a HuertoHogar. Redirigiendo...
                </Alert>
              )}

              {serverError && (
                <Alert variant="danger">{serverError}</Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="nombre">
                      <Form.Label>Nombre</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Tu nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          isInvalid={!!errors.nombre}
                        />
                        <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="apellido">
                      <Form.Label>Apellido</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Tu apellido"
                          required
                          value={formData.apellido}
                          onChange={handleChange}
                          isInvalid={!!errors.apellido}
                        />
                        <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="run">
                      <Form.Label>RUN (sin puntos, con guión)</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-card-checklist"></i></InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="12345678-9"
                          required
                          value={formData.run}
                          onChange={handleChange}
                          isInvalid={!!errors.run}
                        />
                        <Form.Control.Feedback type="invalid">{errors.run}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
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
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="password">
                      <Form.Label>Contraseña</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                        </Button>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="confirmPassword">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="region">
                      <Form.Label>Región</Form.Label>
                      <Form.Select
                        required
                        value={formData.region}
                        onChange={handleChange}
                        isInvalid={!!errors.region}
                      >
                        <option value="">Selecciona una región</option>
                        {Object.keys(regionesComunas).map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="comuna">
                      <Form.Label>Comuna</Form.Label>
                      <Form.Select
                        required
                        value={formData.comuna}
                        onChange={handleChange}
                        isInvalid={!!errors.comuna}
                        disabled={comunas.length === 0}
                      >
                        <option value="">Selecciona una comuna</option>
                        {comunas.map(comuna => (
                          <option key={comuna} value={comuna}>{comuna}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="direccion">
                  <Form.Label>Dirección</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-house"></i></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tu dirección completa"
                      required
                      value={formData.direccion}
                      onChange={handleChange}
                      isInvalid={!!errors.direccion}
                    />
                    <Form.Control.Feedback type="invalid">{errors.direccion}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="terminos">
                  <Form.Check
                    type="checkbox"
                    label={<>Acepto los <Link to="#">términos y condiciones</Link></>}
                    required
                    checked={formData.terminos}
                    onChange={handleChange}
                    isInvalid={!!errors.terminos}
                    feedback={errors.terminos}
                    feedbackType="invalid"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg" disabled={showSuccess}>
                    <i className="bi bi-person-plus me-2"></i>Crear Cuenta
                  </Button>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">¿Ya tienes una cuenta?</p>
                  <Button as={Link} to="/login" variant="outline-success" className="mt-2">
                    Iniciar Sesión
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationPage;