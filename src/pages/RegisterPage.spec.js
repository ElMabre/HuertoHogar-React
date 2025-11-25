import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { AuthContext } from '../context/AuthContext';

describe('RegisterPage', () => {
  // Mocking (Simulación):
  // Creamos una función espía falsa ('register').
  // Esto es vital porque en un test unitario NO queremos llamar al backend real, solo queremos saber si el formulario intentó llamar a esta función.
  const mockRegister = jasmine.createSpy('register');

  // Helper de configuración:
  // Como 'RegisterPage' usa 'useAuth' internamente, si lo renderizamos solo, fallará.
  // Aquí envolvemos el componente en un AuthContext.Provider con valores controlados por nosotros.
  const renderComponent = () => {
    const authContextValue = {
      register: mockRegister, // Inyectamos nuestra función espía
      currentUser: null,
      loading: false,
      login: () => {},
      logout: () => {}
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    // Limpiamos el espía antes de cada test para que el contador de llamadas empiece en 0.
    mockRegister.calls.reset();
  });

  // --- PRUEBA 4: RENDERIZADO BÁSICO ---
  it('debe renderizar el formulario de registro correctamente', () => {
    renderComponent();

    // Verificamos que los elementos visuales clave existan en el DOM virtual.
    expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeTruthy();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tu apellido')).toBeTruthy();
    expect(screen.getByPlaceholderText('12345678-9')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeTruthy();
  });

  // --- PRUEBA 5: VALIDACIÓN DE RUT ---
  it('debe mostrar error si el RUN es inválido', () => {
    renderComponent();
    
    // Capturamos los elementos
    const runInput = screen.getByPlaceholderText('12345678-9');
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });

    // Simulamos la interacción del usuario: Escribir un RUT malo y clickear.
    fireEvent.change(runInput, { target: { value: 'run-malo' } });
    fireEvent.click(submitButton);

    // Assert: Esperamos ver el mensaje de error de validación en pantalla.
    expect(screen.getByText(/RUN inválido/i)).toBeTruthy();
  });

  // --- PRUEBA 6: VALIDACIÓN DE PASSWORD ---
  it('debe mostrar error si las contraseñas no coinciden', () => {
    renderComponent();
    const pass1Input = screen.getByLabelText('Contraseña');
    const pass2Input = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });

    // Simulamos que el usuario escribe contraseñas distintas.
    fireEvent.change(pass1Input, { target: { value: 'pass123' } });
    fireEvent.change(pass2Input, { target: { value: 'pass456' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
  });
});