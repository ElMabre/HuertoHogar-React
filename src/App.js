import React from 'react';
// 1. Importar Navigate para redirección
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 
import { useAuth } from './context/AuthContext'; // 3. Importar useAuth
// --- Componentes ---
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage'; 
import ProductDetail from './components/ProductDetail';
import HomePage from './components/HomePage';
import NosotrosPage from './components/NosotrosPage';
import BlogPage from './components/BlogPage';
import ContactoPage from './components/ContactoPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegisterPage'; 
import AdminPage from './components/AdminPage'; // 2. Importar AdminPage

// --- Sub-componentes del Admin (Placeholders por ahora) ---
const AdminDashboard = () => <h2>Dashboard (Admin)</h2>;
const AdminProductos = () => <h2>Gestión de Productos (Admin)</h2>;
const AdminUsuarios = () => <h2>Gestión de Usuarios (Admin)</h2>;
const AdminPedidos = () => <h2>Gestión de Pedidos (Admin)</h2>;
const AdminConfig = () => <h2>Configuración (Admin)</h2>;
// --------------------------------------------------------



// 4. Componente para proteger rutas de Admin
function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  // Si no hay usuario O el usuario no es admin -> redirige a Login
  if (!currentUser || currentUser.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Si es admin, muestra el contenido (children)
  return children;
}


function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navigation />
        <main style={{ flex: 1 }}> {/* Quitamos py-3 para que AdminPage controle su padding */}
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistrationPage />} />
            
            {/* 5. Rutas de Administración (Protegidas) */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute> {/* Envuelve AdminPage con el protector */}
                  <AdminPage />
                </AdminRoute>
              }
            >
              {/* 6. Sub-rutas que se renderizarán en el <Outlet> de AdminPage */}
              {/* Redirige /admin a /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} /> 
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="configuracion" element={<AdminConfig />} />
            </Route>

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;