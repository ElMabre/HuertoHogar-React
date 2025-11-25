import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario logueado en localStorage al cargar la app
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
    setLoading(false);
  }, []);

  // Función de Login 
  const login = async (email, pass) => {
    try {
      // Llamamos al backend 
      const authResponse = await apiService.post('/auth/login', {
        email: email,
        password: pass
      }, false); // false = ruta pública

      if (authResponse.token && authResponse.usuario) {
        // Guardamos todo en localStorage
        localStorage.setItem('currentUser', JSON.stringify(authResponse));
        // Actualizamos el estado
        setCurrentUser(authResponse.usuario);
        return authResponse.usuario;
      }
      return null;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(error.message || 'Correo o contraseña incorrectos.');
    }
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Función de Registro (Conectada al Backend)
  const register = async (userData) => {
    try {
      // Llamamos al backend (apiService elige puerto 8081)
      const authResponse = await apiService.post('/auth/register', userData, false);
      
      if (authResponse.token && authResponse.usuario) {
        // Guardamos todo en localStorage (Login automático post-registro)
        localStorage.setItem('currentUser', JSON.stringify(authResponse));
        setCurrentUser(authResponse.usuario);
        return authResponse.usuario;
      }
      throw new Error("Respuesta inválida del servidor durante el registro.");
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};