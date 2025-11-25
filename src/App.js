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

// COMPONENTE DE PROTECCIÓN DE RUTAS (Guardia)
// Envuelve cualquier ruta que requiera ser administrador.
// Si el usuario no está logueado o no es ADMIN, lo patea al login.
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

  // SISTEMA DE NOTIFICACIONES GLOBAL
  // Hack útil: Asignamos la función al objeto 'window' para poder llamarla desde
  // archivos que NO son componentes de React (como el apiService.js o los Contextos).
  // Uso: window.showToast('Error de conexión', 'danger');
  window.showToast = (message, type = 'info') => {
    setToasts((currentToasts) => {
      // Prevención de Spam: Si el último mensaje es igual al nuevo, no lo duplicamos.
      if (currentToasts.length > 0) {
        const lastToast = currentToasts[currentToasts.length - 1];
        if (lastToast.message === message) {
          return currentToasts;
        }
      }
      const newToast = { 
        id: Date.now() + Math.random(), 
        message, 
        type 
      };
      
      // Limitamos la pila a máximo 3 notificaciones simultáneas en pantalla.
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
      {/* LAYOUT PRINCIPAL: "Sticky Footer" */}
      {/* Usamos flex-column y minHeight: 100vh para asegurar que el Footer siempre
          se quede abajo, incluso si la página tiene poco contenido. */}
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        
        <Navigation />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Rutas Dinámicas (usan parámetros :id) */}
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/carrito" element={<CartPage />} />
            
            {/* Rutas de Autenticación */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistrationPage />} />
            
            {/* RUTAS DE ADMINISTRACIÓN (Anidadas y Protegidas) */}
            {/* <AdminPage> contiene el Sidebar y un <Outlet> donde se renderizan los hijos. */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            >
              {/* Redirección automática: Si entran a /admin, van directo a dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
              
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="configuracion" element={<AdminConfig />} />
            </Route>
            
            {/* Ruta Wildcard: Captura cualquier URL no definida arriba (Error 404) */}
            <Route path="*" element={<Container className="my-5"><h1>404 - Página no encontrada</h1></Container>} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* Contenedor de Alertas Flotantes */}
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 9999, position: 'fixed' }} // Z-index alto para flotar sobre todo
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