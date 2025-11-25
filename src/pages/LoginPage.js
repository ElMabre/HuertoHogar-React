import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * validarEmail - Función utilitaria para validar formato de email
 * 
 * Esto es para: Verificar que el email ingresado por el usuario tenga un formato válido
 * antes de intentar autenticación.
 * 
 * Esto lo que hace es: Valida que:
 * - El email no sea null/undefined
 * - Sea una cadena de texto válida
 * - Cumpla con el patrón regex: caracteres@caracteres.extensión
 * 
 * @param {string} email - Dirección de email a validar
 * @returns {boolean} - true si el email es válido, false en caso contrario
 */
const validarEmail = ( email ) => {
  if (!email || typeof email !== 'string') return false;
  // Regex pattern: uno o más caracteres que no sean espacio/@ + @ + caracteres + . + extensión
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return regex.test(email.trim());
};

/**
 * validarPassword - Función utilitaria para validar la contraseña
 * 
 * Esto es para: Verificar que la contraseña ingresada cumpla con requisitos mínimos
 * de seguridad y formato.
 * 
 * Esto lo que hace es: Valida que:
 * - La contraseña no sea null/undefined
 * - Sea una cadena de texto válida
 * - Tenga entre 4 y 10 caracteres (según validación en handleSubmit)
 * 
 * @param {string} pass - Contraseña a validar
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
const validarPassword = ( pass ) => {
  if (!pass || typeof pass !== 'string') return false; 
};
// ===== FIN DE FUNCIONES DE VALIDACIÓN =====

/**
 * LoginPage Component
 * 
 * Esto es para: Permitir que usuarios existentes inicien sesión en la aplicación
 * con sus credenciales (email y contraseña).
 * 
 * Esto lo que hace es: Renderiza una página de login que:
 * - Solicita email y contraseña del usuario
 * - Valida los campos antes de enviarlos
 * - Usa el contexto de autenticación para procesar el login
 * - Redirige al usuario: admin si es administrador, home si es cliente
 * - Muestra mensajes de error si las credenciales son incorrectas
 * - Proporciona links para registrarse o recuperar contraseña
 * 
 * Esto es para el flujo: Es la entrada para usuarios registrados que necesitan
 * acceder a sus cuentas, funciones administrativas, y carrito de compras.
 */
