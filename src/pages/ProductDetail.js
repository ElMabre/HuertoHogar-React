import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Form,
  Breadcrumb,
  Alert
} from "react-bootstrap";
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * ProductDetail Component
 * 
 * Esto es para: Mostrar la página de detalle de un producto individual
 * donde el usuario puede ver información completa y decidir si agregarlo al carrito.
 * 
 * Esto lo que hace es: Renderiza una página con:
 * - Breadcrumb de navegación (Inicio > Productos > Nombre del Producto)
 * - Imagen grande del producto a la izquierda
 * - Información detallada a la derecha: nombre, precio, origen, categoría, stock
 * - Selector de cantidad con validación
 * - Botones para agregar al carrito y guardar como favorito
 * - Información de envío y devolución
 * - Fallback si el producto no existe
 * 
 * Esto es para el flujo: Es la página de detalles donde el usuario toma
 * la decisión de compra después de buscar/filtrar productos.
 */
function ProductDetail() {
  // Obtiene el ID del producto de la URL usando useParams
  // Esto es para: Identificar qué producto mostrar
  const { id } = useParams();
  
  // Estado del producto - Esto es para: Almacenar los datos del producto cargado
  const [product, setProduct] = useState(null);
  
  // Estado de cantidad - Esto es para: Controlar cuántas unidades agregar al carrito
  // Valor inicial 1, rango 1-stock máximo disponible
  const [quantity, setQuantity] = useState(1);

  // Actualiza el título de la pestaña con el nombre del producto (o fallback mientras carga)
  useDocumentTitle(product ? product.nombre : 'Detalle del Producto');
  
  // Extrae función para agregar productos al carrito del contexto
  const { addToCart } = useCart();
  
  // Extrae función para buscar producto por ID del contexto de productos
  const { getProductById } = useProducts();

  /**
   * useEffect - Carga el producto cuando el ID cambia
   * 
   * Esto es para: Obtener los datos del producto de la base de datos/contexto
   * al montar el componente o cuando cambia el ID de la URL
   * 
   * Esto lo que hace es:
   * 1. Busca el producto usando getProductById(id)
   * 2. Actualiza el estado con los datos del producto
   * 3. Resetea la cantidad a 1 para cada nuevo producto
   * 4. Se ejecuta cada vez que 'id' o 'getProductById' cambian
   */
  useEffect(() => {
    // Busca el producto en el contexto usando su ID de URL
    const foundProduct = getProductById(id);
    // Actualiza el estado del producto
    setProduct(foundProduct);
    // Resetea la cantidad a 1 para el nuevo producto
    setQuantity(1);
  }, [id, getProductById]);

  /**
   * handleQuantityChange - Manejador de cambios en el selector de cantidad
   * 
   * Esto es para: Validar y actualizar la cantidad seleccionada por el usuario
   * 
   * Esto lo que hace es:
   * 1. Convierte el valor ingresado a número entero
   * 2. Si no es número válido o es menor a 1, establece a 1
   * 3. Si excede el stock disponible, limita al máximo en stock
   * 4. Actualiza el estado con el valor validado
   * 
   * @param {Event} event - Evento del input number
   */
  const handleQuantityChange = (event) => {
    // Convierte el valor a número entero (puede fallar)
    let value = Number.parseInt(event.target.value);
    // Validación: Si no es número o es menor a 1, establecer a 1
    if (Number.isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > product.stock) {
      // Limitación: No permitir más que el stock disponible
      value = product.stock;
    }
    // Actualiza el estado con el valor validado
    setQuantity(value);
  };

  /**
   * handleAddToCart - Manejador para agregar producto al carrito
   * 
   * Esto es para: Procesale la acción de "Agregar al carrito"
   * 
   * Esto lo que hace es:
   * 1. Verifica que el producto esté cargado
   * 2. Llama a addToCart() del contexto con ID del producto y cantidad
   * 3. El contexto se encarga de actualizar el carrito (localStorage, estado global)
   */
  const handleAddToCart = () => {
    // Verifica que el producto esté disponible antes de agregarlo
    if (!product) return;
    // Agrega el producto al carrito con la cantidad seleccionada
    addToCart(product.id, quantity);
  };

  // Fallback si el producto no fue encontrado
  // Esto es para: Mostrar un mensaje amigable si el usuario intenta acceder a un producto inexistente
  if (!product) {
    return (
      <Container className="my-5">
        {/* Alerta de error con descripción y botón para volver */}
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que buscas no existe o fue removido.</p>
          <hr />
          {/* Botón para regresar a la página de productos */}
          <Button as={Link} to="/productos" variant="danger">
            Volver a Productos
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* ===== BREADCRUMB DE NAVEGACIÓN ===== */}
      {/* Esto es para: Mostrar la ruta de navegación y permitir ir a páginas anteriores */}
      {/* Esto lo que hace es: Renderiza: Inicio > Productos > Nombre del Producto (activo) */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.nombre}</Breadcrumb.Item>
      </Breadcrumb>
      
      {/* ===== CONTENIDO PRINCIPAL: IMAGEN + DETALLES ===== */}
      <Row>
        {/* COLUMNA IZQUIERDA: IMAGEN DEL PRODUCTO */}
        {/* Esto es para: Mostrar la imagen principal del producto de forma grande */}
        <Col md={6} className="mb-4">
          <Image
            src={product.imagen || "https://via.placeholder.com/600x400?text=Imagen+no+disponible"}
            alt={product.nombre}
            fluid
            rounded
            className="shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain", width: "100%", background: "#fff" }}
          />
        </Col>
        
        {/* COLUMNA DERECHA: DETALLES DEL PRODUCTO */}
        {/* Esto es para: Mostrar toda la información relevante para tomar la decisión de compra */}
        <Col md={6} className="mb-4">
          {/* Badge de categoría - Color verde, texto blanco */}
          <Badge bg="success" className="mb-2">{product.categoria}</Badge>
          
          {/* Nombre del producto - Color marrón oscuro personalizado */}
          <h1 style={{ color: "#8B4513" }}>{product.nombre}</h1>
          
          {/* Origen del producto - Texto muted para información secundaria */}
          <p className="text-muted">Origen: {product.origen}</p>

          {/* ===== SECCIÓN: PRECIO Y ESTADO DE STOCK ===== */}
          {/* Esto es para: Mostrar información de precio y disponibilidad de forma prominente */}
          <div className="d-flex align-items-center mb-3">
            {/* Precio con formato de moneda chilena y color verde esmeralda */}
            <h3 style={{ color: "#2E8B57" }} className="me-3 mb-0">
              ${product.precio.toLocaleString("es-CL")}
              {/* Unidad de medida si existe (ej: kg, unidad, etc.) */}
              {product.unidad && <span className="text-muted fs-5 ms-2" style={{ fontWeight: 400 }}>{product.unidad}</span>}
            </h3>
            {/* Badge de estado de stock con color dinámico según disponibilidad */}
            {/* Verde si hay >10, amarillo si hay 1-10, rojo si sin stock */}
            <Badge bg={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>
              {product.stock > 10 ? "En stock" : product.stock > 0 ? "Últimas unidades" : "Sin Stock"}
            </Badge>
          </div>
          
          {/* Descripción del producto */}
          <p>{product.descripcion}</p>

          {/* ===== SECCIÓN: SELECTOR DE CANTIDAD ===== */}
          {/* Esto es para: Permitir que el usuario seleccione cuántas unidades desea comprar */}
          {/* Solo se muestra si hay stock disponible */}
          {product.stock > 0 ? (
            <Row className="align-items-center mb-4">
              {/* Label para el selector */}
              <Col xs="auto"><Form.Label htmlFor="cantidad" className="mb-0">Cantidad:</Form.Label></Col>
              {/* Input number con validación de rango 1-stock máximo */}
              <Col xs={4} sm={3} md={4} lg={3}>
                <Form.Control 
                  type="number" 
                  id="cantidad" 
                  value={quantity} 
                  min="1" 
                  max={product.stock} 
                  onChange={handleQuantityChange} 
                />
              </Col>
              {/* Información de disponibilidad */}
              <Col xs="auto"><span className="text-muted">(Disponible: {product.stock})</span></Col>
            </Row>
          ) : (
            // Alerta si no hay stock
            <Alert variant="danger" className="mt-3">Agotado</Alert>
          )}

          {/* ===== SECCIÓN: BOTONES DE ACCIÓN ===== */}
          {/* Esto es para: Permitir al usuario agregar el producto al carrito o guardar como favorito */}
          <div className="d-grid gap-2 d-md-flex">
            {/* Botón Agregar al Carrito - Deshabilitado si sin stock */}
            <Button 
              variant="warning" 
              onClick={handleAddToCart} 
              disabled={product.stock <= 0} 
              className="flex-fill"
            >
              <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
            </Button>
            {/* Botón Guardar/Favorito - Placeholder para funcionalidad futura */}
            <Button variant="outline-success" className="flex-fill">
              <i className="bi bi-heart me-2"></i>Guardar
            </Button>
          </div>

          {/* ===== SECCIÓN: INFORMACIÓN DE ENVÍO Y DEVOLUCIÓN ===== */}
          {/* Esto es para: Informar sobre políticas de envío gratuito y devoluciones */}
          {/* Aumenta confianza del usuario mostrando beneficios */}
          <div className="mt-4">
            {/* Información de envío gratis */}
            <div className="d-flex align-items-center text-muted">
              <i className="bi bi-truck me-2"></i>
              <span>Envío gratis en compras sobre $15.000</span>
            </div>
            {/* Información de devolución gratuita */}
            <div className="d-flex align-items-center text-muted mt-1">
              <i className="bi bi-arrow-clockwise me-2"></i>
              <span>Devolución gratuita en 7 días</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;