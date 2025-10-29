import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'; // Para centrar el contenido principal

// --- Importa los componentes principales ---
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

// --- Importa los componentes de página ---
import HomePage from './components/HomePage';
import NosotrosPage from './components/NosotrosPage';
import BlogPage from './components/BlogPage';
import ContactoPage from './components/ContactoPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegisterPage'; // Ojo con el nombre cambiado
// ------------------------------------------

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
            <Route path="/producto/:id" element={<ProductDetail />} /> {/* Ruta para detalle */}
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistrationPage />} /> {/* Usa el componente importado */}
            {/* Puedes agregar más rutas aquí si es necesario */}
          </Routes>
        </main>

        <Footer /> {/* Muestra el pie de página en todas las páginas */}
      </div>
    </Router>
  );
}

export default App;