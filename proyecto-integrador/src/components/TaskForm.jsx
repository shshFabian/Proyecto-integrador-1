import { useState, useEffect } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel, editingTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'personal'
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        category: editingTask.category || 'personal'
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now(),
      completed: editingTask ? editingTask.completed : false,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    };

    onSubmit(taskData);
    
    // Reset form if creating new task
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        category: 'personal'
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="task-form-header">
          <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ingresa el título de la tarea"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los detalles de la tarea"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Fecha Límite *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="personal">Personal</option>
              <option value="trabajo">Trabajo</option>
              <option value="universidad">Universidad</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              {editingTask ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

