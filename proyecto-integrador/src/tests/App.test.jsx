/**
 * PRUEBAS UNITARIAS - COMPONENTE APP (RAÍZ)
 * 
 * Este archivo contiene las pruebas para el componente principal App que es la raíz
 * de toda la aplicación. App contiene la estructura general: Header, contenido y Footer.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  /**
   * TEST 1: Verificar que el Header se renderiza correctamente
   * 
   * Propósito: Asegurar que la barra de navegación principal está presente
   * Qué verifica: Que el texto "TaskManager" aparece (está en Header y Footer)
   * 
   * Nota: Usamos getAllByText porque "TaskManager" aparece en múltiples lugares
   */
  it('debe renderizar el Header correctamente', () => {
    render(<App />);
    
    // Usar getAllByText porque aparece en Header y Footer
    const taskManagerElements = screen.getAllByText('TaskManager');
    expect(taskManagerElements.length).toBeGreaterThan(0);
  });

  /**
   * TEST 2: Verificar que el Footer se renderiza correctamente
   * 
   * Propósito: Asegurar que el pie de página está presente en la aplicación
   * Qué verifica: Que existe un elemento <footer> en el DOM
   */
  it('debe renderizar el Footer correctamente', () => {
    render(<App />);
    
    // Buscar el elemento footer en el documento
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  /**
   * TEST 3: Verificar la estructura principal de la aplicación
   * 
   * Propósito: Asegurar que el contenedor principal existe y tiene las clases correctas
   * Qué verifica:
   * - Que existe un elemento <main>
   * - Que tiene la clase 'flex-grow' para ocupar el espacio disponible
   * 
   * Esto es importante para el layout correcto de la aplicación
   */
  it('debe tener la estructura principal de la aplicación', () => {
    const { container } = render(<App />);
    
    // Verificar que existe el contenedor principal
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-grow');
  });

  /**
   * TEST 4: Verificar que los estilos globales se aplican correctamente
   * 
   * Propósito: Asegurar que el contenedor raíz tiene las clases CSS correctas
   * Qué verifica:
   * - Clase 'min-h-screen' para altura mínima de pantalla completa
   * - Clase 'bg-slate-50' para el color de fondo
   * 
   * Esto asegura que la aplicación se ve correctamente en cualquier tamaño de pantalla
   */
  it('debe aplicar las clases de estilo correctas al contenedor principal', () => {
    const { container } = render(<App />);
    
    const appContainer = container.firstChild;
    expect(appContainer).toHaveClass('min-h-screen');
    expect(appContainer).toHaveClass('bg-slate-50');
  });
});
