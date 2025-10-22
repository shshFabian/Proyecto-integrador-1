import { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onSelectForDeletion,
  isSelectedForDeletion,
  isDeletingMode 
}) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleCompleteToggle = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    onToggleComplete(task.id, newCompletedState);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleSelectForDeletion = () => {
    onSelectForDeletion(task.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (isCompleted) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  };

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      {isDeletingMode && (
        <div className="delete-checkbox">
          <input
            type="checkbox"
            checked={isSelectedForDeletion}
            onChange={handleSelectForDeletion}
          />
        </div>
      )}
      
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            {!isDeletingMode && (
              <>
                <button 
                  className="edit-btn"
                  onClick={handleEdit}
                  title="Editar tarea"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={handleDelete}
                  title="Eliminar tarea"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
        
        <p className="task-description">{task.description}</p>
        
        <div className="task-footer">
          <div className="task-date">
            <span className="date-label">Fecha límite:</span>
            <span className={`date-value ${isOverdue() ? 'overdue' : ''}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          
          <div className="task-status">
            <label className="complete-checkbox">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleCompleteToggle}
              />
              <span className="checkmark"></span>
              <span className="status-text">
                {isCompleted ? 'Completada' : 'Pendiente'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

