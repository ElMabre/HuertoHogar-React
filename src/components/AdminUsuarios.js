import React, { useState } from 'react';
import { Container, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import useDocumentTitle from '../hooks/useDocumentTitle';

// --- Datos de usuarios (migrado de admin.js loadUsers) ---
// Para la Evaluación 3, esto vendrá de una API.
const initialUsersData = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@duoc.cl',
    rol: 'Administrador',
    estado: 'Activo',
    registro: '2024-01-15'
  }, // [cite: 3779-3786]
  {
    id: 2,
    nombre: 'María González',
    email: 'maria@gmail.com',
    rol: 'Vendedor',
    estado: 'Activo',
    registro: '2024-02-10'
  }, // [cite: 3787-3794]
  {
    id: 3,
    nombre: 'Pedro Martínez',
    email: 'pedro@duoc.cl',
    rol: 'Cliente',
    estado: 'Activo',
    registro: '2024-03-05'
  }, // [cite: 3795-3802]
  {
    id: 4,
    nombre: 'Ana López',
    email: 'ana@profesor.duoc.cl',
    rol: 'Cliente',
    estado: 'Inactivo',
    registro: '2024-01-20'
  } // [cite: 3804-3811]
];
// --- Fin de datos ---

function AdminUsuarios() {
  useDocumentTitle('Admin: Usuarios');
  const [users, setUsers] = useState(initialUsersData);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new');  // 'new' o 'edit'
  const [currentUser, setCurrentUser] = useState(null);  // Usuario a editar

  // --- Lógica de Modal ---
  const handleShowModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  // --- INICIO DE LA MODIFICACIÓN 1 ---
  // --- Lógica de Eliminación (migrado de admin.js eliminarUsuario) ---
  const handleDelete = (id) => {
    // Replicando la confirmación del admin.js [cite: 3831-3832]
    if (window.confirm(`¿Estás seguro de que quieres eliminar el usuario ${id}?`)) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
      
      // Reemplazamos el 'alert' por 'window.showToast'
      if (window.showToast) {
        window.showToast(`Usuario ${id} eliminado`, 'success');
      } else {
        alert(`Usuario ${id} eliminado`);
      }
    }
  };
  // --- FIN DE LA MODIFICACIÓN 1 ---


  // --- INICIO DE LA MODIFICACIÓN 2 ---
  // Lógica para guardar (simulada por ahora)
  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = {
      id: currentUser ? currentUser.id : Date.now(),  // ID simple si es nuevo
      nombre: `${formData.get('userName')} ${formData.get('userLastName')}`,
      email: formData.get('userEmail'),
      rol: formData.get('userRole'),
      estado: 'Activo',  // Por defecto
      registro: currentUser ? currentUser.registro : new Date().toISOString().split('T')[0]
    };

    if (modalMode === 'new') {
      setUsers(prevUsers => [updatedUser, ...prevUsers]);
      // Reemplazamos el 'alert' por 'window.showToast'
      if (window.showToast) {
        window.showToast('Usuario nuevo guardado (simulación)', 'success');
      } else {
        alert('Usuario nuevo guardado (simulación)');
      }
    } else {
      setUsers(prevUsers =>
        prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      // Reemplazamos el 'alert' por 'window.showToast'
      if (window.showToast) {
        window.showToast('Usuario editado guardado (simulación)', 'success');
      } else {
        alert('Usuario editado guardado (simulación)');
      }
    }

    handleCloseModal();
  };
  // --- FIN DE LA MODIFICACIÓN 2 ---

  // Función segura para obtener el primer nombre
  const getFirstName = (name) => {
    if (!name) return '';
    return name.split(' ')[0];
  };
  // Función segura para obtener el apellido (o apellidos)
  const getLastName = (name) => {
    if (!name) return '';
    return name.split(' ').slice(1).join(' ');
  };

  return (
    <Container fluid>
      { /* Encabezado y botón "Nuevo Usuario" [cite: 3874, 4034-4035] */ }
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Usuarios</h1>
        <Button variant="success" onClick={() => handleShowModal('new')}>
          <i className="bi bi-person-plus me-1"></i>Nuevo Usuario
        </Button>
      </div>

      { /* Tabla de Usuarios [cite: 3881, 4036-4040] */ }
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaUsuarios">
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td><Badge bg="info">{user.rol}</Badge></td>
                <td>
                  <Badge bg={user.estado === 'Activo' ? 'success' : 'secondary'}>
                    {user.estado}
                  </Badge>
                </td>
                <td>{user.registro}</td>
                <td>
                  { /* --- BOTONES CORREGIDOS --- */ }
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
            ))}
          </tbody>
        </Table>
      </div>

      { /* Modal para Agregar/Editar Usuario [cite: 3931, 4087-4098] */ }
      <Modal show={showModal} onHide={handleCloseModal}>
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
                  <Form.Control
                    type="text"
                    name="userName"
                    defaultValue={getFirstName(currentUser?.nombre)}
                    required
                    maxLength={50}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="userLastName">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="userLastName"
                    defaultValue={getLastName(currentUser?.nombre)}
                    required
                    maxLength={50}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="userEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="userEmail"
                defaultValue={currentUser?.email}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="userPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="userPassword"
                placeholder={modalMode === 'edit' ? '(Dejar en blanco para no cambiar)' : ''}
                required={modalMode === 'new'}
                minLength={4}
                maxLength={10}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="userRole">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="userRole" defaultValue={currentUser?.rol} required>
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" form="formUsuario">
            Guardar Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminUsuarios;