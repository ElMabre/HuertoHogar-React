import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { AuthContext } from '../context/AuthContext'; // 1. Importamos el Contexto

describe('RegisterPage', () => {
  // 2. Creamos un espía (mock) para la función register
  const mockRegister = jasmine.createSpy('register');

  const renderComponent = () => {
    // 3. Definimos el valor que tendrá el contexto durante la prueba
    const authContextValue = {
      register: mockRegister, // Aquí inyectamos la función simulada
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
    mockRegister.calls.reset();
  });

  // --- PRUEBA 4 ---
  it('debe renderizar el formulario de registro correctamente', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeTruthy();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tu apellido')).toBeTruthy();
    expect(screen.getByPlaceholderText('12345678-9')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeTruthy();
  });

  // --- PRUEBA 5 ---
  it('debe mostrar error si el RUN es inválido', () => {
    renderComponent();
    const runInput = screen.getByPlaceholderText('12345678-9');
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });

    fireEvent.change(runInput, { target: { value: 'run-malo' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/RUN inválido/i)).toBeTruthy();
  });

  // --- PRUEBA 6 ---
  it('debe mostrar error si las contraseñas no coinciden', () => {
    renderComponent();
    const pass1Input = screen.getByLabelText('Contraseña');
    const pass2Input = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i });

    fireEvent.change(pass1Input, { target: { value: 'pass123' } });
    fireEvent.change(pass2Input, { target: { value: 'pass456' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
  });
});