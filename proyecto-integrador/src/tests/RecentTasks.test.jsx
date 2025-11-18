/**
 * PRUEBAS UNITARIAS - COMPONENTE RECENT TASKS
 * 
 * Este archivo contiene las pruebas para el componente RecentTasks que muestra
 * las tareas más recientes del usuario con sus estados visuales.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecentTasks from '../components/home/RecentTasks';

// Helper para renderizar componentes que usan react-router-dom
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecentTasks Component', () => {
  /**
   * TEST 1: Verificar mensaje de estado vacío
   * 
   * Propósito: Asegurar que se guía al usuario cuando no tiene tareas
   * Qué verifica:
   * - Mensaje "No hay tareas recientes" aparece
   * - Link "Crear primera tarea" está disponible para guiar al usuario
   * 
   * Esto mejora la experiencia de nuevos usuarios
   */
  it('debe mostrar mensaje cuando no hay tareas recientes', () => {
    renderWithRouter(<RecentTasks tasks={[]} />);
    
    expect(screen.getByText('No hay tareas recientes')).toBeInTheDocument();
    expect(screen.getByText('Crear primera tarea')).toBeInTheDocument();
  });

  /**
   * TEST 2: Verificar estilo visual de tareas completadas
   * 
   * Propósito: Asegurar que las tareas completadas se distinguen visualmente
   * Qué verifica: Que las tareas completadas tienen la clase CSS 'line-through'
   * 
   * Esto es importante para que el usuario identifique rápidamente
   * qué tareas ya están terminadas
   */
  it('debe aplicar line-through a tareas completadas', () => {
    const tasks = [
      {
        id: 1,
        title: 'Tarea completada',
        completed: true,
        dueDate: new Date().toISOString()
      }
    ];
    
    renderWithRouter(<RecentTasks tasks={tasks} />);
    
    const taskTitle = screen.getByText('Tarea completada');
    expect(taskTitle).toHaveClass('line-through');
  });

  /**
   * TEST 3: Verificar límite de tareas mostradas
   * 
   * Propósito: Asegurar que no se sobrecarga la interfaz con demasiadas tareas
   * Qué verifica:
   * - Solo se muestran las primeras 5 tareas
   * - Las tareas 1-5 están visibles
   * - La tarea 6 y siguientes NO están visibles
   * 
   * Esto mantiene la interfaz limpia y enfocada en lo más reciente
   */
  it('debe limitar la visualización a 5 tareas', () => {
    // Crear 10 tareas de prueba
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Tarea ${i + 1}`,
      completed: false,
      dueDate: new Date().toISOString()
    }));
    
    renderWithRouter(<RecentTasks tasks={tasks} />);
    
    // Verificar que solo se muestran las primeras 5 tareas
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 5')).toBeInTheDocument();
    expect(screen.queryByText('Tarea 6')).not.toBeInTheDocument();
  });
});
