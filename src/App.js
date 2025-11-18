import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { Container, ToastContainer, Toast } from 'react-bootstrap';
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import ContactoPage from './pages/ContactoPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './components/AdminDashboard';
import AdminProductos from './components/AdminProductos';
import AdminUsuarios from './components/AdminUsuarios';
import AdminPedidos from './components/AdminPedidos';
import AdminConfig from './components/AdminConfig';

function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!currentUser || currentUser.rol !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [toasts, setToasts] = useState([]);

  window.showToast = (message, type = 'info') => {
    setToasts((currentToasts) => {
      // 1. Evitar duplicados exactos consecutivos
      if (currentToasts.length > 0) {
        const lastToast = currentToasts[currentToasts.length - 1];
        if (lastToast.message === message) {
          return currentToasts;
        }
      }

      // 2. Crear nueva notificación con ID único
      const newToast = { 
        id: Date.now() + Math.random(), 
        message, 
        type 
      };

      // 3. Limitar a máximo 3 notificaciones visibles
      const updatedToasts = [...currentToasts, newToast];
      if (updatedToasts.length > 3) {
        return updatedToasts.slice(updatedToasts.length - 3);
      }
      
      return updatedToasts;
    });
  };

  const removeToast = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Rutas Públicas */}
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

            {/* Rutas de Administración */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="configuracion" element={<AdminConfig />} />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<Container className="my-5"><h1>404 - Página no encontrada</h1></Container>} />
          </Routes>
        </main>
        <Footer />

        {/* Contenedor de Notificaciones */}
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 9999, position: 'fixed' }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              bg={toast.type}
              onClose={() => removeToast(toast.id)}
              delay={3000}
              autohide
            >
              <Toast.Body className={
                toast.type === 'warning' || toast.type === 'info' || toast.type === 'light' 
                ? 'text-dark' 
                : 'text-white'
              }>
                {toast.message}
              </Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
      </div>
    </Router>
  );
}

export default App;