import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { apiService } from '../services/apiService';

describe('AuthContext', () => {
  let authData;

  // Componente "títere" para extraer los datos del contexto
  const TestComponent = () => {
    authData = useAuth();
    return null;
  };

  const renderWithProvider = () => {
    return render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    authData = null;
    localStorage.clear();
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  // --- PRUEBA 1: Login Exitoso ---
  it('debe actualizar currentUser y localStorage al hacer login exitoso', async () => {
    const mockUser = { nombre: 'Admin Test', rol: 'ADMIN' };
    const mockResponse = { token: 'token-123', usuario: mockUser };
    spyOn(apiService, 'post').and.returnValue(Promise.resolve(mockResponse));

    renderWithProvider();

    await act(async () => {
      const result = await authData.login('admin@test.com', '1234');
      expect(result).toEqual(mockUser);
    });

    expect(authData.currentUser).toEqual(mockUser);
    expect(apiService.post).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  // --- PRUEBA 2: Logout ---
  it('debe limpiar el usuario y localStorage al hacer logout', async () => {
    const storedUser = { token: 'abc', usuario: { nombre: 'Juan' } };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedUser));

    renderWithProvider();
    expect(authData.currentUser).toEqual({ nombre: 'Juan' });

    act(() => {
      authData.logout();
    });

    expect(authData.currentUser).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  // --- PRUEBA 3 
  it('debe lanzar un error si el login falla', async () => {
    // 1. Simulamos que el servidor responde con error
    spyOn(apiService, 'post').and.returnValue(Promise.reject(new Error('Credenciales inválidas')));

    renderWithProvider();

    // 2. Variable para capturar el error
    let errorCapturado = null;

    // 3. Ejecutamos dentro de act y try/catch
    // Esto permite que React procese los estados sin que Jasmine explote antes de tiempo
    await act(async () => {
      try {
        await authData.login('bad@test.com', 'badpass');
      } catch (e) {
        errorCapturado = e;
      }
    });

    // 4. Verificaciones
    // Aseguramos que la variable errorCapturado ya no es null
    expect(errorCapturado).not.toBeNull();
    // Verificamos que el mensaje sea el esperado
    expect(errorCapturado.message).toContain('Credenciales inválidas');
    // El usuario debe seguir siendo null porque falló el login
    expect(authData.currentUser).toBeNull();
  });
});