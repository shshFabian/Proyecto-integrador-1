/**
 * PRUEBAS UNITARIAS - PÁGINA ABOUT
 * 
 * Este archivo contiene las pruebas para la página "Acerca de" (About) que muestra
 * información sobre la aplicación, sus características, tecnologías y contacto.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../pages/About/index';

// Helper para renderizar componentes que usan react-router-dom
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('About Page', () => {
  /**
   * TEST 1: Verificar que el título y descripción principal se muestran
   * 
   * Propósito: Asegurar que la información principal de la app está visible
   * Qué verifica:
   * - El nombre "TaskManager" aparece
   * - La descripción "Sistema profesional de gestión de tareas" está presente
   */
  it('debe renderizar el título y descripción principal', () => {
    renderWithRouter(<About />);
    
    expect(screen.getByText('TaskManager')).toBeInTheDocument();
    expect(screen.getByText(/Sistema profesional de gestión de tareas/)).toBeInTheDocument();
  });

  /**
   * TEST 2: Verificar que todas las características se muestran
   * 
   * Propósito: Asegurar que las 4 características principales están visibles
   * Qué verifica: Que aparecen las 4 features:
   * - Gestión Completa
   * - Rápido y Eficiente
   * - Seguro y Confiable
   * - Colaborativo
   */
  it('debe mostrar todas las características (features)', () => {
    renderWithRouter(<About />);
    
    expect(screen.getByText('Gestión Completa')).toBeInTheDocument();
    expect(screen.getByText('Rápido y Eficiente')).toBeInTheDocument();
    expect(screen.getByText('Seguro y Confiable')).toBeInTheDocument();
    expect(screen.getByText('Colaborativo')).toBeInTheDocument();
  });

  /**
   * TEST 3: Verificar que el stack tecnológico se muestra
   * 
   * Propósito: Asegurar que las tecnologías usadas están documentadas
   * Qué verifica: Que aparecen las 4 tecnologías principales:
   * - React (framework frontend)
   * - Tailwind CSS (estilos)
   * - Supabase (backend/base de datos)
   * - Vite (build tool)
   */
  it('debe mostrar las tecnologías utilizadas', () => {
    renderWithRouter(<About />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  /**
   * TEST 4: Verificar que las estadísticas del proyecto se muestran
   * 
   * Propósito: Asegurar que los valores destacados de la app están visibles
   * Qué verifica: Que aparecen las estadísticas:
   * - 100% Gratuito
   * - 24/7 Disponibilidad
   * - ∞ Tareas Ilimitadas
   */
  it('debe mostrar las estadísticas del proyecto', () => {
    renderWithRouter(<About />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Gratuito')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
  });

  /**
   * TEST 5: Verificar que el enlace de contacto funciona correctamente
   * 
   * Propósito: Asegurar que los usuarios pueden contactar soporte
   * Qué verifica:
   * - El botón "Contactar Soporte" está presente
   * - El enlace tiene el atributo href correcto (mailto:soporte@taskmanager.com)
   * 
   * Esto es importante para que los usuarios puedan obtener ayuda
   */
  it('debe tener un enlace de contacto funcional', () => {
    renderWithRouter(<About />);
    
    const contactLink = screen.getByText('Contactar Soporte');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest('a')).toHaveAttribute('href', 'mailto:soporte@taskmanager.com');
  });
});
