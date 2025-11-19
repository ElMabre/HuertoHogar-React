import React, { useState } from 'react';
import { Container, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useProducts } from '../context/ProductContext';
import { apiService } from '../services/apiService';

function AdminProductos() {
  useDocumentTitle('Admin: Productos');
  const { products, refreshProducts } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false); 

  const handleShowModal = (mode, product = null) => {
    setModalMode(mode);
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setIsSaving(false); 
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${id}?`)) {
      try {
        await apiService.delete(`/admin/productos/${id}`);
        await refreshProducts();
        if (window.showToast) window.showToast(`Producto eliminado`, 'success');
      } catch (error) {
        console.error(error);
        if (window.showToast) window.showToast('Error al eliminar', 'danger');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    const formData = new FormData(e.target);
    const productData = {
      id: currentProduct ? currentProduct.id : null,
      sku: currentProduct ? currentProduct.sku : `SKU-${Date.now()}`,
      nombre: formData.get('productName'),
      categoria: formData.get('productCategory'),
      precio: parseFloat(formData.get('productPrice')),
      stock: parseInt(formData.get('productStock')),
      descripcion: formData.get('productDescription'),
      imagen: formData.get('productImage'),
      origen: formData.get('productOrigin'),
      unidad: formData.get('productUnit')
    };

    try {
      if (modalMode === 'new') {
        await apiService.post('/admin/productos', productData, true);
        if (window.showToast) window.showToast('Producto creado exitosamente', 'success');
      } else {
        await apiService.put(`/admin/productos/${currentProduct.id}`, productData);
        if (window.showToast) window.showToast('Producto actualizado correctamente', 'success');
      }
      
      await refreshProducts();
      handleCloseModal();
      
    } catch (error) {
      console.error(error);
      if (window.showToast) window.showToast('Error al guardar: ' + error.message, 'danger');
      setIsSaving(false);
    }
  };

  return (
    <Container fluid>
      {/* Título y Botón Agregar */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Productos</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-plus-circle me-1"></i> Nuevo Producto
        </Button>
      </div>

      {/* Tabla de Productos */}
      <div className="table-responsive">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img 
                    src={product.imagen || 'https://via.placeholder.com/40'} 
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
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleShowModal('edit', product)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de Edición/Creación */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
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
                  <Form.Control type="text" name="productName" defaultValue={currentProduct?.nombre} required placeholder="Ej: Manzanas Fuji" />
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
                  <Form.Control type="number" name="productPrice" defaultValue={currentProduct?.precio} min="0" required placeholder="Ej: 1500" />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productStock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" name="productStock" defaultValue={currentProduct?.stock} min="0" required placeholder="Ej: 50" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" name="productDescription" rows={3} defaultValue={currentProduct?.descripcion || ''} placeholder="Breve descripción..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control type="url" name="productImage" defaultValue={currentProduct?.imagen} placeholder="https://..." />
            </Form.Group>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productOrigin">
                  <Form.Label>Origen</Form.Label>
                  <Form.Control type="text" name="productOrigin" defaultValue={currentProduct?.origen || ''} placeholder="Ej: Curacaví" />
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
          <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
            Cancelar
          </Button>
          

          <Button variant="success" type="submit" form="formProducto" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar Producto'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminProductos;