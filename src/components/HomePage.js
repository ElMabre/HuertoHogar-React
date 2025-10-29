import React from 'react';
import { Container } from 'react-bootstrap';

function HomePage() {
  return (
    <Container className="my-5 text-center">
      <h1>¡Bienvenido a HuertoHogar!</h1>
      <p className="lead">Productos frescos y naturales directo del campo a tu hogar.</p>
      {/* Aquí podríamos añadir productos destacados o un hero image después */}
    </Container>
  );
}

export default HomePage;