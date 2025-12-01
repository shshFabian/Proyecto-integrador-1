import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ViewGridIcon, ViewListIcon, FilterIcon } from '@heroicons/react/outline';
import { getTasks } from '../../services/api/tasks';
import toast from 'react-hot-toast';
import DayModal from '../../components/calendar/DayModal';
import MiniCalendar from '../../components/calendar/MiniCalendar';
import CalendarStats from '../../components/calendar/CalendarStats';
import { isOverdue } from '../../utils/dateUtils';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'completed'
  const [showFilters, setShowFilters] = useState(false);

  // Cargar tareas desde Supabase
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.map(task => ({
        id: task.id_tarea,
        title: task.titulo,
        description: task.descripcion,
        dueDate: task.fecha_limite,
        completed: task.completada,
        priority: task.prioridad || 'media',
        category: 'personal',
        deleted: false
      })));
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  // Obtener el primer día del mes y el número de días
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Ir al mes actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtener tareas para una fecha específica
  const getTasksForDate = (date) => {
    // Construct local YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    let filteredTasks = tasks.filter(task => {
      if (!task.dueDate || task.deleted) return false;
      // Assuming task.dueDate is "YYYY-MM-DD" or ISO string.
      // If it's "YYYY-MM-DD", we can just take the first 10 chars.
      const taskDate = task.dueDate.substring(0, 10);
      return taskDate === dateStr;
    });

    // Aplicar filtro de estado
    if (filterStatus === 'pending') {
      filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (filterStatus === 'completed') {
      filteredTasks = filteredTasks.filter(t => t.completed);
    }

    return filteredTasks;
  };

  // Verificar si una fecha tiene tareas vencidas
  const hasOverdueTasks = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) return false;

    const dayTasks = getTasksForDate(date);
    return dayTasks.some(task => !task.completed);
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baja': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Nombres de los días de la semana
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Crear array de días del mes con días del mes anterior y siguiente
  const calendarDays = [];

  // Días del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      date: new Date(year, month - 1, prevMonthLastDay - i)
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      date: new Date(year, month, day)
    });
  }

  // Días del mes siguiente para completar la última semana
  const remainingDays = 42 - calendarDays.length; // 6 semanas * 7 días
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
      date: new Date(year, month + 1, day)
    });
  }

  // Función para obtener días de la semana actual
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      weekDays.push(day);
    }

    return weekDays;
  };

  const weekDays = viewMode === 'week' ? getWeekDays() : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendario</h1>
            <p className="mt-1 text-sm text-gray-600">
              Visualiza y gestiona tus tareas en el calendario
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FilterIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewMode === 'month'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <ViewGridIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Mes</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewMode === 'week'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <ViewListIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Semana</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 animate-fadeIn">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Completadas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <CalendarStats
          tasks={tasks}
          currentMonth={currentDate.getMonth()}
          currentYear={currentDate.getFullYear()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">{/* Calendar Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mes anterior"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {formatDate(currentDate)}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    Hoy
                  </button>
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mes siguiente"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid - Month View */}
            {viewMode === 'month' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  {dayNames.map((dayName, idx) => (
                    <div
                      key={dayName}
                      className={`px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold border-r border-gray-200 last:border-r-0 ${idx === 0 || idx === 6 ? 'text-blue-700' : 'text-gray-700'
                        }`}
                    >
                      <span className="hidden sm:inline">{dayName}</span>
                      <span className="sm:hidden">{dayName.charAt(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((dayInfo, index) => {
                    const { day, isCurrentMonth, date } = dayInfo;
                    const dayTasks = getTasksForDate(date);
                    const isTodayDate = isToday(day) && isCurrentMonth;
                    const isOverdue = hasOverdueTasks(date);
                    const pendingCount = dayTasks.filter(t => !t.completed).length;
                    const completedCount = dayTasks.filter(t => t.completed).length;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`min-h-[80px] sm:min-h-[120px] border-r border-b border-gray-200 last:border-r-0 p-1 sm:p-2 transition-all hover:shadow-lg hover:z-10 relative group ${!isCurrentMonth
                          ? 'bg-gray-50'
                          : isTodayDate
                            ? 'bg-gradient-to-br from-blue-50 to-blue-100 ring-2 ring-blue-400 ring-inset'
                            : isOverdue
                              ? 'bg-red-50'
                              : 'bg-white hover:bg-blue-50'
                          }`}
                      >
                        {/* Day Number */}
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`text-xs sm:text-sm font-semibold transition-all ${!isCurrentMonth
                              ? 'text-gray-400'
                              : isTodayDate
                                ? 'text-white bg-blue-600 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md'
                                : isOverdue
                                  ? 'text-red-600'
                                  : 'text-gray-900'
                              }`}
                          >
                            {day}
                          </span>

                          {/* Task Count Badge */}
                          {dayTasks.length > 0 && (
                            <div className="flex gap-1">
                              {pendingCount > 0 && (
                                <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                                  {pendingCount}
                                </span>
                              )}
                              {completedCount > 0 && (
                                <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                                  {completedCount}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Task Preview */}
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate border transition-all ${task.completed
                                ? 'bg-green-100 text-green-800 border-green-200 line-through opacity-75'
                                : getPriorityColor(task.priority)
                                }`}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-600 font-semibold bg-gray-100 rounded px-1.5 py-0.5">
                              +{dayTasks.length - 2}
                            </div>
                          )}
                        </div>

                        {/* Hover Tooltip */}
                        {dayTasks.length > 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                              {pendingCount > 0 && `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`}
                              {pendingCount > 0 && completedCount > 0 && ', '}
                              {completedCount > 0 && `${completedCount} completada${completedCount > 1 ? 's' : ''}`}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 gap-2 p-4">
                  {weekDays.map((date, idx) => {
                    const dayTasks = getTasksForDate(date);
                    const isTodayDate = isToday(date.getDate()) &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
                    const isOverdue = hasOverdueTasks(date);

                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border-2 p-3 transition-all ${isTodayDate
                          ? 'border-blue-500 bg-blue-50'
                          : isOverdue
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-white'
                          }`}
                      >
                        <div className="text-center mb-3">
                          <div className="text-xs font-medium text-gray-600">
                            {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                          </div>
                          <div className={`text-2xl font-bold ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
                            {date.getDate()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {dayTasks.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => setSelectedDate(date)}
                              className={`w-full text-left text-xs px-2 py-2 rounded border transition-all hover:shadow-md ${task.completed
                                ? 'bg-green-100 text-green-800 border-green-200 line-through'
                                : getPriorityColor(task.priority)
                                }`}
                            >
                              <div className="font-medium truncate">{task.title}</div>
                              {task.description && (
                                <div className="text-xs opacity-75 truncate mt-1">
                                  {task.description}
                                </div>
                              )}
                            </button>
                          ))}
                          {dayTasks.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-4">
                              Sin tareas
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Leyenda</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 border-2 border-red-300 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Prioridad Alta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Prioridad Media</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Prioridad Baja</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 border-2 border-green-200 rounded line-through"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Completada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Día actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-50 border-2 border-red-200 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Tareas vencidas</span>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {tasks.filter(t => !t.deleted && t.dueDate).length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No hay tareas con fecha</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Las tareas que agregues con fecha límite aparecerán aquí en el calendario.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Mini Calendar */}
            <MiniCalendar
              currentDate={currentDate}
              onDateChange={(date) => {
                setCurrentDate(date);
                setSelectedDate(date);
              }}
              tasks={tasks}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={goToToday}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ir a Hoy
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Agregar Tarea
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Próximas Tareas</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tasks
                  .filter(t => !t.deleted && !t.completed && t.dueDate)
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 5)
                  .map(task => {
                    const isTaskOverdue = isOverdue(task.dueDate);
                    const [year, month, day] = task.dueDate.split('-').map(Number);
                    const dueDate = new Date(year, month - 1, day);

                    return (
                      <div
                        key={task.id}
                        className={`p-2 rounded-lg border text-xs ${isTaskOverdue
                          ? 'bg-red-50 border-red-200'
                          : getPriorityColor(task.priority)
                          }`}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {dueDate.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      </div>
                    );
                  })}
                {tasks.filter(t => !t.deleted && !t.completed && t.dueDate).length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No hay tareas pendientes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Day Modal */}
        {selectedDate && (
          <DayModal
            date={selectedDate}
            tasks={getTasksForDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
            onTasksUpdate={loadTasks}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
