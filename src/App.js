import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'; // Para centrar el contenido principal

import Navigation from './components/Navbar'; 
import Footer from './components/Footer';

// --- Placeholder Components (Crearemos estos archivos después) ---
// Simulan las páginas principales por ahora
const HomePage = () => <Container className="my-5"><h1 className="text-center">Página de Inicio</h1><p className="text-center">Contenido principal irá aquí.</p></Container>;
const NosotrosPage = () => <Container className="my-5"><h1 className="text-center">Página Nosotros</h1><p className="text-center">Información sobre la empresa irá aquí.</p></Container>;
const BlogPage = () => <Container className="my-5"><h1 className="text-center">Página del Blog</h1><p className="text-center">Listado de artículos irá aquí.</p></Container>;
const ContactoPage = () => <Container className="my-5"><h1 className="text-center">Página de Contacto</h1><p className="text-center">Formulario de contacto irá aquí.</p></Container>;
const CartPage = () => <Container className="my-5"><h1 className="text-center">Página del Carrito</h1><p className="text-center">Contenido del carrito irá aquí.</p></Container>;
const LoginPage = () => <Container className="my-5"><h1 className="text-center">Página de Login</h1><p className="text-center">Formulario de login irá aquí.</p></Container>;
const RegisterPage = () => <Container className="my-5"><h1 className="text-center">Página de Registro</h1><p className="text-center">Formulario de registro irá aquí.</p></Container>;
// -----------------------------------------------------------------

function App() {
  return (
    <Router> {/* Envuelve toda la app en el Router */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation /> {/* Muestra la barra de navegación en todas las páginas */}

        {/* Área principal donde el contenido cambia según la ruta */}
        <main style={{ flex: 1 }} className="py-3"> {/* Asegura que el main ocupe el espacio disponible */}
          <Routes> {/* Define las rutas disponibles */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductList />} /> 
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            {/* Agrega más rutas aquí (ej: detalle de producto) */}
          </Routes>
        </main>

        <Footer /> {/* Muestra el pie de página en todas las páginas */}
      </div>
    </Router>
  );
}

export default App;
