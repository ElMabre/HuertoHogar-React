import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * BlogPage Component
 * Esto lo que hace es: Renderiza una página con un listado de artículos de blog en formato de tarjetas
 * Esto es para: Mostrar el catálogo de artículos disponibles y permitir que los usuarios naveguen a cada uno
 */
function BlogPage() {
/**
 * Array de artículos del blog
 * Esto lo que hace is: Define los datos de todos los artículos disponibles (id, título, categoría, fecha, autor, etc.)
 * Esto es para: Simular una base de datos de blog para demostración (en producción vendría de una API)
 */
const blogArticles = [
  {
    id: "1",
    categoria: "Salud",
    titulo: "Beneficios de comer orgánico",
    fecha: "15 Marzo, 2024",
    autor: "Equipo Huerto Hogar",
    tiempo: "5 min de lectura",
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    contenido: "Los productos orgánicos son cultivados sin pesticidas ni fertilizantes sintéticos, lo que los hace más saludables para ti y para el planeta..."
  },
  {
    id: "2",
    categoria: "Sostenibilidad",
    titulo: "Cómo reducir tu huella de carbono",
    fecha: "8 Marzo, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "4 min de lectura",
    imagen: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    contenido: "Es la cantidad total de gases de efecto invernadero emitidos por nuestras acciones diarias. Acciones para reducirla: Compra productos locales..."
  },
  {
    id: "3",
    categoria: "Urban farming",
    titulo: "Guía para crear tu huerto urbano",
    fecha: "1 Marzo, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "6 min de lectura",
    imagen: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    contenido: "¿Cómo empezar tu huerto en casa? 1. Elige el lugar: Busca un espacio con buena luz natural. 2. Selecciona las plantas: Comienza con hierbas fáciles..."
  },
  {
    id: "4",
    categoria: "Recetas",
    titulo: "5 recetas con productos de temporada",
    fecha: "22 Febrero, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "7 min de lectura",
    imagen: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    contenido: "Recetas fáciles y deliciosas: 1. Ensalada de espinaca y nueces. 2. Crema de zanahoria. 3. Salteado de pimientos tricolores..."
  }
];

  // Hook personalizado para actualizar el título del documento
  useDocumentTitle('Blog');
  
  return (
    <Container className="my-5">
      {/* Encabezado de la página con título y descripción */}
      <div className="text-center mb-5">
        <h1 className="section-title">Blog de HuertoHogar</h1>
        <p className="lead text-muted">
          Descubre consejos, recetas y novedades sobre alimentación saludable.
        </p>
      </div>

      {/* Grid responsivo de tarjetas de artículos */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {/* Renderizar cada artículo como una tarjeta */}
        {blogArticles.map((article) => (
          <Col key={article.id}>
            <Card className="h-100 shadow-sm">
              {/* Imagen destacada del artículo */}
              <Card.Img
                variant="top"
                src={article.imagen}
                alt={article.titulo}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              {/* Contenido de la tarjeta */}
              <Card.Body className="d-flex flex-column">
                {/* Badge de categoría del artículo */}
                <Badge bg="success" className="mb-2 align-self-start">{article.categoria}</Badge>
                {/* Título del artículo */}
                <Card.Title as="h5" className="card-title">{article.titulo}</Card.Title>
                {/* Resumen truncado del contenido (primeros 120 caracteres) */}
                <Card.Text className="text-muted">
                  {article.contenido.substring(0, 120)}...
                </Card.Text>
                
                {/* Pie de la tarjeta con fecha y botón de lectura */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  {/* Fecha de publicación del artículo */}
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {article.fecha}
                  </small>
                  {/* Botón para navegar al artículo completo */}
                  <Button
                    as={Link}
                    to={`/blog/${article.id}`} 
                    variant="outline-success"
                    size="sm"
                  >
                    Leer más
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default BlogPage;