import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';

/**
 * LoginPage Test Suite
 * 
 * Esto es para: Validar que el componente LoginPage funciona correctamente
 * en diferentes escenarios: renderización, validación de formularios, y autenticación.
 * 
 * Esto lo que hace es: Ejecuta 3 pruebas principales:
 * 1. Verifica que el formulario se renderiza con todos sus elementos
 * 2. Verifica que muestra errores de validación para email inválido
 * 3. Verifica que llama a login() con datos válidos
 */
describe('LoginPage', () => {
  // Spy de Jasmine que simula la función login del contexto de autenticación
  // Esto es para: Poder verificar si la función fue llamada y con qué parámetros
  const mockLogin = jasmine.createSpy('login');

  /**
   * renderComponent - Función auxiliar para renderizar el componente
   * 
   * Esto es para: Evitar repetición de código de setup en cada test
   * 
   * Esto lo que hace es:
   * 1. Crea un objeto mock del contexto de autenticación con funciones simuladas
   * 2. Envuelve LoginPage con Router (necesario para useNavigate)
   * 3. Envuelve con AuthContext.Provider para proporcionar el contexto
   * 4. Renderiza el componente para pruebas
   */
  const renderComponent = () => {
    // Mock del contexto de autenticación con todas las funciones necesarias
    const authContextValue = {
      login: mockLogin,  // Función simulada que será espiada
      currentUser: null, // No hay usuario logueado inicialmente
      loading: false,    // No está cargando datos
      logout: () => {},  // Stub para logout (no se usa en este test)
      register: () => {} // Stub para register (no se usa en este test)
    };
    render(
      <Router>
        <AuthContext.Provider value={authContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </Router>
    );
  };

  /**
   * beforeEach - Hook que corre antes de cada test
   * 
   * Esto es para: Limpiar el estado del spy para que cada test sea independiente
   * 
   * Esto lo que hace es: Reseta todas las llamadas registradas al mockLogin
   * para que cada test tenga un estado limpio
   */
  beforeEach(() => {
    mockLogin.calls.reset();
  });

  /**
   * TEST 1: Renderización correcta del formulario
   * 
   * Esto es para: Verificar que el componente se renderiza sin errores
   * y que todos los elementos principales están presentes
   * 
   * Esto lo que hace es:
   * - Renderiza el componente
   * - Verifica que el título "Iniciar Sesión" existe en el DOM
   * - Verifica que el botón "Ingresar" existe en el DOM
   */
  it('debe renderizar el formulario de login correctamente', () => {
    renderComponent();

    // Assertions: Verifican que los elementos clave estén presentes
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeTruthy();
  });

  /**
   * TEST 2: Validación de email inválido
   * 
   * Esto es para: Verificar que la validación del formulario funciona
   * y que login() NO se llama cuando hay errores de validación
   * 
   * Esto lo que hace es:
   * - Renderiza el componente
   * - Ingresa un email inválido (sin @)
   * - Ingresa una contraseña válida
   * - Hace click en el botón Ingresar
   * - Verifica que aparece el mensaje de error
   * - Verifica que login() NO fue llamado
   */
  it('debe mostrar un error de validación si se envía un email inválido', () => {
    renderComponent();

    // Obtiene referencias a los inputs del formulario
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('Tu contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    
    // Simula que el usuario ingresa un email INVÁLIDO (sin formato @)
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    // Simula que el usuario ingresa una contraseña válida
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    // Simula click en botón de envío
    fireEvent.click(submitButton);
    
    // Assertions: Verifica que:
    // 1. El mensaje de error aparece en la pantalla
    expect(screen.getByText(/El formato del correo no es válido/i)).toBeTruthy();
    // 2. La función login NO fue llamada (protección contra datos inválidos)
    expect(mockLogin).not.toHaveBeenCalled();
  });

  /**
   * TEST 3: Llamada a login con credenciales válidas
   * 
   * Esto es para: Verificar que cuando el formulario es válido,
   * la función login() se llama con los datos correctos
   * 
   * Esto lo que hace es:
   * - Renderiza el componente
   * - Ingresa un email válido
   * - Ingresa una contraseña válida
   * - Hace click en el botón Ingresar
   * - Verifica que NO hay errores de validación
   * - Verifica que login() fue llamado exactamente una vez
   * - Verifica que login() recibió los parámetros correctos
   */
  it('debe llamar a la función login con los datos correctos si el formulario es válido', () => {
    renderComponent();
    
    // Obtiene referencias a los inputs del formulario
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('Tu contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    
    // Simula que el usuario ingresa un email VÁLIDO
    fireEvent.change(emailInput, { target: { value: 'felipe@huerto.hogar' } });
    // Simula que el usuario ingresa una contraseña válida
    fireEvent.change(passwordInput, { target: { value: 'felipe1234' } });
    // Simula click en botón de envío
    fireEvent.click(submitButton);
    
    // Assertions: Verifica que:
    // 1. NO hay mensajes de error de validación
    expect(screen.queryByText(/El formato del correo no es válido/i)).toBeNull();
    // 2. La función login FUE llamada
    expect(mockLogin).toHaveBeenCalled();
    // 3. La función login fue llamada con los parámetros exactos correctos
    expect(mockLogin).toHaveBeenCalledWith('felipe@huerto.hogar', 'felipe1234');
  });
});