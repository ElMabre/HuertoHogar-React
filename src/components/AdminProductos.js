import React, { useState } from 'react';
import { Container, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useProducts } from '../context/ProductContext'; // Importar el hook

function AdminProductos() {
  useDocumentTitle('Admin: Productos');
  
  // Usar los productos del contexto en lugar de la lista hardcodeada
  const { products: initialProductsData } = useProducts(); 
  
  const [products, setProducts] = useState(initialProductsData);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new');  // 'new' o 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);  // Producto a editar

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

  // --- Lógica de Eliminación (con Toast) ---
  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto ${id}?`)) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      
      if (window.showToast) {
        window.showToast(`Producto ${id} eliminado`, 'success');
      } else {
        alert(`Producto ${id} eliminado`);
      }
    }
  };


  // --- Lógica para guardar (con Toast y nuevo campo 'unidad') ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedProduct = {
      id: currentProduct ? currentProduct.id : `PROD-${Date.now()}`,
      nombre: formData.get('productName'),
      categoria: formData.get('productCategory'),
      precio: parseFloat(formData.get('productPrice')),
      stock: parseInt(formData.get('productStock')),
      descripcion: formData.get('productDescription'),
      imagen: formData.get('productImage'),
      origen: formData.get('productOrigin'),
      // --- CAMBIO AQUÍ: Añadido el nuevo campo 'unidad' ---
      unidad: formData.get('productUnit'), 
      estado: parseInt(formData.get('productStock')) > 50 ? 'Activo' : 'Bajo Stock',
    };

    if (modalMode === 'new') {
      setProducts(prevProducts => [updatedProduct, ...prevProducts]);
      if (window.showToast) {
        window.showToast('Producto nuevo guardado (simulación)', 'success');
      } else {
        alert('Producto nuevo guardado (simulación)');
      }
    } else {
      setProducts(prevProducts =>
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      if (window.showToast) {
        window.showToast('Producto editado guardado (simulación)', 'success');
      } else {
        alert('Producto editado guardado (simulación)');
      }
    }

    handleCloseModal();
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Productos</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-plus-circle me-1"></i>Nuevo Producto
        </Button>
      </div>

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

      { /* Modal para Agregar/Editar Producto */ }
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'new' ? 'Nuevo Producto' : 'Editar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                // Usamos la descripción larga (si existe)
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

            {/* --- CAMBIO AQUÍ: Añadido campo 'Unidad' y puesto en una Fila con 'Origen' --- */}
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productOrigin">
                  <Form.Label>Origen</Form.Label>
                  <Form.Control
                    type="text"
                    name="productOrigin"
                    defaultValue={currentProduct?.origen || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productUnit">
                  <Form.Label>Unidad de Medida</Form.Label>
                  <Form.Select name="productUnit" defaultValue={currentProduct?.unidad} required>
                    <option value="">Seleccionar unidad</option>
                    <option value="por kilo">Kilo</option>
                    <option value="por bolsa de 500g">Bolsa de 500g</option>
                    <option value="por frasco de 500g">Frasco de 500g</option>
                    <option value="por bolsa de 1kg">Bolsa de 1kg</option>
                    <option value="por litro">Litro</option>
                    <option value="por unidad">Unidad</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
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