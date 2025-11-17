import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Image, Breadcrumb, Alert, ListGroup } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';

// --- Datos del Blog (AHORA SIN HTML) ---
const blogArticles = [
  {
    id: "1",
    categoria: "Salud",
    titulo: "Beneficios de comer orgánico",
    fecha: "15 Marzo, 2024",
    autor: "Equipo Huerto Hogar",
    tiempo: "5 min de lectura",
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "2",
    categoria: "Sostenibilidad",
    titulo: "Cómo reducir tu huella de carbono",
    fecha: "8 Marzo, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "4 min de lectura",
    imagen: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "3",
    categoria: "Urban farming",
    titulo: "Guía para crear tu huerto urbano",
    fecha: "1M Marzo, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "6 min de lectura",
    imagen: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "4",
    categoria: "Recetas",
    titulo: "5 recetas con productos de temporada",
    fecha: "22 Febrero, 2024",
    autor: "Equipo HuertoHogar",
    tiempo: "7 min de lectura",
    imagen: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  }
];
// --- Fin de los datos ---

// --- Componente de Contenido de Artículo ---
// Esto renderiza el contenido correcto basado en el ID
const ArticleContent = ({ id }) => {
  switch (id) {
    case '1':
      return (
        <>
          <h4><i className="bi bi-heart-pulse-fill text-success me-2"></i> ¿Por qué elegir productos orgánicos?</h4>
          <p>
            Los productos orgánicos son cultivados sin pesticidas ni fertilizantes
            sintéticos, lo que los hace más saludables para ti y para el planeta.
          </p>
          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Menos químicos:</strong> Reduces la exposición a sustancias tóxicas.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-emoji-sunglasses text-warning me-2"></i><strong>Más nutrientes:</strong> Suelen tener mayor concentración de vitaminas y minerales.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-emoji-heart-eyes text-danger me-2"></i><strong>Mejor sabor:</strong> Su frescura y calidad se notan en cada bocado.</ListGroup.Item>
          </ListGroup>
          <Alert variant="success" className="d-flex align-items-center">
            <i className="bi bi-leaf fs-4 me-2"></i>
            <div>
              ¡Elige orgánico y apoya a los agricultores locales!
            </div>
          </Alert>
          <h5 className="mt-4"><i className="bi bi-emoji-smile text-warning me-2"></i> Consejos para una vida más saludable</h5>
          <ListGroup variant="flush">
            <ListGroup.Item><i className="bi bi-calendar2-week text-success me-2"></i>Prefiere frutas y verduras de temporada.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-droplet-half text-primary me-2"></i>Lava bien los alimentos antes de consumirlos.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-palette2 text-info me-2"></i>Incluye variedad de colores en tu plato.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-people-fill text-secondary me-2"></i>Comparte tus comidas en familia.</ListGroup.Item>
          </ListGroup>
          <blockquote className="blockquote text-center mt-4 p-3 bg-light rounded">
            <p className="mb-0"><i className="bi bi-quote text-success"></i> Que tu alimento sea tu medicina y tu medicina sea tu alimento.</p>
            <footer className="blockquote-footer mt-1">Hipócrates</footer>
          </blockquote>
          <Alert variant="info" className="mt-4 d-flex align-items-center">
            <i className="bi bi-info-circle fs-4 me-2"></i>
            <div>
              <strong>Dato:</strong> Los productos orgánicos ayudan a conservar la biodiversidad y los suelos fértiles.
            </div>
          </Alert>
        </>
      );
    case '2':
      return (
        <>
          <h4><i className="bi bi-globe2 text-info me-2"></i> ¿Qué es la huella de carbono?</h4>
          <p>
            Es la cantidad total de gases de efecto invernadero emitidos por nuestras
            acciones diarias.
          </p>
          <h5 className="mt-4"><i className="bi bi-tree-fill text-success me-2"></i> Acciones para reducirla:</h5>
          <ListGroup variant="flush">
            <ListGroup.Item><i className="bi bi-bag-check text-success me-2"></i> Compra productos locales y de temporada.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-recycle text-success me-2"></i> Recicla y reutiliza envases.</ListGroup.Item>
            <ListGroup.Item><i className="bi bi-bicycle text-success me-2"></i> Prefiere medios de transporte sustentables.</ListGroup.Item>
          </ListGroup>
          <Alert variant="info" className="d-flex align-items-center mt-4">
            <i className="bi bi-lightning-charge fs-4 me-2"></i>
            <div>
              Cada pequeño cambio suma para cuidar el planeta.
            </div>
          </Alert>
        </>
      );
    case '3':
      return (
        <>
          <h4><i className="bi bi-flower1 text-success me-2"></i> ¿Cómo empezar tu huerto en casa?</h4>
          <ol className="list-group list-group-numbered">
            <ListGroup.Item as="li"><strong>Elige el lugar:</strong> Busca un espacio con buena luz natural.</ListGroup.Item>
            <ListGroup.Item as="li"><strong>Selecciona las plantas:</strong> Comienza con hierbas fáciles como albahaca, perejil o cilantro.</ListGroup.Item>
            <ListGroup.Item as="li"><strong>Prepara la tierra:</strong> Usa sustrato de calidad y abono orgánico.</ListGroup.Item>
            <ListGroup.Item as="li"><strong>Riego:</strong> Mantén la humedad sin encharcar.</ListGroup.Item>
          </ol>
          <Alert variant="warning" className="d-flex align-items-center mt-4">
            <i className="bi bi-brightness-high fs-4 me-2"></i>
            <div>
              Recuerda: la luz solar es clave para el crecimiento de tus plantas.
            </div>
          </Alert>
          <p className="mt-3 fs-5">
            <i className="bi bi-emoji-smile text-success me-2"></i> ¡Disfruta cosechando tus propios alimentos frescos!
          </p>
        </>
      );
    case '4':
      return (
        <>
          <h4><i className="bi bi-egg-fried text-danger me-2"></i> Recetas fáciles y deliciosas</h4>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Ensalada de espinaca y nueces:</strong> Espinaca fresca, nueces, queso de cabra y vinagreta de miel.</ListGroup.Item>
            <ListGroup.Item><strong>Crema de zanahoria:</strong> Zanahorias, cebolla, caldo de verduras y un toque de jengibre.</ListGroup.Item>
            <ListGroup.Item><strong>Salteado de pimientos tricolores:</strong> Pimientos rojos, verdes y amarillos con aceite de oliva y ajo.</ListGroup.Item>
            <ListGroup.Item><strong>Plátanos asados con miel:</strong> Plátanos maduros al horno con miel orgánica.</ListGroup.Item>
            <ListGroup.Item><strong>Jugo de naranja y manzana:</strong> Exprime naranjas y manzanas frescas para un jugo natural.</ListGroup.Item>
          </ListGroup>
          <Alert variant="danger" className="d-flex align-items-center mt-4">
            <i className="bi bi-emoji-heart-eyes fs-4 me-2"></i>
            <div>
              ¡Aprovecha los productos de temporada para comer rico y saludable!
            </div>
          </Alert>
        </>
      );
    default:
      return <p>Contenido no encontrado.</p>;
  }
};


function BlogDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mover el hook del título aquí
  useDocumentTitle(article ? article.titulo : 'Blog');

  useEffect(() => {
    const foundArticle = blogArticles.find(a => a.id === id);
    if (foundArticle) {
      setArticle(foundArticle);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <Container className="my-5"><p>Cargando artículo...</p></Container>;
  }

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <Container className="my-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item as={Link} to="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to="/blog">Blog</Breadcrumb.Item>
        <Breadcrumb.Item active>{article.titulo}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Contenido del artículo */}
      <article>
        <header className="text-center mb-5">
          <Badge bg="success" className="mb-2">{article.categoria}</Badge>
          <h1 className="section-title">{article.titulo}</h1>
          <div className="text-muted">
            <i className="bi bi-calendar me-1"></i>{article.fecha}
            <i className="bi bi-person ms-3 me-1"></i>Por {article.autor}
            <i className="bi bi-clock ms-3 me-1"></i>{article.tiempo}
          </div>
        </header>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Image 
              src={article.imagen} 
              alt={article.titulo} 
              fluid 
              rounded 
              className="mb-4" 
              style={{width: '100%', maxHeight: '450px', objectFit: 'cover'}} 
            />
            
            {/* *** INICIO DE LA CORRECCIÓN ***
              Reemplazamos dangerouslySetInnerHTML con el componente 
              que renderiza JSX de forma segura.
            */}
            <div className="blog-content">
              <ArticleContent id={article.id} />
            </div>
            {/* *** FIN DE LA CORRECCIÓN *** */}

            {/* Footer del artículo */}
            <footer className="mt-5 pt-4 border-top">
              <Link to="/blog" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>Volver al blog
              </Link>
            </footer>
          </Col>
        </Row>
      </article>
    </Container>
  );
}

export default BlogDetail;