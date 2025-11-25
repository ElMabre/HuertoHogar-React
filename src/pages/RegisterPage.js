import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';

/**
 * Objeto de regiones y comunas de Chile
 * 
 * Esto es para: Proporcionar datos para los selectores dependientes
 * (cuando se elige región, se cargan las comunas correspondientes)
 * 
 * Esto lo que hace es: Define un mapa de regiones como claves
 * y arrays de comunas como valores para validar y llenar selectores
 * 
 * Estructura: {
 *   "Nombre Región": ["Comuna 1", "Comuna 2", ...],
 *   ...
 * }
 */
const regionesComunas = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
  "Biobío": ["Concepción", "Los Ángeles", "Talcahuano", "San Pedro de la Paz"],
  "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Puerto Varas"]
};

/**
 * validarEmail - Función utilitaria para validar formato de email
 * 
 * Esto es para: Verificar que el email ingresado tenga un formato válido
 * 
 * @param {string} email - Dirección de email a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * validarPassword - Función utilitaria para validar contraseña
 * 
 * Esto es para: Verificar que la contraseña cumpla requisitos mínimos de seguridad
 * 
 * Esto lo que hace es: Valida que la contraseña tenga entre 4 y 10 caracteres
 * 
 * @param {string} pass - Contraseña a validar
 * @returns {boolean} - true si tiene entre 4-10 caracteres, false en caso contrario
 */
const validarPassword = (pass) => {
  return pass.length >= 4 && pass.length <= 10;
};

/**
 * validarRun - Función utilitaria para validar RUN chileno
 * 
 * Esto es para: Verificar que el RUN (cédula de identidad) tenga formato válido
 * 
 * Esto lo que hace es: Valida formato: 7-8 dígitos + guión + 1 dígito o K/k
 * Ejemplo válido: 12345678-9 o 1234567-k
 * 
 * @param {string} run - RUN a validar
 * @returns {boolean} - true si cumple el patrón, false en caso contrario
 */
const validarRun = (run) => {
  // Validación simple de formato (ej: 12345678-9 o 1234567-k)
  const regex = /^[0-9]{7,8}-[0-9kK]$/;
  return regex.test(run.trim());
};

/**
 * RegisterPage Component (también llamado RegistrationPage)
 * 
 * Esto es para: Permitir que nuevos usuarios se registren en la plataforma
 * creando una cuenta con sus datos personales y de contacto.
 * 
 * Esto lo que hace es: Renderiza un formulario completo de registro que:
 * - Solicita datos personales (nombre, apellido, RUN, email)
 * - Solicita credenciales (contraseña con confirmación)
 * - Solicita ubicación (región, comuna, dirección)
 * - Requiere aceptar términos y condiciones
 * - Valida todos los campos antes de enviar
 * - Llama al AuthContext para registrar el usuario
 * - Redirige a home después de registro exitoso
 * - Muestra mensajes de error si algo falla
 * 
 * Esto es para el flujo: Es la página de creación de cuentas nuevas,
 * accesible desde LoginPage y desde el menu principal.
 */
