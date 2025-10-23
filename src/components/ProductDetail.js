import React, { useState, useEffect } from 'react';
// Importa useParams para leer parámetros de la URL
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, Button, Breadcrumb } from 'react-bootstrap';

// Necesitamos acceso a la lista de productos (temporalmente la duplicamos aquí)
// En una app real, esto vendría de un estado global (Context) o una API
const initialProducts = [
    { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, categoria: 'frutas', imagen: '../img/manzana.jpg', stock: 150, descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.', origen: 'Valle del Maule' },
    { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, categoria: 'frutas', imagen: '../img/naranja.jpg', stock: 200, descripcion: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes.', origen: 'Región de Valparaíso' },
    { id: 'FR003', nombre: 'Plátanos Cavendish', precio: 800, categoria: 'frutas', imagen: '../img/platano.jpg', stock: 250, descripcion: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.', origen: 'Región de O\'Higgins' },
    { id: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, categoria: 'verduras', imagen: '../img/zanahoria.jpg', stock: 100, descripcion: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra.', origen: 'Región de O\'Higgins' },
    { id: 'VR002', nombre: 'Espinacas Frescas', precio: 700, categoria: 'verduras', imagen: '../img/espinaca.jpg', stock: 80, descripcion: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.', origen: 'Región Metropolitana' },
    { id: 'VR003', nombre: 'Pimientos Tricolores', precio: 1500, categoria: 'verduras', imagen: '../img/pimiento.jpg', stock: 120, descripcion: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.', origen: 'Región de Valparaíso' },
    { id: 'PO001', nombre: 'Miel Orgánica', precio: 5000, categoria: 'organicos', imagen: '../img/miel.jpg', stock: 50, descripcion: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes.', origen: 'Región del Maule' },
    { id: 'PO002', nombre: 'Quinua Orgánica', precio: 3500, categoria: 'organicos', imagen: '../img/quinua.jpg', stock: 75, descripcion: 'Quinua orgánica de alta calidad, perfecta para ensaladas y platos saludables.', origen: 'Región de La Araucanía' },
    { id: 'PL001', nombre: 'Leche Entera', precio: 1200, categoria: 'lacteos', imagen: '../img/leche.jpg', stock: 60, descripcion: 'Leche entera fresca de vacas criadas en praderas naturales.', origen: 'Región de Los Lagos' }
]; // Fin de initialProducts

function ProductDetail() {
  // Obtiene el parámetro 'id' de la URL (ej: /producto/FR001 -> id = 'FR001')
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad

  // Efecto para buscar el producto cuando el 'id' cambia
  useEffect(() => {
    const foundProduct = initialProducts.find(p => p.id === id);
    setProduct(foundProduct);
    setQuantity(1); // Reset quantity when product changes
    // Aquí podrías redirigir si foundProduct es undefined, o mostrar un "No encontrado"
  }, [id]); // Dependencia: se ejecuta si 'id' cambia

  // Función para manejar el cambio en el input de cantidad
  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > product.stock) {
      value = product.stock; // No permitir más que el stock
    }
    setQuantity(value);
  };

   // Función placeholder para añadir al carrito
   const handleAddToCart = () => {
    if (!product) return;
    console.log(`Añadiendo ${quantity} de ${product.id} al carrito`);
    // Lógica real del carrito pendiente
    alert(`${quantity} x ${product.nombre} añadido (función real pendiente)`);
  };


  // Si el producto aún no se ha encontrado (o está cargando)
  if (!product) {
    // Podrías mostrar un spinner aquí
    return <Container className="my-5"><p>Cargando producto...</p></Container>;
  }

  // Si el producto no existe en nuestra lista
  // if (!product && id) { // Verificamos id para evitar mensaje antes de buscar
  //   return <Container className="my-5"><p>Producto no encontrado.</p></Container>;
  // }


  // Renderiza el detalle del producto encontrado
  return (
    <Container className="my-5">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Columna de la Imagen */}
        <Col md={6} className="mb-4">
          <Image
            src={product.imagen || 'https://via.placeholder.com/600x400?text=Imagen+no+disponible'}
            alt={product.nombre}
            fluid // Hace la imagen responsiva
            rounded
            className="shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'contain', width: '100%', background: '#fff' }}
          />
        </Col>

        {/* Columna de Detalles */}
        <Col md={6} className="mb-4">
          <Badge bg="success" className="mb-2">{product.categoria}</Badge>
          <h1 style={{ color: '#8B4513' }}>{product.nombre}</h1>
          <p className="text-muted">Origen: {product.origen}</p>

          <div className="d-flex align-items-center mb-3">
            <h3 style={{ color: '#2E8B57' }} className="me-3">
              ${product.precio.toLocaleString('es-CL')}
            </h3>
            <Badge bg={product.stock > 10 ? 'success' : 'warning'}>
              {product.stock > 10 ? 'En stock' : (product.stock > 0 ? 'Últimas unidades' : 'Sin Stock')}
            </Badge>
          </div>

          <p>{product.descripcion}</p>

          {/* Sección de Cantidad */}
          {product.stock > 0 && ( // Solo mostrar si hay stock
             <Row className="align-items-center mb-4">
                <Col xs="auto">
                  <label htmlFor="cantidad" className="form-label mb-0">Cantidad:</label>
                </Col>
                <Col xs={3} sm={2}>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={handleQuantityChange} // Llama a la función al cambiar
                  />
                </Col>
                <Col>
                  <span className="text-muted">Disponible: {product.stock} unidades</span>
                </Col>
              </Row>
          )}


          {/* Botones */}
          <div className="d-grid gap-2 d-md-block">
            <Button
                variant="warning"
                onClick={handleAddToCart}
                disabled={product.stock <= 0} // Deshabilitar si no hay stock
                className="me-md-2 mb-2 mb-md-0"
                style={{ minWidth: '180px' }} >
              <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
            </Button>
            {/* <Button variant="outline-success" disabled={product.stock <= 0} style={{ minWidth: '150px' }}>
              <i className="bi bi-heart me-2"></i>Guardar
            </Button> */}
          </div>

          {/* Información Adicional */}
           <div className="mt-4">
             <div className="d-flex align-items-center text-muted">
               <i className="bi bi-truck me-2"></i>
               <span>Envío gratis en compras sobre $15.000</span>
             </div>
             <div className="d-flex align-items-center text-muted mt-1">
               <i className="bi bi-arrow-clockwise me-2"></i>
               <span>Devolución gratuita en 7 días</span>
             </div>
           </div>

        </Col>
      </Row>

      {/* Podríamos añadir productos relacionados aquí después */}

    </Container>
  );
}

export default ProductDetail;