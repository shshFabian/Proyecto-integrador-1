/**
 * PRUEBAS UNITARIAS - COMPONENTE UPCOMING TASKS
 * 
 * Este archivo contiene las pruebas para el componente UpcomingTasks que muestra
 * las próximas tareas pendientes ordenadas por fecha de vencimiento.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UpcomingTasks from '../components/home/UpcomingTasks';

describe('UpcomingTasks Component', () => {
  /**
   * TEST 1: Verificar mensaje cuando no hay tareas próximas
   * 
   * Propósito: Asegurar que se muestra un mensaje apropiado cuando la lista está vacía
   * Qué verifica: Que aparece el texto "No hay tareas próximas" cuando no hay datos
   */
  it('debe mostrar mensaje cuando no hay tareas próximas', () => {
    render(<UpcomingTasks tasks={[]} />);
    
    expect(screen.getByText('No hay tareas próximas')).toBeInTheDocument();
  });

  /**
   * TEST 2: Verificar filtrado correcto de tareas
   * 
   * Propósito: Asegurar que solo se muestran tareas pendientes con fecha futura
   * Qué verifica:
   * - Tareas no completadas con fecha futura SÍ se muestran
   * - Tareas completadas NO se muestran (aunque tengan fecha futura)
   * - Tareas sin fecha NO se muestran
   * 
   * Esto es importante para que el usuario solo vea tareas relevantes
   */
  it('debe filtrar y mostrar solo tareas no completadas con fecha futura', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = [
      {
        id: 1,
        title: 'Tarea futura',
        dueDate: tomorrow.toISOString(),
        completed: false
      },
      {
        id: 2,
        title: 'Tarea completada',
        dueDate: tomorrow.toISOString(),
        completed: true
      },
      {
        id: 3,
        title: 'Tarea sin fecha',
        dueDate: null,
        completed: false
      }
    ];
    
    render(<UpcomingTasks tasks={tasks} />);
    
    // Solo debe mostrar la tarea futura no completada
    expect(screen.getByText('Tarea futura')).toBeInTheDocument();
    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument();
    expect(screen.queryByText('Tarea sin fecha')).not.toBeInTheDocument();
  });

  /**
   * TEST 3: Verificar formato de fecha legible para el usuario
   * 
   * Propósito: Asegurar que las fechas se muestran en formato amigable
   * Qué verifica: Que las fechas aparecen en formatos como:
   * - "Hoy"
   * - "Mañana"
   * - "En X días"
   * - O fecha formateada (ej: "15 nov")
   * 
   * Esto mejora la experiencia del usuario al hacer las fechas más comprensibles
   */
  it('debe mostrar formato de fecha para tareas futuras', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    
    const tasks = [
      {
        id: 1,
        title: 'Tarea futura',
        dueDate: futureDate.toISOString(),
        completed: false
      }
    ];
    
    render(<UpcomingTasks tasks={tasks} />);
    
    // Verificar que la tarea se muestra
    expect(screen.getByText('Tarea futura')).toBeInTheDocument();
    // Verificar que muestra algún formato de fecha legible
    const dateText = screen.getByText(/En \d+ días|Hoy|Mañana|\d+ \w+/);
    expect(dateText).toBeInTheDocument();
  });
});
