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

  const handleShowModal = (mode, product = null) => {
    setModalMode(mode);
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
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
        if (window.showToast) window.showToast('Producto creado', 'success');
      } else {
        await apiService.put(`/admin/productos/${currentProduct.id}`, productData);
        if (window.showToast) window.showToast('Producto actualizado', 'success');
      }
      await refreshProducts();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      if (window.showToast) window.showToast('Error: ' + error.message, 'danger');
    }
  };

  return (
    <Container fluid>
      <style type="text/css">
        {`
          .custom-admin-modal .modal-content {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #dee2e6 !important;
          }
          .custom-admin-modal .modal-title,
          .custom-admin-modal label, 
          .custom-admin-modal .form-label {
            color: #000000 !important;
            font-weight: 700 !important;
            text-shadow: none !important;
          }
          .custom-admin-modal .form-control, 
          .custom-admin-modal .form-select {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ced4da !important;
            -webkit-text-fill-color: #000000 !important;
          }
          .custom-admin-modal .form-control::placeholder {
            color: #6c757d !important;
            opacity: 1 !important;
          }
          .custom-admin-modal .form-control:focus,
          .custom-admin-modal .form-select:focus {
             background-color: #ffffff !important;
             color: #000000 !important;
             box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          }
        `}
      </style>

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Productos</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-plus-circle me-1"></i> Nuevo Producto
        </Button>
      </div>

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
                  <img src={product.imagen || 'https://via.placeholder.com/40'} alt={product.nombre} 
                       style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded" />
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static" className="custom-admin-modal">
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
                  <Form.Control type="text" name="productName" defaultValue={currentProduct?.nombre} required />
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
                  <Form.Control type="number" name="productPrice" defaultValue={currentProduct?.precio} min="0" required />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productStock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" name="productStock" defaultValue={currentProduct?.stock} min="0" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" name="productDescription" rows={3} defaultValue={currentProduct?.descripcion || ''} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control type="url" name="productImage" defaultValue={currentProduct?.imagen} placeholder="https://..." />
            </Form.Group>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="productOrigin">
                  <Form.Label>Origen</Form.Label>
                  <Form.Control type="text" name="productOrigin" defaultValue={currentProduct?.origen || ''} />
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
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="success" type="submit" form="formProducto">Guardar Producto</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminProductos;