import React, { useState } from 'react';
import { Container, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
// --- Datos de productos (migrado de admin.js loadProducts) ---
// Para la Evaluación 3, esto vendrá de una API.
const initialProductsData = [
  {
    id: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'frutas',
    precio: 1200,
    stock: 150,
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/manzana.jpg',
    estado: 'Activo',
    descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.',
    origen: 'Valle del Maule'
  },
  {
    id: 'FR002',
    nombre: 'Naranjas Valencia',
    categoria: 'frutas',
    precio: 1000,
    stock: 200,
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/naranja.jpg',
    estado: 'Activo',
    descripcion: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes.',
    origen: 'Región de Valparaíso'
  },
  {
    id: 'VR001',
    nombre: 'Zanahorias Orgánicas',
    categoria: 'verduras',
    precio: 900,
    stock: 100,
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/zanahoria.jpg',
    estado: 'Activo',
    descripcion: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra.',
    origen: 'Región de O\'Higgins'
  },
  {
    id: 'PO001',
    nombre: 'Miel Orgánica',
    categoria: 'organicos',
    precio: 5000,
    stock: 50,
    imagen: 'https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/miel.jpg',
    estado: 'Bajo Stock',
    descripcion: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes.',
    origen: 'Región del Maule'
  }
];
// --- Fin de datos ---

function AdminProductos() {
    useDocumentTitle('Admin: Productos');
  const [products, setProducts] = useState(initialProductsData);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new'); // 'new' o 'edit'
  const [currentProduct, setCurrentProduct] = useState(null); // Producto a editar

  // --- Lógica de Modal ---
  const handleShowModal = (mode, product = null) => {
    setModalMode(mode);
    setCurrentProduct(product);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  // --- Lógica de Eliminación ---
  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto ${id}?`)) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      // Aquí iría la llamada a la API en la Evaluación 3
      alert(`Producto ${id} eliminado`);
    }
  };
  
  // Lógica para guardar (simulada por ahora)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el producto (nuevo o editado)
    // Para la Evaluación 3, esto llamará a la API.
    
    // Simulación: Obtener datos del formulario
    const formData = new FormData(e.target);
    const updatedProduct = {
      id: currentProduct ? currentProduct.id : `PROD-${Date.now()}`, // Genera un ID si es nuevo
      nombre: formData.get('productName'),
      categoria: formData.get('productCategory'),
      precio: parseFloat(formData.get('productPrice')),
      stock: parseInt(formData.get('productStock')),
      descripcion: formData.get('productDescription'),
      imagen: formData.get('productImage'),
      origen: formData.get('productOrigin'),
      estado: parseInt(formData.get('productStock')) > 50 ? 'Activo' : 'Bajo Stock',
    };

    if (modalMode === 'new') {
      setProducts(prevProducts => [updatedProduct, ...prevProducts]);
      alert('Producto nuevo guardado (simulación)');
    } else {
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      alert('Producto editado guardado (simulación)');
    }
    
    handleCloseModal();
  };

  return (
    <Container fluid>
      {/* Encabezado y botón "Nuevo Producto" */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Productos</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-plus-circle me-1"></i>Nuevo Producto
        </Button>
      </div>

      {/* Tabla de Productos */}
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaProductos">
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img 
                    src={product.imagen || 'https://via.placeholder.com/40x40?text=N/A'} 
                    alt={product.nombre} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                    className="rounded" 
                  />
                </td>
                <td>{product.nombre}</td>
                <td><Badge bg="secondary">{product.categoria}</Badge></td>
                <td>${product.precio.toLocaleString('es-CL')}</td>
                <td>{product.stock}</td>
                <td>
                  <Badge bg={product.estado === 'Activo' ? 'success' : 'warning'}>
                    {product.estado}
                  </Badge>
                </td>
                <td>
                  {/* --- BOTONES CORREGIDOS --- */}
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-1"
                    onClick={() => handleShowModal('edit', product)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para Agregar/Editar Producto */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'new' ? 'Nuevo Producto' : 'Editar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* He añadido 'name' a cada input. Esto es crucial para que
            'new FormData(e.target)' pueda recolectar los datos en handleSaveProduct.
          */}
          <Form id="formProducto" onSubmit={handleSaveProduct}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productName">
                  <Form.Label>Nombre del Producto</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="productName"
                    defaultValue={currentProduct?.nombre} 
                    required 
                    maxLength={100} 
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productCategory">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select name="productCategory" defaultValue={currentProduct?.categoria} required>
                    <option value="">Seleccionar categoría</option>
                    <option value="frutas">Frutas Frescas</option>
                    <option value="verduras">Verduras Orgánicas</option>
                    <option value="organicos">Productos Orgánicos</option>
                    <option value="lacteos">Productos Lácteos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productPrice">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="productPrice"
                    defaultValue={currentProduct?.precio} 
                    min="0" 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productStock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="productStock"
                    defaultValue={currentProduct?.stock} 
                    min="0" 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                name="productDescription"
                rows={3} 
                maxLength={500} 
                defaultValue={currentProduct?.descripcion || ''} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control 
                type="url" 
                name="productImage"
                defaultValue={currentProduct?.imagen} 
                placeholder="https://ejemplo.com/imagen.jpg" 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productOrigin">
              <Form.Label>Origen</Form.Label>
              <Form.Control 
                type="text" 
                name="productOrigin"
                defaultValue={currentProduct?.origen || ''} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" form="formProducto">
            Guardar Producto
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default AdminProductos;