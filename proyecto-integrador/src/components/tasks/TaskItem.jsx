import React from 'react';
import { PencilIcon, TrashIcon, CheckIcon, CalendarIcon } from '@heroicons/react/outline';
import { formatDate } from '../../utils/dateUtils';

const TaskItem = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  deleteMode,
  isSelected,
  onSelect
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'trabajo':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'universidad':
        return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
      case 'personal':
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  return (
    <div
      onClick={() => !deleteMode && onSelect && onSelect(task)}
      className={`group relative p-5 rounded-2xl transition-all duration-200 border cursor-pointer ${task.completed
        ? 'bg-gray-50 border-gray-100'
        : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5'
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          {deleteMode ? (
            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(task.id)}
                className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all cursor-pointer"
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-all duration-200 ${task.completed
                ? 'bg-green-500 border-green-500 text-white scale-100'
                : 'bg-transparent border-gray-300 text-transparent hover:border-blue-400'
                }`}
            >
              <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold truncate pr-2 transition-colors ${task.completed ? 'text-gray-400 line-through decoration-2 decoration-gray-200' : 'text-gray-900'
              }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm leading-relaxed ${task.completed ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {task.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(task.category)}`}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>

              {task.dueDate && (
                <div className={`flex items-center text-xs font-medium ${task.completed ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                  {formatDate(task.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {!deleteMode && !task.completed && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:self-start">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
