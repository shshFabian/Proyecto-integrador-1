import { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onToggleComplete, 
  onDeleteSelected,
  onSelectForDeletion,
  selectedForDeletion 
}) => {
  const [isDeletingMode, setIsDeletingMode] = useState(false);

  const handleToggleDeleteMode = () => {
    setIsDeletingMode(!isDeletingMode);
    if (isDeletingMode) {
      // Clear selection when exiting delete mode
      selectedForDeletion.forEach(taskId => onSelectForDeletion(taskId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedForDeletion.length > 0) {
      onDeleteSelected(selectedForDeletion);
      setIsDeletingMode(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletingMode(false);
    // Clear all selections
    selectedForDeletion.forEach(taskId => onSelectForDeletion(taskId));
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task => {
      if (task.completed) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="task-stats">
          <h2>Mis Tareas</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.overdue}</span>
              <span className="stat-label">Vencidas</span>
            </div>
          </div>
        </div>

        <div className="task-actions">
          {isDeletingMode ? (
            <div className="delete-actions">
              <span className="selected-count">
                {selectedForDeletion.length} seleccionadas
              </span>
              <button 
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
                disabled={selectedForDeletion.length === 0}
              >
                Eliminar Seleccionadas
              </button>
              <button 
                className="cancel-delete-btn"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button 
              className="delete-mode-btn"
              onClick={handleToggleDeleteMode}
            >
              🗑️ Modo Eliminación
            </button>
          )}
        </div>
      </div>

      <div className="task-list-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No hay tareas</h3>
            <p>¡Crea tu primera tarea para comenzar!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleComplete={onToggleComplete}
                onSelectForDeletion={onSelectForDeletion}
                isSelectedForDeletion={selectedForDeletion.includes(task.id)}
                isDeletingMode={isDeletingMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

