import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiService } from '../services/apiService';

function AdminUsuarios() {
  useDocumentTitle('Admin: Usuarios');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new');
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/admin/usuarios', true);
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      if (window.showToast) window.showToast('Error al cargar usuarios: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleShowModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ID: ${id}?`)) {
      try {
        await apiService.delete(`/admin/usuarios/${id}`);
        if (window.showToast) window.showToast(`Usuario eliminado correctamente`, 'success');
        fetchUsers();
      } catch (error) {
        console.error(error);
        if (window.showToast) window.showToast('Error al eliminar: ' + error.message, 'danger');
      }
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const userData = {
      nombre: formData.get('userName'),
      apellido: formData.get('userLastName'),
      email: formData.get('userEmail'),
      rol: formData.get('userRole'),
      run: formData.get('userRun') || 'Sin-RUN', 
      region: 'Metropolitana', // Valores por defecto si no se piden en el form
      comuna: 'Santiago',
      direccion: 'Dirección desconocida',
      password: formData.get('userPassword')
    };

    try {
      if (modalMode === 'new') {
        if (!userData.password) {
            if (window.showToast) window.showToast('La contraseña es obligatoria para nuevos usuarios', 'warning');
            return;
        }
        await apiService.post('/admin/usuarios', userData, true);
        if (window.showToast) window.showToast('Usuario creado correctamente', 'success');
      } else {
        // Actualizar usuario existente
        if (!userData.password) delete userData.password; // No enviar password si está vacío
        
        await apiService.put(`/admin/usuarios/${currentUser.id}`, userData);
        if (window.showToast) window.showToast('Usuario actualizado correctamente', 'success');
      }
      
      fetchUsers();
      handleCloseModal();

    } catch (error) {
      console.error(error);
      if (window.showToast) window.showToast('Error al guardar: ' + error.message, 'danger');
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
        <h1 className="h2">Gestión de Usuarios</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-person-plus me-1"></i>Nuevo Usuario
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center">Cargando usuarios...</td></tr>
            ) : users.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No hay usuarios registrados.</td></tr>
            ) : (
                users.map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre} {user.apellido}</td>
                    <td>{user.email}</td>
                    <td>
                        <Badge bg={user.rol === 'ADMIN' ? 'danger' : user.rol === 'VENDEDOR' ? 'warning' : 'info'}>
                            {user.rol}
                        </Badge>
                    </td>
                    <td>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleShowModal('edit', user)}
                    >
                        <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="custom-admin-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'new' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="formUsuario" onSubmit={handleSaveUser}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="userName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="userName" defaultValue={currentUser?.nombre} required maxLength={50} />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="userLastName">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" name="userLastName" defaultValue={currentUser?.apellido} required maxLength={50} />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="userRun">
                <Form.Label>RUN</Form.Label>
                <Form.Control type="text" name="userRun" defaultValue={currentUser?.run} placeholder="12345678-9" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="userEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="userEmail" defaultValue={currentUser?.email} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="userPassword">
              <Form.Label>Contraseña {modalMode === 'edit' && '(Dejar en blanco para mantener)'}</Form.Label>
              <Form.Control 
                type="password" 
                name="userPassword" 
                placeholder={modalMode === 'edit' ? 'Nueva contraseña (opcional)' : 'Contraseña segura'}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="userRole">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="userRole" defaultValue={currentUser?.rol || 'CLIENTE'} required>
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="CLIENTE">Cliente</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" form="formUsuario">
            {modalMode === 'new' ? 'Crear Usuario' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminUsuarios;