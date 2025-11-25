import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { apiService } from '../services/apiService';

/**
 * Suite de pruebas para AuthContext
 * Esto es para: Validar que el sistema de autenticación funciona correctamente
 * (login exitoso, logout, manejo de errores, persistencia de sesión)
 */
describe('AuthContext', () => {
  let authData;

  /**
   * Componente de prueba "títere"
   * Esto lo que hace es: Extrae los datos del contexto de autenticación para usarlos en las pruebas
   * Esto es para: Acceder a las funciones y estado de autenticación desde dentro de un componente envuelto por AuthProvider
   */
  const TestComponent = () => {
    authData = useAuth();
    return null;
  };

  /**
   * Función auxiliar para renderizar el componente dentro del AuthProvider
   * Esto lo que hace es: Crea el ambiente necesario para que el componente de prueba acceda al contexto
   */
  const renderWithProvider = () => {
    return render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  };

  /**
   * Configuración inicial antes de cada prueba
   * Esto lo que hace es: Limpia el estado, localStorage y configura spies para monitorear llamadas
   * Esto es para: Garantizar que cada prueba inicie en un estado limpio sin datos residuales
   */
  beforeEach(() => {
    authData = null;
    localStorage.clear();
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  // --- PRUEBA 1: Login Exitoso ---
  /**
   * Prueba: Login exitoso actualiza currentUser y localStorage
   * Esto lo que hace es: Simula un login exitoso y verifica que se actualice el usuario y se guarde en localStorage
   * Esto es para: Garantizar que el proceso de login funciona correctamente end-to-end
   */
  it('debe actualizar currentUser y localStorage al hacer login exitoso', async () => {
    // Crear datos simulados del usuario administrador
    const mockUser = { nombre: 'Admin Test', rol: 'ADMIN' };
    const mockResponse = { token: 'token-123', usuario: mockUser };
    // Simular la respuesta del backend para el login
    spyOn(apiService, 'post').and.returnValue(Promise.resolve(mockResponse));

    renderWithProvider();

    // Ejecutar login dentro de act para que React procese los cambios
    await act(async () => {
      const result = await authData.login('admin@test.com', '1234');
      // Verificar que el resultado es el usuario esperado
      expect(result).toEqual(mockUser);
    });

    // Verificar que el estado global se actualizó con el usuario
    expect(authData.currentUser).toEqual(mockUser);
    // Verificar que se llamó al backend
    expect(apiService.post).toHaveBeenCalled();
    // Verificar que se guardó en localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  // --- PRUEBA 2: Logout ---
  /**
   * Prueba: Logout limpia el usuario y localStorage
   * Esto lo que hace es: Verifica que al hacer logout se eliminen los datos del usuario y la sesión
   * Esto es para: Asegurar que el logout cierra la sesión correctamente
   */
  it('debe limpiar el usuario y localStorage al hacer logout', async () => {
    // Simular que hay un usuario guardado en localStorage
    const storedUser = { token: 'abc', usuario: { nombre: 'Juan' } };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedUser));

    renderWithProvider();
    // Verificar que el usuario se restauró desde localStorage
    expect(authData.currentUser).toEqual({ nombre: 'Juan' });

    // Ejecutar logout
    act(() => {
      authData.logout();
    });

    // Verificar que el usuario se limpió
    expect(authData.currentUser).toBeNull();
    // Verificar que se removió de localStorage
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  // --- PRUEBA 3: Login Fallido ---
  /**
   * Prueba: Login falla con credenciales inválidas
   * Esto lo que hace es: Simula un fallo en el login y verifica que se lance un error apropiado
   * Esto es para: Garantizar que se manejan correctamente los errores de autenticación
   */
  it('debe lanzar un error si el login falla', async () => {
    // Simular que el servidor responde con error de credenciales
    spyOn(apiService, 'post').and.returnValue(Promise.reject(new Error('Credenciales inválidas')));

    renderWithProvider();

    // Variable para capturar el error lanzado
    let errorCapturado = null;

    // Ejecutar login dentro de act con try/catch para capturar el error
    // Esto permite que React procese los estados sin que Jasmine explote
    await act(async () => {
      try {
        await authData.login('bad@test.com', 'badpass');
      } catch (e) {
        errorCapturado = e;
      }
    });

    // Verificar que se capturó el error
    expect(errorCapturado).not.toBeNull();
    // Verificar que el mensaje de error es el esperado
    expect(errorCapturado.message).toContain('Credenciales inválidas');
    // Verificar que el usuario sigue siendo null después del fallo
    expect(authData.currentUser).toBeNull();
  });
});