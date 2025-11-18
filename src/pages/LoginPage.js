import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORTAR useAuth
import useDocumentTitle from '../hooks/useDocumentTitle';
// --- Funciones de Validación (de tu validaciones.js) ---
const validarEmail = ( email ) => {
  if (!email || typeof email !== 'string') return false;
  // Esta es la validación que usa tu AuthContext (admin@huerto.hogar)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return regex.test(email.trim());
};
const validarPassword = ( pass ) => {
  if (!pass || typeof pass !== 'string') return false; // Añadida verificación de string
  return pass.length >= 4 && pass.length <= 10;
};
// -----------------------------------------------------

function LoginPage() {
  useDocumentTitle('Iniciar Sesión');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Para errores de login (ej. "pass incorrecto")
  const [validationErrors, setValidationErrors] = useState({});  // Para errores de formulario
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();  // Hook para redirigir
  
  const { login } = useAuth(); // <-- 2. OBTENER LA FUNCIÓN 'login' DEL CONTEXTO

  // --- 3. LA FUNCIÓN LOCAL 'loginUsuario'  SE ELIMINA ---

  const handleSubmit = ( e ) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // 1. Validar formulario
    const newErrors = {};
    if (!validarEmail(email)) {
      // Mensaje de error genérico para login
      newErrors.email = "El formato del correo no es válido."; 
    }
    if (!validarPassword(password)) {
      newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    // 2. Intentar login (AHORA USANDO LA FUNCIÓN DEL CONTEXTO)
    const user = login(email, password); // <-- 4. USAR LA FUNCIÓN 'login' DEL CONTEXTO

    if (user) {
      // 3. Login exitoso
      // (AuthContext se encarga de guardar en localStorage y actualizar el estado)
      
      // Redirigir según el rol
      if (user.rol === 'admin') {
        navigate('/admin'); // Redirige al Panel de Admin
      } else {
        navigate('/');  // Redirige al Home
      }
    } else {
      // 4. Falla el login
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">

              <div className="text-center mb-4">
                <i className="bi bi-flower1 display-4" style={{ color: 'var(--verde-esmeralda)' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Iniciar Sesión</h2>
                <p className="text-muted">Ingresa a tu cuenta para continuar</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                { /* Campo Correo */ }
                <Form.Group className="mb-3" controlId="correoLogin">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={email}
                      onChange={( e ) => setEmail(e.target.value)}
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                { /* Campo Contraseña */ }
                <Form.Group className="mb-3" controlId="passLogin">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      required
                      value={password}
                      onChange={( e ) => setPassword(e.target.value)}
                      isInvalid={!!validationErrors.password}
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="rememberMe">
                  <Form.Check type="checkbox" label="Recordarme" />
                </Form.Group>
                
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                  </Button>
                </div>
                
                <div className="text-center mt-3">
                  <Link to="#">¿Olvidaste tu contraseña?</Link>
                </div>
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0">¿No tienes una cuenta?</p>
                  <Button as={Link} to="/registro" variant="outline-success" className="mt-2">
                    Crear Cuenta
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

export default LoginPage;