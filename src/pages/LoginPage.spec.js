// src/components/LoginPage.spec.js

// 'src/tests.entry.js' ya se encarga de las importaciones,
// así que este archivo queda limpio.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  const mockLogin = jasmine.createSpy('login');

  const renderComponent = () => {
    const authContextValue = {
      login: mockLogin,
      currentUser: null,
      loading: false,
      logout: () => {},
      register: () => {}
    };
    render(
      <Router>
        <AuthContext.Provider value={authContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    mockLogin.calls.reset();
  });

  // --- PRUEBA 1 ---
  it('debe renderizar el formulario de login correctamente', () => {
    renderComponent();

  
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeTruthy();
  });

  // --- PRUEBA 2 ---
  it('debe mostrar un error de validación si se envía un email inválido', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('Tu contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    fireEvent.click(submitButton);
    
    // --- MODIFICACIÓN 2 ---
    // Usamos .toBeTruthy() de nuevo
    expect(screen.getByText(/El formato del correo no es válido/i)).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // --- PRUEBA 3 ---
  it('debe llamar a la función login con los datos correctos si el formulario es válido', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('Tu contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    fireEvent.change(emailInput, { target: { value: 'felipe@huerto.hogar' } });
    fireEvent.change(passwordInput, { target: { value: 'felipe1234' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText(/El formato del correo no es válido/i)).toBeNull();
    expect(mockLogin).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith('felipe@huerto.hogar', 'felipe1234');
  });
});