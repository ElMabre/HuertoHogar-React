import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap'; // Agregamos Spinner
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import useDocumentTitle from '../hooks/useDocumentTitle';

// ... (Mantenemos las funciones de validación validarEmail y validarPassword igual que antes) ...
const validarEmail = ( email ) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return regex.test(email.trim());
};

const validarPassword = ( pass ) => {
  if (!pass || typeof pass !== 'string') return false;
  return pass.length >= 4 && pass.length <= 10;
};
// ... (Fin validaciones) ...

function LoginPage() {
  useDocumentTitle('Iniciar Sesión');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  
  const [validationErrors, setValidationErrors] = useState({});  
  const [showPassword, setShowPassword] = useState(false);
  
  // NUEVO ESTADO: Para saber si estamos cargando
  const [loading, setLoading] = useState(false);
  // NUEVO ESTADO: Mensaje de éxito temporal
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const handleSubmit = async ( e ) => { // 1. Agregamos ASYNC aquí
    e.preventDefault();
    setError('');
    setSuccessMsg(''); // Limpiar mensajes
    setValidationErrors({});
    
    // Validaciones locales (igual que antes)
    const newErrors = {};
    if (!validarEmail(email)) newErrors.email = "El formato del correo no es válido."; 
    if (!validarPassword(password)) newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    // 2. Activamos modo "Cargando"
    setLoading(true);

    try {
      // 3. Usamos AWAIT para esperar la respuesta real del backend
      const user = await login(email, password); 

      if (user) {
        // ÉXITO: Mostramos mensaje y esperamos unos segundos antes de redirigir
        setSuccessMsg('¡Credenciales correctas! Ingresando...');
        
        // 4. Esperamos 1.5 segundos para que el usuario vea el mensaje
        setTimeout(() => {
            if (user.rol === 'admin') {
                navigate('/admin'); 
            } else {
                navigate('/');  
            }
        }, 1500);

      } else {
        // FALLO (Login retornó false/null): Mostramos error y quitamos carga
        setError('Correo o contraseña incorrectos.');
        setLoading(false);
      }
    } catch (err) {
      // ERROR DE RED O SERVIDOR
      console.error(err);
      setError('Hubo un error al conectar con el servidor.');
      setLoading(false);
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
              
              {/* Alerta de Error */}
              {error && <Alert variant="danger">{error}</Alert>}
              
              {/* Alerta de Éxito (Verde) */}
              {successMsg && <Alert variant="success">{successMsg}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="correoLogin">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={email}
                      // Deshabilitamos inputs si está cargando
                      disabled={loading} 
                      onChange={( e ) => setEmail(e.target.value)}
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="passLogin">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      required
                      value={password}
                      // Deshabilitamos inputs si está cargando
                      disabled={loading}
                      onChange={( e ) => setPassword(e.target.value)}
                      isInvalid={!!validationErrors.password}
                    />
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                    >
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="rememberMe">
                  <Form.Check type="checkbox" label="Recordarme" disabled={loading} />
                </Form.Group>
                
                <div className="d-grid">
                  {/* Botón dinámico: Cambia texto y muestra spinner si está cargando */}
                  <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-3">
                  <Link to="#" className={loading ? "disabled-link text-muted" : ""}>¿Olvidaste tu contraseña?</Link>
                </div>
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0">¿No tienes una cuenta?</p>
                  <Button as={Link} to="/registro" variant="outline-success" className="mt-2" disabled={loading}>
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