import React from 'react';
import { Container } from 'react-bootstrap';

// Cambiamos el nombre para evitar conflicto con la palabra reservada 'Register'
function RegistrationPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center section-title mb-4">Crear Cuenta</h1>
      <p>Aquí irá el formulario de registro.</p>
    </Container>
  );
}

export default RegistrationPage;