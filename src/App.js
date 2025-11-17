import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { Container } from 'react-bootstrap';
// --- Componentes ---
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage';
import ProductDetail from './components/ProductDetail';
import HomePage from './components/HomePage';
import NosotrosPage from './components/NosotrosPage';
import BlogPage from './components/BlogPage';
import BlogDetail from './components/BlogDetail';
import ContactoPage from './components/ContactoPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';
// --- Sub-componentes del Admin (Importando el real) ---
import AdminDashboard from './components/AdminDashboard';
import AdminProductos from './components/AdminProductos';
import AdminUsuarios from './components/AdminUsuarios';
import AdminPedidos from './components/AdminPedidos';
import AdminConfig from './components/AdminConfig'; // <-- 1. IMPORTAR EL NUEVO COMPONENTE

// const AdminConfig = () => <h2>Configuración (Admin)</h2>; // <-- 2. ELIMINAR PLACEHOLDER
// --------------------------------------------------------

// Componente para proteger rutas de Admin
function AdminRoute({  children  }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div>Cargando...</div>;  // O un spinner
  }
  // Si no hay usuario O el usuario no es admin -> redirige a Login
  if (!currentUser || currentUser.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  // Si es admin, muestra el contenido (children)
  return  children ;
}
function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          <Routes>
            { /* Rutas Públicas */ }
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistrationPage />} />

            { /* Rutas de Administración (Protegidas) */ }
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            >
              { /* Sub-rutas */ }
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} /> 
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              {/* 3. ESTA RUTA AHORA RENDERIZA EL COMPONENTE REAL */}
              <Route path="configuracion" element={<AdminConfig />} />
            </Route>
            { /* Ruta para páginas no encontradas */ }
            <Route path="*" element={<Container className="my-5"><h1>404 - Página no encontrada</h1></Container>} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;