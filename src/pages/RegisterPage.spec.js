// src/components/RegisterPage.spec.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from './RegisterPage'; // Asegúrate de importar el componente correcto

describe('RegisterPage', () => {

  const renderComponent = () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
  };

  // --- PRUEBA 4 ---
  it('debe renderizar el formulario de registro correctamente', () => {
    renderComponent();
  
    
    // 1. Verificamos que el TÍTULO exista
    expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeTruthy();
    
    // 2. Verificamos que los campos existan
    expect(screen.getByPlaceholderText('Tu nombre')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tu apellido')).toBeTruthy();
    expect(screen.getByPlaceholderText('12345678-9')).toBeTruthy(); // Prueba de RUN
    
    // 3. Verificamos que el BOTÓN exista (este ya estaba bien)
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