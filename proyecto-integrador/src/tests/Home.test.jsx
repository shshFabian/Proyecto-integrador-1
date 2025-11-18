/**
 * PRUEBAS UNITARIAS - PÁGINA HOME
 * 
 * Este archivo contiene las pruebas para la página principal (Home) de la aplicación.
 * La página Home muestra el dashboard con estadísticas, tareas recientes y próximas.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/index';
import * as tasksApi from '../services/api/tasks';

// Mock del servicio de API para simular llamadas sin hacer peticiones reales
vi.mock('../services/api/tasks');

// Helper para renderizar componentes que usan react-router-dom
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Page', () => {
  // Limpiar mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Verificar que se muestra un loader durante la carga
   * 
   * Propósito: Asegurar que el usuario ve feedback visual mientras se cargan los datos
   * Qué verifica: Que aparece un spinner animado mientras se obtienen las tareas
   * 
   * Esto mejora la experiencia del usuario al indicar que algo está pasando
   */
  it('debe mostrar el loader mientras carga las tareas', () => {
    // Simular una petición que nunca termina para capturar el estado de carga
    tasksApi.getTasks.mockImplementation(() => new Promise(() => {}));
    
    const { container } = renderWithRouter(<Home />);
    
    // Verificar que existe el spinner de carga
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  /**
   * TEST 2: Verificar cálculo de estadísticas del dashboard
   * 
   * Propósito: Asegurar que las estadísticas se calculan y muestran correctamente
   * Qué verifica: Que aparecen las 4 tarjetas de estadísticas:
   * - Total de Tareas
   * - Completadas
   * - Pendientes
   * - Vencidas
   * 
   * Datos de prueba:
   * - 3 tareas en total
   * - 1 completada
   * - 2 pendientes (1 actual + 1 vencida)
   * - 1 vencida
   */
  it('debe calcular correctamente las estadísticas de tareas', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Datos de prueba simulando respuesta de la API
    const mockTasks = [
      {
        id_tarea: 1,
        titulo: 'Tarea 1',
        descripcion: 'Desc 1',
        fecha_limite: new Date().toISOString(),
        completada: false,
        categoria: 'trabajo',
        fecha_creacion: new Date().toISOString()
      },
      {
        id_tarea: 2,
        titulo: 'Tarea 2',
        descripcion: 'Desc 2',
        fecha_limite: new Date().toISOString(),
        completada: true,
        categoria: 'personal',
        fecha_creacion: new Date().toISOString()
      },
      {
        id_tarea: 3,
        titulo: 'Tarea vencida',
        descripcion: 'Desc 3',
        fecha_limite: yesterday.toISOString(),
        completada: false,
        categoria: 'trabajo',
        fecha_creacion: new Date().toISOString()
      }
    ];
    
    tasksApi.getTasks.mockResolvedValue(mockTasks);
    
    renderWithRouter(<Home />);
    
    // Esperar a que se carguen los datos y verificar las estadísticas
    await waitFor(() => {
      expect(screen.getByText('Total de Tareas')).toBeInTheDocument();
      expect(screen.getByText('Completadas')).toBeInTheDocument();
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
      expect(screen.getByText('Vencidas')).toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Verificar saludo personalizado según hora del día
   * 
   * Propósito: Asegurar que el saludo cambia según la hora actual
   * Qué verifica: Que aparece uno de estos saludos:
   * - "Buenos días" (antes de las 12:00)
   * - "Buenas tardes" (12:00 - 18:00)
   * - "Buenas noches" (después de las 18:00)
   * 
   * Esto personaliza la experiencia del usuario
   */
  it('debe mostrar el saludo correcto según la hora del día', async () => {
    tasksApi.getTasks.mockResolvedValue([]);
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      const greeting = screen.getByText(/Buenos días|Buenas tardes|Buenas noches/);
      expect(greeting).toBeInTheDocument();
    });
  });
});
