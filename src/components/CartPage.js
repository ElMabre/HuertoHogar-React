import React from 'react';
import { Container } from 'react-bootstrap';

function CartPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center section-title mb-4">Tu Carrito de Compras</h1>
      <p>Aquí se mostrará el contenido del carrito y el resumen de compra.</p>
    </Container>
  );
}

export default CartPage;