function RegistrationPage() {
  // Actualiza el título de la pestaña del navegador a "Registro"
  useDocumentTitle('Registro');
  
  // Hook de navegación - Esto es para: Redirigir al usuario después del registro exitoso
  const navigate = useNavigate();
  
  // Extrae función register del contexto de autenticación - Esto es para: Procesar el registro en el backend
  const { register } = useAuth();

  /**
   * Estado del formulario - Esto es para: Almacenar todos los datos que ingresa el usuario
   * 
   * Propiedades:
   * - nombre, apellido: Datos personales básicos
   * - run: Cédula de identidad chilena (formato: 12345678-9)
   * - email: Correo electrónico para login y comunicaciones
   * - password, confirmPassword: Credenciales (la segunda es para verificar)
   * - region, comuna: Ubicación (dependientes - se valida coherencia)
   * - direccion: Dirección completa para envíos
   * - terminos: Checkbox para aceptación de términos y condiciones
   */
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', run: '', email: '', password: '',
    confirmPassword: '', region: '', comuna: '', direccion: '', terminos: false
  });

  /**
   * Estado de errores de validación - Esto es para: Mostrar mensajes específicos bajo cada campo
   * 
   * Estructura: { nombreCampo: "mensaje de error", ... }
   * Se limpia al cambiar el campo o al enviar el formulario
   */
  const [errors, setErrors] = useState({});
  
  /**
   * Estado de comunas disponibles - Esto es para: Almacenar lista dinámica de comunas
   * basada en la región seleccionada
   */
  const [comunas, setComunas] = useState([]);
  
  /**
   * Estado de visibilidad de contraseña - Esto es para: Toggle entre mostrar/ocultar contraseña
   */
  const [showPassword, setShowPassword] = useState(false);
  
  /**
   * Estado de mensaje de éxito - Esto es para: Mostrar alerta de registro exitoso
   * y deshabilitar el botón durante el proceso
   */
  const [showSuccess, setShowSuccess] = useState(false);
  
  /**
   * Estado de error del servidor - Esto es para: Mostrar errores devueltos por el backend
   * (ej: email ya registrado, error de conexión, etc.)
   */
  const [serverError, setServerError] = useState('');

  /**
   * useEffect - Actualiza las comunas cuando cambia la región
   * 
   * Esto es para: Mantener un selector dependiente donde al cambiar región,
   * se cargan automáticamente las comunas disponibles para esa región
   * 
   * Esto lo que hace es:
   * 1. Verifica si existe la región seleccionada en el objeto regionesComunas
   * 2. Si existe, actualiza el estado con las comunas de esa región
   * 3. Si no existe, limpia el estado de comunas
   * 4. Se ejecuta cada vez que cambia formData.region
   */
  useEffect(() => {
    if (formData.region && regionesComunas[formData.region]) {
      // Carga las comunas de la región seleccionada
      setComunas(regionesComunas[formData.region]);
    } else {
      // Limpia la lista si no hay región seleccionada
      setComunas([]);
    }
  }, [formData.region]);

  /**
   * handleChange - Manejador de cambios en los inputs del formulario
   * 
   * Esto es para: Actualizar el estado del formulario cuando el usuario escribe/selecciona
   * y limpiar errores anteriores del campo modificado
   * 
   * Esto lo que hace es:
   * 1. Obtiene id, value, type (para checkbox) y checked del evento
   * 2. Actualiza formData con el nuevo valor (considerando si es checkbox)
   * 3. Limpia el error del campo específico si existía
   * 4. Limpia el error del servidor para que usuario vea estado limpio
   * 
   * @param {Event} e - Evento del input/select/checkbox
   */
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    // Actualiza formData: para checkbox usa 'checked', para otros usa 'value'
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
    
    // Limpia error del campo específico al escribir (mejora UX)
    if (errors[id]) setErrors({ ...errors, [id]: null });
    // Limpia error del servidor cuando usuario empieza a corregir
    if (serverError) setServerError('');
  };

  /**
   * validateForm - Valida todos los campos del formulario
   * 
   * Esto es para: Verificar que todos los datos sean válidos antes de enviar al servidor
   * 
   * Esto lo que hace es: Realiza validaciones específicas para cada campo:
   * - nombre, apellido, dirección: no vacías
   * - run: formato válido (12345678-9)
   * - email: formato de email válido
   * - password: entre 4-10 caracteres
   * - confirmPassword: coincide con password
   * - region, comuna: seleccionadas
   * - terminos: checkbox aceptado
   * 
   * @returns {Object} Objeto con campos y mensajes de error (vacío si todo es válido)
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de nombre
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre obligatorio.";
    
    // Validación de apellido
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido obligatorio.";
    
    // Validación de RUN con función helper
    if (!validarRun(formData.run)) newErrors.run = "RUN inválido (ej: 12345678-9).";
    
    // Validación de email con función helper
    if (!validarEmail(formData.email)) newErrors.email = "Debe ser un correo válido.";
    
    // Validación de contraseña con función helper
    if (!validarPassword(formData.password)) newErrors.password = "Contraseña debe tener entre 4 y 10 caracteres.";
    
    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
    
    // Validación de región
    if (!formData.region) newErrors.region = "Región obligatoria.";
    
    // Validación de comuna
    if (!formData.comuna) newErrors.comuna = "Comuna obligatoria.";
    
    // Validación de dirección
    if (!formData.direccion.trim()) newErrors.direccion = "Dirección obligatoria.";
    
    // Validación de términos y condiciones
    if (!formData.terminos) newErrors.terminos = "Debes aceptar los términos.";
    
    return newErrors;
  };

  /**
   * handleSubmit - Manejador del envío del formulario de registro
   * 
   * Esto es para: Procesar la solicitud de registro cuando el usuario hace click en "Crear Cuenta"
   * 
   * Esto lo que hace es:
   * 1. Previene comportamiento por defecto del formulario
   * 2. Valida todos los campos
   * 3. Si hay errores, los muestra y retorna
   * 4. Si todo es válido, llama a la función register() del contexto (async)
   * 5. Si éxito: muestra alerta, toast (si disponible), redirige a home en 2 segundos
   * 6. Si error: muestra mensaje de error del servidor
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida el formulario completo
    const formErrors = validateForm();
    
    // Si hay errores de validación, mostrar y retornar
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Limpia errores anteriores para nueva validación
    setErrors({});
    setServerError('');

    try {
      // Llamada al AuthContext para registrar el usuario en el backend
      // Esta función es async y puede fallar si hay error en el servidor
      await register(formData);
      
      // Si llega aquí, el registro fue exitoso
      setShowSuccess(true);
      
      // Intenta mostrar un toast si está disponible en window
      if (globalThis.showToast) globalThis.showToast('¡Cuenta creada exitosamente!', 'success');

      // Redirige al home después de unos segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (error) {
      // Si hay error en el servidor, mostrar mensaje
      console.error("Error en registro:", error);
      setServerError(error.message || "Ocurrió un error al intentar registrarse.");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Tarjeta principal del formulario */}
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              {/* Encabezado con icono y título */}
              <div className="text-center mb-4">
                {/* Icono decorativo de persona agregando - Color verde esmeralda */}
                <i className="bi bi-person-plus display-4" style={{ color: '#2E8B57' }}></i>
                <h2 className="card-title text-center mt-2 section-title">Crear Cuenta</h2>
                <p className="text-muted">Regístrate para disfrutar de todos nuestros servicios</p>
              </div>

              {/* ===== ALERTA DE ÉXITO ===== */}
              {/* Se muestra cuando el registro es exitoso */}
              {/* Esto es para: Confirmar al usuario que la cuenta fue creada y está siendo redirigido */}
              {showSuccess && (
                <Alert variant="success">
                  ¡Registro exitoso! Bienvenido a HuertoHogar. Redirigiendo...
                </Alert>
              )}

              {/* ===== ALERTA DE ERROR DEL SERVIDOR ===== */}
              {/* Se muestra si hay error al registrar (ej: email duplicado, error de conexión) */}
              {/* Esto es para: Informar al usuario sobre problemas en la solicitud */}
              {serverError && (
                <Alert variant="danger">{serverError}</Alert>
              )}

              {/* Formulario principal con validación */}
              <Form noValidate onSubmit={handleSubmit}>
                {/* ===== SECCIÓN 1: NOMBRE Y APELLIDO ===== */}
                <Row>
                  {/* Campo Nombre - 6 cols en desktop */}
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
                  {/* Campo Apellido - 6 cols en desktop */}
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

                {/* ===== SECCIÓN 2: RUN Y EMAIL ===== */}
                <Row>
                  {/* Campo RUN (cédula de identidad chilena) - 6 cols en desktop */}
                  {/* Esto es para: Recopilar identificación legal del usuario */}
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
                  {/* Campo Email - 6 cols en desktop */}
                  {/* Esto es para: Recopilar dirección de email para login y comunicaciones */}
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

                {/* ===== SECCIÓN 3: CONTRASEÑA ===== */}
                <Row>
                  {/* Campo Contraseña - 6 cols en desktop */}
                  {/* Esto es para: Recopilar contraseña con toggle para mostrar/ocultar */}
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
                        {/* Botón toggle para mostrar/ocultar contraseña */}
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                        </Button>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  {/* Campo Confirmar Contraseña - 6 cols en desktop */}
                  {/* Esto es para: Verificar que el usuario escribió correctamente la contraseña */}
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

                {/* ===== SECCIÓN 4: UBICACIÓN (REGIÓN Y COMUNA) ===== */}
                <Row>
                  {/* Campo Región - 6 cols en desktop */}
                  {/* Esto es para: Recopilar región del usuario (selector dependiente) */}
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
                        {/* Mapea las regiones disponibles del objeto regionesComunas */}
                        {Object.keys(regionesComunas).map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {/* Campo Comuna - 6 cols en desktop */}
                  {/* Esto es para: Recopilar comuna del usuario (cargada según región) */}
                  {/* Se deshabilita si no hay región seleccionada */}
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
                        {/* Mapea las comunas cargadas dinámicamente según región */}
                        {comunas.map(comuna => (
                          <option key={comuna} value={comuna}>{comuna}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ===== SECCIÓN 5: DIRECCIÓN ===== */}
                {/* Campo Dirección - full width */}
                {/* Esto es para: Recopilar dirección completa para envíos de compras */}
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

                {/* ===== SECCIÓN 6: TÉRMINOS Y CONDICIONES ===== */}
                {/* Esto es para: Obtener consentimiento legal para aceptar términos de servicio */}
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

                {/* ===== BOTÓN DE ENVÍO ===== */}
                {/* Se deshabilita mientras se procesa el registro (showSuccess = true) */}
                {/* Esto es para: Enviar el formulario validado al servidor */}
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg" disabled={showSuccess}>
                    <i className="bi bi-person-plus me-2"></i>Crear Cuenta
                  </Button>
                </div>

                <hr className="my-4" />

                {/* ===== SECCIÓN: LOGIN EXISTENTE ===== */}
                {/* Esto es para: Dirigir a usuarios que ya tienen cuenta al formulario de login */}
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