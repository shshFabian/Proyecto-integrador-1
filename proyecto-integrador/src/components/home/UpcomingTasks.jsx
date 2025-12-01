import { CalendarIcon } from '@heroicons/react/outline';
import { formatDate as formatTaskDate } from '../../utils/dateUtils';

const UpcomingTasks = ({ tasks, onTaskClick }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTasks = tasks
    .filter(task => {
      if (task.completed || !task.dueDate) return false;
      const [year, month, day] = task.dueDate.split('-').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return dueDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(...a.dueDate.split('-').map((v, i) => i === 1 ? v - 1 : Number(v)));
      const dateB = new Date(...b.dueDate.split('-').map((v, i) => i === 1 ? v - 1 : Number(v)));
      return dateA - dateB;
    })
    .slice(0, 5);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays <= 7) return `En ${diffDays} días`;

    return formatTaskDate(dateString, {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 transition-colors duration-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Próximas Tareas</h2>

      {upcomingTasks.length === 0 ? (
        <div className="text-center py-8">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No hay tareas próximas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick && onTaskClick(task)}
              className="border-l-4 border-l-blue-500 bg-gray-50 p-3 rounded-r-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 truncate">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap ml-3">
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasks;
