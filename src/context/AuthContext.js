import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
// Nosotros optamos por usar Context API para manejar la autenticación globalmente
// permitiendo acceso al usuario actual desde cualquier componente sin prop drilling
export const AuthContext = createContext();

// 2. Hook personalizado para consumir el contexto
// Nuestro equipo decide exponer este hook para que los componentes accedan
// a la autenticación de forma limpia y consistente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider (El componente que maneja toda la lógica)
export const AuthProvider = ({  children  }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. Verificar si hay un usuario logueado en localStorage al cargar la app
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
    setLoading(false);
  }, []);

  // 5. Función de Login
  // Nuestro equipo implementó la lógica para buscar el usuario en un array combinado
  // de administradores hardcodeados y usuarios registrados desde localStorage
  const login = ( email ,  pass ) => {
    try {
      // Datos de administradores predefinidos por el cliente
      const admins = [
        { nombre: 'Felipe Quezada', email: 'felipe@huerto.hogar', pass: 'felipe1234', rol: 'admin' },
        { nombre: 'Matias Guzman', email: 'matias@huerto.hogar', pass: 'matias1234', rol: 'admin' },
        { nombre: 'Danilo Celis', email: 'danilo@huerto.hogar', pass: 'danilo1234', rol: 'admin' }
      ];
      
      // Recuperamos usuarios registrados del almacenamiento local
      let usersFromStorage = [];
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          usersFromStorage = JSON.parse(storedUsers);
        }
      } catch (e) {
         console.error("Error al parsear 'users' de localStorage:", e);
      }
      
      // Combinamos administradores y usuarios para búsqueda
      const allUsers = usersFromStorage.concat(admins);
      
      // Buscamos el usuario que coincida con email y contraseña
      const user = allUsers.find( u  =>  u .email ===  email  &&  u .pass ===  pass );
            
      if (user) {
        // Guardamos el usuario en localStorage para persistencia entre sesiones
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return user;
      }
      return null;
    } catch (e) {
      console.error("Error inesperado en login:", e);
      return null;
    }
  };

  // 6. Función de Logout
  // Limpiamos tanto el estado local como el almacenamiento persistente
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  // 7. Función de Registro
  // Nuestro equipo diseñó esta función para validar que no existan duplicados
  // de email ni RUN, y luego guardar el nuevo usuario en localStorage
  const register = ( userData ) => {
     try {
        // Recuperamos usuarios existentes o iniciamos array vacío
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Validamos que el email no esté ya en uso
        if (users.some( user  =>  user .email ===  userData .email)) {
          throw new Error("El correo electrónico ya está en uso.");
        }
        
        // Validamos que el RUN no esté ya registrado
        if (users.some( user  =>  user .run ===  userData .run)) {
          throw new Error("El RUN ya está registrado en el sistema.");
        }
        
        // Creamos el objeto del nuevo usuario con los datos completos
        const newUser = {
          nombre: `${ userData .nombre} ${ userData .apellido}`,
          run:  userData .run,
          email:  userData .email,
          pass:  userData .password,
          region:  userData .region,
          comuna:  userData .comuna,
          direccion:  userData .direccion,
          fechaRegistro: new Date().toISOString(),
          rol: 'cliente'
        };
        
        // Guardamos el nuevo usuario en la lista
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Automáticamente logueamos al usuario tras su registro
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        return newUser;
     } catch (error) {
        console.error("Error al registrar:", error);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};