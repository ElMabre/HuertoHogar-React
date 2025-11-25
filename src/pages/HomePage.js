import React from 'react';
import { Container, Row, Col, Button, Image, Card, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * HomePage Component
 * 
 * Esto es para: Ser la página principal/inicio de la aplicación donde los usuarios descubren
 * la marca HuertoHogar y acceden a las principales características y productos.
 * 
 * Esto lo que hace es: Renderiza una página de inicio con:
 * - Hero section con logo y mensajes de bienvenida
 * - Sección de beneficios destacando ventajas (envío rápido, frescura, calidad)
 * - Productos destacados extraídos del contexto de productos (máximo 3)
 * - Sección de categorías con enlaces para filtrar productos
 * - Newsletter subscription form para capturar emails de clientes
 * 
 * Esto es para el flujo: Es el punto de entrada principal de la aplicación,
 * permite que nuevos usuarios conozcan el negocio y naveguen hacia productos o información.
 */
function HomePage() {
  // Actualiza el título de la pestaña del navegador a "Inicio"
  useDocumentTitle('Inicio'); 
  
  // Extrae la función getFeaturedProducts del contexto de productos
  // Esto es para: Obtener acceso a la lógica de productos destacados
  const { getFeaturedProducts } = useProducts();
  
  // Obtiene los primeros 3 productos destacados del catálogo
  // getFeaturedProducts(3) retorna un array de productos con isDestacado: true, limitado a 3 items
  const featuredProducts = getFeaturedProducts(3);  
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      {/* Esto es para: Captar la atención del usuario con un mensaje de bienvenida prominente */}
      {/* Esto lo que hace es: Renderiza un contenedor full-width con fondo oscuro (clase 'hero'),
          texto centrado, y una imagen del logo de HuertoHogar que anima con fade-in */}
      <Container fluid className="hero text-white text-center py-5">
        <Row className="justify-content-center py-5">
          <Col lg={8}>
            {/* Logo de HuertoHogar - Esto es para: Mostrar la identidad visual de la marca */}
            <Image
              src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/huertohogarlogoconfondo.png"
              alt="Logo HuertoHogar"
              className="mb-4 mx-auto d-block animate-fade-in"  // Animación CSS definida en index.css o App.css
            />
            {/* Título principal de bienvenida */}
            <h1 className="display-4 fw-bold mb-4">¡Bienvenido a HuertoHogar!</h1>
            {/* Subtitle con la propuesta de valor principal */}
            <p className="lead mb-5">Productos frescos y naturales directo del campo a tu hogar.
            Conectamos a las familias chilenas con lo mejor de nuestra tierra.</p>
            {/* Botones de navegación principal - Esto es para: Guiar al usuario a las secciones claves */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {/* Enlace a productos - Botón principal (warning/amarillo) */}
              <Button as={Link} to="/productos" variant="warning" size="lg">Ver Productos</Button>
              {/* Enlace a página de nosotros - Botón secundario (outline) */}
              <Button as={Link} to="/nosotros" variant="outline-light" size="lg">Conócenos</Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ===== SECCIÓN DE BENEFICIOS ===== */}
      {/* Esto es para: Convencer al usuario de elegir HuertoHogar destacando ventajas competitivas */}
      {/* Esto lo que hace es: Muestra 3 tarjetas con beneficios (envío rápido, frescura, calidad premium)
          cada una con un icono, título y descripción */}
      <Container className="py-5">
        {/* Encabezado de la sección */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">¿Por qué elegir HuertoHogar?</h2>
            <p className="text-muted">Te ofrecemos la mejor experiencia en productos frescos y naturales</p>
          </Col>
        </Row>
        {/* Grid de 3 beneficios responsivos (4 cols en desktop, apilados en mobile) */}
        <Row>
          {/* BENEFICIO 1: Envío Rápido */}
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                {/* Icono de camión de Bootstrap Icons - Color verde esmeralda (#2E8B57) */}
                <i className="bi bi-truck display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Envío Rápido</h3>
                <p className="text-muted">Recibe tus productos frescos en la puerta de tu casa en 24-48 horas.</p>
              </Card.Body>
            </Card>
          </Col>
          {/* BENEFICIO 2: Frescura Garantizada */}
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                {/* Icono de ciclo/refresco - Representa productos frescos continuamente disponibles */}
                <i className="bi bi-arrow-repeat display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Frescura Garantizada</h3>
                <p className="text-muted">Productos cosechados en su punto óptimo y entregados directamente.</p>
              </Card.Body>
            </Card>
          </Col>
          {/* BENEFICIO 3: Calidad Premium */}
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                {/* Icono de corazón - Representa cuidado y calidad en la selección */}
                <i className="bi bi-heart display-4 mb-3" style={{ color: '#2E8B57' }}></i>
                <h3 className="h4">Calidad Premium</h3>
                <p className="text-muted">Seleccionamos los mejores productos orgánicos y sostenibles para ti.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ===== SECCIÓN DE PRODUCTOS DESTACADOS ===== */}
      {/* Esto es para: Mostrar al usuario los productos más populares/destacados de la tienda */}
      {/* Esto lo que hace es: Renderiza una sección con fondo gris claro que contiene
          un grid responsivo de 3 productos destacados en desktop, 2 en tablet, 1 en mobile */}
      <Container fluid className="py-5 bg-light">
        <Container>
          {/* Encabezado de la sección */}
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Productos Destacados</h2>
              <p className="text-muted">Descubre nuestros productos más populares</p>
            </Col>
          </Row>
          {/* Grid responsivo que muestra las tarjetas de productos */}
          {/* xs={1}: 1 columna en mobile, md={2}: 2 en tablet, lg={3}: 3 en desktop */}
          {/* g-4: espaciado de 4 entre elementos */}
          <Row xs={1} md={2} lg={3} className="g-4" id="featuredProducts">
            {/* Condicional: Si hay productos destacados, mapear y mostrar ProductCard para cada uno */}
            {/* Si no hay productos (array vacío), mostrar mensaje de carga */}
            {featuredProducts.length > 0 ? (
              featuredProducts.map( product  => (
                // Cada producto se envuelve en una columna responsive
                <Col key={product.id}>
                  {/* ProductCard: Componente reutilizable que muestra nombre, precio, categoría, imagen y stock */}
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              // Fallback si no hay productos disponibles
              <Col className="text-center"><p>Cargando productos...</p></Col>
            )}
          </Row>
          {/* Botón para navegar a la página completa de productos */}
          {/* Esto es para: Permitir que el usuario vea más opciones de productos más allá de los destacados */}
          <div className="text-center mt-5">
            <Button as={Link} to="/productos" variant="outline-success">Ver Todos los Productos</Button>
          </div>
        </Container>
      </Container>

      {/* ===== SECCIÓN DE CATEGORÍAS ===== */}
      {/* Esto es para: Proporcionar acceso rápido a los principales tipos de productos */}
      {/* Esto lo que hace es: Muestra 4 tarjetas clickeables con imágenes de categorías
          (Frutas, Verduras, Orgánicos, Lácteos) que navegan a la página de productos con filtro */}
      <Container className="py-5">
        {/* Encabezado de la sección */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Nuestras Categorías</h2>
            <p className="text-muted">Explora nuestra variedad de productos frescos</p>
          </Col>
        </Row>
        {/* Grid de 4 categorías responsivas: 2 en mobile (xs={6}), 3 en tablet, 3 en desktop (md={3}) */}
        <Row>
          {/* CATEGORÍA 1: Frutas Frescas */}
          {/* Esto es para: Navegar a productos filtrados por categoría frutas */}
          {/* Card renderizado como Link para navegación - Link remover estilos por defecto (text-decoration-none, text-dark) */}
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=frutas" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              {/* Imagen de portada de la categoría con altura fija y object-fit para mantener proporción */}
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/FrutasFrescas.avif" alt="Frutas Frescas" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Frutas Frescas</h3>
              </Card.Body>
            </Card>
          </Col>
          {/* CATEGORÍA 2: Verduras Orgánicas */}
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=verduras" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/VerdurasOrganicas.avif" alt="Verduras Orgánicas" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Verduras Orgánicas</h3>
              </Card.Body>
            </Card>
          </Col>
          {/* CATEGORÍA 3: Productos Orgánicos */}
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=organicos" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/ProductosOrganicos.webp" alt="Productos Orgánicos" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Productos Orgánicos</h3>
              </Card.Body>
            </Card>
          </Col>
          {/* CATEGORÍA 4: Productos Lácteos */}
          <Col md={3} xs={6} className="mb-4">
            <Card as={Link} to="/productos?categoria=lacteos" className="text-decoration-none text-dark category-card h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/ProductosLacteos.avif" alt="Productos Lácteos" style={{ height: '180px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <h3 className="h5">Productos Lácteos</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ===== SECCIÓN DE NEWSLETTER ===== */}
      {/* Esto es para: Capturar direcciones de email de usuarios para marketing y comunicaciones */}
      {/* Esto lo que hace es: Muestra una sección de fondo verde oscuro con un formulario
          para que usuarios se suscriban a newsletter con email, incluye mensaje de privacidad */}
      <Container fluid className="py-5 bg-success text-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              {/* Encabezado y descripción de beneficios */}
              <h2 className="mb-3">Suscríbete a nuestro Newsletter</h2>
              <p className="mb-4">Recibe ofertas exclusivas, recetas saludables y consejos para tu huerto urbano.</p>
              {/* Formulario de suscripción */}
              {/* Esto es para: Permitir que usuarios ingresen su email para newsletter */}
              <Form>
                <Row className="g-2 justify-content-center">
                  <Col md={6}>
                    {/* InputGroup combina campo de input con botón de submit */}
                    <InputGroup>
                      {/* Campo de email requerido para suscripción */}
                      <Form.Control type="email" placeholder="Tu correo electrónico" required />
                      {/* Botón submit con color warning (amarillo) para consistencia visual con CTA principal */}
                      <Button variant="warning" type="submit">Suscribirme</Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Form>
              {/* Aviso de privacidad para generar confianza en usuarios */}
              <small className="d-block mt-3">* Nos comprometemos a no compartir tu información.</small>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default HomePage;