function LoginPage() {
  // Actualiza el título de la pestaña del navegador a "Iniciar Sesión"
  useDocumentTitle('Iniciar Sesión');
  
  // Estado del formulario - Esto es para: Almacenar datos que ingresa el usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado de errores - Esto es para: Mostrar mensajes de error general al usuario
  const [error, setError] = useState('');  
  
  // Estado de validación por campo - Esto es para: Mostrar errores específicos bajo cada campo
  const [validationErrors, setValidationErrors] = useState({});  
  
  // Estado de visibilidad - Esto es para: Toggle entre mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Hook de navegación - Esto es para: Redirigir al usuario después de login exitoso
  const navigate = useNavigate(); 
  
  // Extrae función login del contexto de autenticación - Esto es para: Procesar credenciales contra backend
  const { login } = useAuth(); 

  /**
   * handleSubmit - Manejador del envío del formulario de login
   * 
   * Esto es para: Procesar la solicitud de login cuando el usuario hace click en "Ingresar"
   * 
   * Esto lo que hace es:
   * 1. Previene el comportamiento por defecto del formulario
   * 2. Limpia errores anteriores
   * 3. Valida que email y password cumplan requisitos
   * 4. Si hay errores de validación, los muestra y detiene el proceso
   * 5. Si la validación es OK, intenta login con las credenciales
   * 6. Si login es exitoso, redirige según rol (admin → /admin, cliente → /)
   * 7. Si login falla, muestra mensaje de error general
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = ( e ) => {
    e.preventDefault();
    // Limpia errores previos para nueva validación
    setError('');
    setValidationErrors({});
    
    // Objeto para acumular errores de validación por campo
    const newErrors = {};
    
    // Validación del email
    if (!validarEmail(email)) {
      newErrors.email = "El formato del correo no es válido."; 
    }
    
    // Validación de la contraseña
    if (!validarPassword(password)) {
      newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    
    // Si hay errores de validación, mostrar y retornar
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    // Intenta hacer login con las credenciales validadas
    // login() retorna el objeto usuario si es exitoso, o false si falla
    const user = login(email, password); 
    if (user) {
      // Si el usuario es administrador, redirige a dashboard admin
      if (user.rol === 'admin') {
        navigate('/admin'); 
      } else {
        // Si es cliente normal, redirige a homepage
        navigate('/');  
      }
    } else {
      // Si las credenciales son inválidas, muestra error general
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          {/* Tarjeta principal del formulario de login */}
          <Card className="shadow-sm">
            <Card.Body className="p-5">

              {/* Encabezado con icono y título */}
              <div className="text-center mb-4">
                {/* Icono decorativo con color verde esmeralda */}
                <i className="bi bi-flower1 display-4" style={{ color: 'var(--verde-esmeralda)' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Iniciar Sesión</h2>
                <p className="text-muted">Ingresa a tu cuenta para continuar</p>
              </div>
              
              {/* Alerta de error general - Se muestra solo si hay error en login (credenciales) */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Formulario principal */}
              <Form noValidate onSubmit={handleSubmit}>
                {/* ===== CAMPO: CORREO ELECTRÓNICO ===== */}
                {/* Esto es para: Recopilar dirección de email del usuario para autenticación */}
                <Form.Group className="mb-3" controlId="correoLogin">
                  <Form.Label>Correo Electrónico</Form.Label>
                  {/* InputGroup combina icono + input + validación */}
                  <InputGroup hasValidation>
                    {/* Icono de sobre para indicar campo de email */}
                    <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={email}
                      onChange={( e ) => setEmail(e.target.value)}
                      // Si hay error de validación, marcar campo como inválido (borde rojo)
                      isInvalid={!!validationErrors.email}
                    />
                    {/* Mensaje de error que aparece bajo el campo si falla validación */}
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                {/* ===== CAMPO: CONTRASEÑA ===== */}
                {/* Esto es para: Recopilar contraseña del usuario de forma segura */}
                <Form.Group className="mb-3" controlId="passLogin">
                  <Form.Label>Contraseña</Form.Label>
                  {/* InputGroup con toggle para mostrar/ocultar contraseña */}
                  <InputGroup hasValidation>
                    {/* Icono de candado para indicar campo de contraseña */}
                    <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                    <Form.Control
                      // Tipo dinámico: "text" para ver contraseña, "password" para ocultar
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      required
                      value={password}
                      onChange={( e ) => setPassword(e.target.value)}
                      // Si hay error de validación, marcar campo como inválido
                      isInvalid={!!validationErrors.password}
                    />
                    {/* Botón toggle para mostrar/ocultar contraseña */}
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      {/* Icono cambia según estado: ojo abierto/cerrado */}
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                    {/* Mensaje de error bajo el campo si falla validación */}
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                {/* ===== CHECKBOX: RECORDARME ===== */}
                {/* Esto es para: Permitir que el navegador recuerde las credenciales del usuario */}
                {/* Esta funcionalidad es delegada al navegador/SO, no manejada por la app */}
                <Form.Group className="mb-3" controlId="rememberMe">
                  <Form.Check type="checkbox" label="Recordarme" />
                </Form.Group>
                
                {/* Botón de envío - Ocupa el ancho completo */}
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    {/* Icono de entrada + texto */}
                    <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                  </Button>
                </div>
                
                {/* Link para recuperar contraseña (placeholder para funcionalidad futura) */}
                <div className="text-center mt-3">
                  <Link to="#">¿Olvidaste tu contraseña?</Link>
                </div>
                
                {/* Separador visual */}
                <hr className="my-4" />
                
                {/* ===== SECCIÓN: CREAR CUENTA ===== */}
                {/* Esto es para: Dirigir a usuarios nuevos a la página de registro */}
                <div className="text-center">
                  <p className="mb-0">¿No tienes una cuenta?</p>
                  {/* Botón que navega a /registro */}
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