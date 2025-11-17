import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Hook personalizado para consumir el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider (El componente que maneja toda la lógica)
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para saber si ya verificamos localStorage

  // 4. Verificar si hay un usuario logueado en localStorage al cargar la app
  // (Esto evita que el usuario se "desloguee" al recargar la página)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error al leer 'currentUser' de localStorage", e);
      localStorage.removeItem('currentUser');
    }
    setLoading(false); // Terminamos de verificar
  }, []);

 // ... (imports, createContext, useAuth, AuthProvider, useState, useEffect) ...

  // 5. Función de Login (CON CONSOLE.LOGS)
  const login = (email, pass) => {
    console.log("Intentando iniciar sesión con:", email, pass); // <-- LOG 1
    try {
      const admins = [
        { nombre: 'Felipe Quezada', email: 'felipe@huerto.hogar', pass: 'felipe1234', rol: 'admin' },
        { nombre: 'Matias Guzman', email: 'matias@huerto.hogar', pass: 'matias1234', rol: 'admin' },
        { nombre: 'Danilo Celis', email: 'danilo@huerto.hogar', pass: 'danilo1234', rol: 'admin' }
      ];
      
      let usersFromStorage = [];
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          usersFromStorage = JSON.parse(storedUsers);
        }
      } catch (e) {
         console.error("Error al parsear 'users' de localStorage:", e);
         // Continuar solo con admins si 'users' está corrupto
      }

      console.log("Usuarios de localStorage:", usersFromStorage); // <-- LOG 2
      console.log("Admins definidos:", admins); // <-- LOG 3

      const allUsers = usersFromStorage.concat(admins);
      console.log("Lista completa de usuarios (allUsers):", allUsers); // <-- LOG 4
      
      // Busca exactamente email Y contraseña
      const user = allUsers.find(u => u.email === email && u.pass === pass);
      
      console.log("Usuario encontrado:", user); // <-- LOG 5
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return user;
      }
      return null; // Credenciales incorrectas
    } catch (e) {
      console.error("Error inesperado en login:", e);
      return null;
    }
  };

// ... (logout, register, value, return) ...

  // 6. Función de Logout (lógica de auth.js)
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  // 7. Función de Registro (lógica de registro.js)
  const register = (userData) => {
      // (userData viene del formulario de RegistrationPage)
     try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Validar si el email ya existe
        if (users.some(user => user.email === userData.email)) {
          throw new Error("El correo electrónico ya está en uso.");
        }
        
        // Validar si el RUN ya existe
        if (users.some(user => user.run === userData.run)) {
          throw new Error("El RUN ya está registrado en el sistema.");
        }

        // Crear nuevo usuario
        const newUser = {
          nombre: `${userData.nombre} ${userData.apellido}`,
          run: userData.run,
          email: userData.email,
          pass: userData.password, // En un caso real, esto debería estar hasheado
          region: userData.region,
          comuna: userData.comuna,
          direccion: userData.direccion,
          fechaRegistro: new Date().toISOString(),
          rol: 'cliente'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Login automático después de registrarse
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);

        return newUser;

     } catch (error) {
        console.error("Error al registrar:", error);
        // Re-lanzar el error para que el formulario de registro lo atrape
        throw error; 
     }
  };

  // 8. Valor a proveer al resto de la app
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register
  };

  // No renderizar los hijos hasta que hayamos verificado el localStorage
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};