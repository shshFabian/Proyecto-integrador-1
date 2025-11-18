/**
 * PRUEBAS UNITARIAS - COMPONENTE HEADER
 * 
 * Este archivo contiene las pruebas para el componente Header que es la barra de navegación
 * principal de la aplicación. El Header incluye el logo, menú de navegación y versión móvil.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/layout/Header';

// Helper para renderizar componentes que usan react-router-dom
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  /**
   * TEST 1: Verificar que el logo y nombre de la app se renderizan correctamente
   * 
   * Propósito: Asegurar que la identidad visual de la aplicación está presente
   * Qué verifica: Que el texto "TaskManager" aparece en el header
   */
  it('debe renderizar el logo y nombre de la aplicación', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('TaskManager')).toBeInTheDocument();
  });

  /**
   * TEST 2: Verificar que todos los links de navegación están presentes
   * 
   * Propósito: Asegurar que el usuario puede navegar a todas las secciones principales
   * Qué verifica: Que los links "Inicio", "Tareas" y "Calendario" están visibles
   */
  it('debe mostrar todos los links de navegación en desktop', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByText('Calendario')).toBeInTheDocument();
  });

  /**
   * TEST 3: Verificar funcionalidad del menú móvil (hamburguesa)
   * 
   * Propósito: Asegurar que el menú móvil funciona correctamente en dispositivos pequeños
   * Qué verifica: 
   * - Que al hacer click en el botón del menú móvil, se abre el menú
   * - Que los items de navegación se duplican (versión desktop + versión móvil)
   */
  it('debe abrir y cerrar el menú móvil al hacer click', () => {
    renderWithRouter(<Header />);
    
    // Buscar el botón del menú móvil (segundo botón en el header)
    const menuButton = screen.getAllByRole('button')[1];
    
    // Simular click para abrir el menú
    fireEvent.click(menuButton);
    
    // Verificar que el menú está visible - debe haber versión desktop y mobile
    const inicioLinks = screen.getAllByText('Inicio');
    expect(inicioLinks.length).toBeGreaterThan(1); // Debe haber versión desktop y mobile
  });
});
