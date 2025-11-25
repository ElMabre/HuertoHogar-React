import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

// Crear el contexto de autenticación
export const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Esto lo que hace es: Permite que los componentes accedan fácilmente al contexto sin usar useContext directamente
 * Esto es para: Simplificar el acceso a datos de autenticación desde cualquier componente
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * AuthProvider Component
 * Esto lo que hace es: Proporciona el contexto de autenticación a toda la aplicación
 * Esto es para: Gestionar el estado global de autenticación (usuario logueado, carga, login, logout, registro)
 */
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario actualmente logueado
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para controlar si la app está cargando datos de autenticación
  const [loading, setLoading] = useState(true);

  /**
   * Efecto: Verificar autenticación persistida en localStorage al cargar la app
   * Esto lo que hace es: Al iniciar la aplicación, busca si hay datos de usuario guardados en localStorage
   * Esto es para: Restaurar la sesión del usuario si ya estaba logueado anteriormente
   */
  useEffect(() => {
    try {
      const storedAuthData = localStorage.getItem('currentUser');
      if (storedAuthData) {
        const authData = JSON.parse(storedAuthData);
        // Validamos que tenga un token y un usuario
        if (authData.token && authData.usuario) {
          setCurrentUser(authData.usuario);
        } else {
          localStorage.removeItem('currentUser');
        }
      }
    } catch (e) {
      console.error("Error al leer 'currentUser' de localStorage", e);
      localStorage.removeItem('currentUser');
    }
    // Indicar que ya terminó la carga inicial
    setLoading(false);
  }, []);

  /**
   * Función: Login del usuario
   * Esto lo que hace es: Envía credenciales al backend y guarda el token/usuario si es válido
   * Esto es para: Permitir que los usuarios inicien sesión en la aplicación
   */
  const login = async (email, pass) => {
    try {
      // Llamar al endpoint de login del backend (sin autenticación requerida)
      const authResponse = await apiService.post('/auth/login', {
        email: email,
        password: pass
      }, false); // false = ruta pública sin token

      if (authResponse.token && authResponse.usuario) {
        // Guardar la respuesta completa (token + usuario) en localStorage para sesión persistente
        localStorage.setItem('currentUser', JSON.stringify(authResponse));
        // Actualizar el estado global con los datos del usuario
        setCurrentUser(authResponse.usuario);
        return authResponse.usuario;
      }
      return null;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(error.message || 'Correo o contraseña incorrectos.');
    }
  };

  /**
   * Función: Logout del usuario
   * Esto lo que hace es: Limpia los datos de sesión del usuario
   * Esto es para: Permitir que el usuario cierre sesión y borre sus datos guardados
   */
  const logout = () => {
    // Remover datos de autenticación de localStorage
    localStorage.removeItem('currentUser');
    // Limpiar el estado del usuario actual
    setCurrentUser(null);
  };

  /**
   * Función: Registrar nuevo usuario
   * Esto lo que hace es: Envía datos del nuevo usuario al backend y realiza login automático
   * Esto es para: Permitir que nuevos usuarios se registren y accedan automáticamente después
   */
  const register = async (userData) => {
    try {
      // Llamar al endpoint de registro del backend (sin autenticación requerida)
      const authResponse = await apiService.post('/auth/register', userData, false);
      
      if (authResponse.token && authResponse.usuario) {
        // Guardar la respuesta completa en localStorage (Login automático post-registro)
        localStorage.setItem('currentUser', JSON.stringify(authResponse));
        // Actualizar el estado con los datos del usuario registrado
        setCurrentUser(authResponse.usuario);
        return authResponse.usuario;
      }
      throw new Error("Respuesta inválida del servidor durante el registro.");
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error;
    }
  };

  // Objeto con todos los valores y funciones que proporciona el contexto
  const value = {
    currentUser,    // Usuario logueado actualmente
    loading,        // Indica si la app está cargando datos iniciales
    login,          // Función para iniciar sesión
    logout,         // Función para cerrar sesión
    register        // Función para registrarse
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Solo renderizar los hijos cuando termina la carga inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};