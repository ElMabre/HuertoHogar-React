import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';
import MapComponent from '../components/MapComponent';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * NosotrosPage Component
 * 
 * Esto es para: Ser la página de presentación de la empresa HuertoHogar,
 * permitiendo que usuarios conozcan la historia, misión, valores y equipo.
 * 
 * Esto lo que hace es: Renderiza una página completa con:
 * - Sección de historia con imagen del campo
 * - Tarjetas de Misión y Visión de la empresa
 * - Grid de 4 valores corporativos (Sostenibilidad, Calidad, Comunidad, Confianza)
 * - Sección de ubicaciones con lista y mapa interactivo de tiendas
 * - Galería de equipo con fotos y roles de desarrolladores
 * 
 * Esto es para el flujo: Es la página institucional que refuerza la marca
 * y genera confianza mostrando los valores, ubicaciones y personas detrás del proyecto.
 */
function NosotrosPage() {
  // Actualiza el título de la pestaña del navegador a "Nosotros"
  useDocumentTitle('Nosotros');

  return (
    <Container className="my-5">
      {/* ===== SECCIÓN: HISTORIA ===== */}
      {/* Esto es para: Presentar la historia y propósito de HuertoHogar al usuario */}
      {/* Esto lo que hace es: Renderiza un layout responsivo con texto a la izquierda
          e imagen del campo chileno a la derecha */}
      <section className="row align-items-center mb-5">
        {/* Columna de texto - 6 cols en desktop, full width en mobile */}
        <Col md={6} className="mb-4 mb-md-0">
          <h1 className="section-title mb-4">Sobre HuertoHogar</h1>
          {/* Texto destacado que resume la propuesta principal */}
          <p className="lead">Conectando a las familias chilenas con el campo desde 2019.</p>
          {/* Párrafos de descripción de la misión y visión general */}
          <p>HuertoHogar nació con la misión de llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.</p>
          <p>Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.</p>
        </Col>
        {/* Columna de imagen - 6 cols en desktop, full width en mobile */}
        <Col md={6}>
          {/* Imagen del campo chileno con borde redondeado y sombra */}
          <Image 
            src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/CampoChileno.avif" 
            alt="Campo chileno" 
            fluid 
            rounded 
            className="shadow" 
          />
        </Col>
      </section>

      {/* ===== SECCIÓN: MISIÓN Y VISIÓN ===== */}
      {/* Esto es para: Comunicar los objetivos a corto (misión) y largo (visión) plazo de la empresa */}
      {/* Esto lo que hace es: Muestra 2 tarjetas lado a lado, una por cada concepto,
          con iconos, títulos y descripciones detalladas */}
      <section className="row mb-5">
        {/* TARJETA 1: MISIÓN - 6 cols en desktop, full width en mobile */}
        {/* Esto es para: Explicar qué hace la empresa (su propósito actual) */}
        <Col md={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm text-center p-4">
            <Card.Body>
              {/* Icono de objetivo/bullseye - Color verde esmeralda */}
              <i className="bi bi-bullseye display-4 mb-3" style={{ color: '#2E8B57' }}></i>
              <Card.Title as="h3">Misión</Card.Title>
              <Card.Text>
                Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* TARJETA 2: VISIÓN - 6 cols en desktop, full width en mobile */}
        {/* Esto es para: Explicar dónde quiere llegar la empresa (objetivo a largo plazo) */}
        <Col md={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm text-center p-4">
            <Card.Body>
              {/* Icono de ojo/visión - Color verde esmeralda */}
              <i className="bi bi-eye display-4 mb-3" style={{ color: '#2E8B57' }}></i>
              <Card.Title as="h3">Visión</Card.Title>
              <Card.Text>
                Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </section>

      {/* ===== SECCIÓN: VALORES CORPORATIVOS ===== */}
      {/* Esto es para: Mostrar los 4 pilares de la empresa que guían su funcionamiento */}
      {/* Esto lo que hace es: Renderiza un grid de 4 valores con:
          - Icono representativo
          - Título del valor
          - Descripción corta
          Layout: 3 cols en desktop, 2 en tablet, 1 en mobile */}
      <section className="mb-5">
        {/* Encabezado de la sección */}
        <h2 className="text-center section-title mb-4">Nuestros Valores</h2>
        <Row className="text-center">
          {/* VALOR 1: SOSTENIBILIDAD */}
          {/* Esto es para: Comunicar compromiso ambiental de la empresa */}
          <Col md={3} xs={6} className="mb-4">
            {/* Icono de árbol - Representa naturaleza y sostenibilidad */}
            <i className="bi bi-tree fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Sostenibilidad</h5>
            <p className="text-muted">Promovemos prácticas agrícolas responsables con el medio ambiente</p>
          </Col>
          {/* VALOR 2: CALIDAD */}
          {/* Esto es para: Comunicar estándares altos en productos y servicio */}
          <Col md={3} xs={6} className="mb-4">
            {/* Icono de corazón - Representa cuidado en selección de productos */}
            <i className="bi bi-heart fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Calidad</h5>
            <p className="text-muted">Productos seleccionados con los más altos estándares de calidad</p>
          </Col>
          {/* VALOR 3: COMUNIDAD */}
          {/* Esto es para: Comunicar impacto social positivo local */}
          <Col md={3} xs={6} className="mb-4">
            {/* Icono de personas - Representa trabajo colaborativo y apoyo comunitario */}
            <i className="bi bi-people fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Comunidad</h5>
            <p className="text-muted">Apoyamos a agricultores y comunidades locales</p>
          </Col>
          {/* VALOR 4: CONFIANZA */}
          {/* Esto es para: Comunicar transparencia y fiabilidad en operaciones */}
          <Col md={3} xs={6} className="mb-4">
            {/* Icono de escudo con check - Representa seguridad y confianza */}
            <i className="bi bi-shield-check fs-1 mb-3" style={{ color: 'var(--verde-esmeralda)' }}></i>
            <h5>Confianza</h5>
            <p className="text-muted">Transparencia en cada etapa de nuestro proceso</p>
          </Col>
        </Row>
      </section>

      {/* ===== SECCIÓN: UBICACIONES Y MAPA ===== */}
      {/* Esto es para: Mostrar dónde se ubican las tiendas físicas de HuertoHogar en Chile */}
      {/* Esto lo que hace es: Renderiza un layout responsivo con:
          - Columna izquierda: Lista de 6 ubicaciones con direcciones
          - Columna derecha: Componente MapComponent interactivo
          Layout: 6 cols cada uno en desktop, full width en mobile */}
      <section className="mb-5">
        {/* Encabezado de la sección */}
        <h2 className="text-center section-title mb-4">Nuestras Tiendas</h2>
        <p className="text-center text-muted mb-4">Contamos con presencia en las principales ciudades de Chile.</p>
        <Row>
          {/* COLUMNA IZQUIERDA: LISTA DE UBICACIONES */}
          {/* Esto es para: Proporcionar información de contacto de cada sucursal */}
          <Col md={6} className="mb-4 mb-md-0">
            <Card className="h-100 shadow-sm">
              {/* Header de tarjeta con icono y título */}
              <Card.Header as="h5" className="bg-success text-white">
                <i className="bi bi-geo-alt me-2"></i>Ubicaciones
              </Card.Header>
              {/* ListGroup renderiza cada ubicación como item con ciudad y dirección */}
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Santiago</strong> - Av. Principal 123
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Puerto Montt</strong> - Costanera 456
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Villarica</strong> - Calle Lagos 789
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Viña del Mar</strong> - Av. del Mar 321
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Valparaíso</strong> - Cerro Alegre 654
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-fill me-2 text-success"></i>
                  <strong>Concepción</strong> - Barrio Universitario 987
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          {/* COLUMNA DERECHA: MAPA INTERACTIVO */}
          {/* Esto es para: Mostrar ubicaciones en formato visual/geográfico con Google Maps */}
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              {/* Header de tarjeta con icono de mapa */}
              <Card.Header as="h5" className="bg-success text-white">
                <i className="bi bi-map me-2"></i>Mapa de Ubicaciones
              </Card.Header>
              {/* Body sin padding para que MapComponent llene el espacio completo */}
              <Card.Body className="p-0" style={{ minHeight: '400px' }}>
                {/* MapComponent: Componente reutilizable que renderiza Google Maps con marcadores */}
                <MapComponent />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* ===== SECCIÓN: EQUIPO ===== */}
      {/* Esto es para: Presentar los miembros del equipo desarrollador y sus roles */}
      {/* Esto lo que hace es: Renderiza un grid de 3 tarjetas con:
          - Foto del desarrollador
          - Nombre
          - Rol técnico (Testing, Backend, Frontend)
          - Descripción académica
          Layout: 3 cols en desktop, 2 en tablet, 1 en mobile */}
      <section>
        {/* Encabezado de la sección */}
        <h2 className="text-center section-title mb-4">Nuestro Equipo</h2>
        <Row>
          {/* MIEMBRO 1: DANILO CELIS - TESTING */}
          {/* Esto es para: Mostrar responsable de calidad y testing del proyecto */}
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              {/* Imagen del miembro del equipo con clase team-photo para estilos especiales */}
              <Card.Img 
                variant="top" 
                src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/danilo.jpg" 
                alt="Danilo Celis" 
                className="team-photo" 
              />
              <Card.Body>
                <Card.Title as="h5">Danilo Celis</Card.Title>
                {/* Rol/especialidad en el equipo */}
                <Card.Subtitle className="mb-2 text-muted">Testing</Card.Subtitle>
                {/* Descripción de formación académica */}
                <Card.Text>Estudiante De Ingeniería Informática.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* MIEMBRO 2: MATIAS GUZMAN - BACKEND */}
          {/* Esto es para: Mostrar responsable del desarrollo de APIs y lógica de servidor */}
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              {/* Imagen del miembro del equipo */}
              <Card.Img 
                variant="top" 
                src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/Matias.jpg" 
                alt="Matias Guzman" 
                className="team-photo" 
              />
              <Card.Body>
                <Card.Title as="h5">Matias Guzman</Card.Title>
                {/* Rol/especialidad en el equipo */}
                <Card.Subtitle className="mb-2 text-muted">Backend</Card.Subtitle>
                {/* Descripción de formación académica */}
                <Card.Text>Estudiante De Ingeniería Informática.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* MIEMBRO 3: FELIPE QUEZADA - FRONTEND */}
          {/* Esto es para: Mostrar responsable del desarrollo de interfaz y experiencia de usuario */}
          <Col md={4} className="mb-4">
            <Card className="text-center border-0 shadow-sm h-100">
              {/* Imagen del miembro del equipo */}
              <Card.Img 
                variant="top" 
                src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/felipe.jpg" 
                alt="Felipe Quezada" 
                className="team-photo" 
              />
              <Card.Body>
                <Card.Title as="h5">Felipe Quezada</Card.Title>
                {/* Rol/especialidad en el equipo */}
                <Card.Subtitle className="mb-2 text-muted">Frontend</Card.Subtitle>
                {/* Descripción de formación académica */}
                <Card.Text>Estudiante De Ingeniería Informática.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default NosotrosPage;