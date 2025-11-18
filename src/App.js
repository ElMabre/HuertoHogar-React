import React, { useState } from 'react'; // <-- 1. IMPORTAR useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { Container, ToastContainer, Toast } from 'react-bootstrap';

// --- COMPONENTES ---
// Optamos por importar desde 'pages/' para mantener una estructura clara:
// componentes reutilizables en 'components/' y páginas completas en 'pages/'
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


// Componente para proteger rutas de Admin
// Nosotros diseñamos este componente para validar que solo usuarios con rol 'admin'
// puedan acceder a las rutas administrativas
function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();
  // Mientras se verifica la autenticación, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;   // O un spinner
  }
  // Si no hay usuario logueado o su rol no es 'admin', redirigimos a login
  if (!currentUser || currentUser.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  // Si es admin, renderizamos el contenido protegido
  return children;
}

function App() {
  // Nuestro equipo decidió usar un estado global para manejar notificaciones (toasts)
  // en lugar de pasar props por todas las capas. Esto nos permite mostrar mensajes
  // desde cualquier componente sin necesidad de prop drilling
  const [toasts, setToasts] = useState([]); // Almacena notificaciones activas

  // Función global showToast que podemos llamar desde cualquier componente
  // para mostrar notificaciones sin necesidad de pasar callbacks
  window.showToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = {
      id: id,
      message: message,
      type: type, // 'success', 'danger', 'warning', 'info'
    };
    // Añadimos el nuevo toast a la lista usando functional update
    // para garantizar que siempre trabajamos con el estado más reciente
    setToasts((currentToasts) => [...currentToasts, newToast]);
  };

  // Función auxiliar para eliminar un toast cuando el usuario lo cierre o expire
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
            {  /* Rutas Públicas */ }
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
            {  /* Rutas de Administración (Protegidas) */ }
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            >
              {  /* Sub-rutas */ }
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="configuracion" element={<AdminConfig />} />
            </Route>
            {  /* Ruta para páginas no encontradas */ }
            <Route path="*" element={<Container className="my-5"><h1>404 - Página no encontrada</h1></Container>} />
          </Routes>
        </main>
        <Footer />

        {/* 5. RENDERIZAR EL CONTENEDOR DE TOASTS */}
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 9999 }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              bg={toast.type} // 'success', 'danger', etc.
              onClose={() => removeToast(toast.id)}
              delay={3000} // Cierra después de 3 segundos
              autohide
            >
              <Toast.Body className={toast.type === 'warning' || toast.type === 'info' ? 'text-dark' : 'text-white'}>
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