import React from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationIcon } from '@heroicons/react/outline';
import { isOverdue } from '../../utils/dateUtils';

const CalendarStats = ({ tasks, currentMonth, currentYear }) => {
  const monthTasks = tasks.filter(task => {
    if (!task.dueDate || task.deleted) return false;
    // Parse date manually to avoid timezone issues
    const [year, month, day] = task.dueDate.split('-').map(Number);
    const taskDate = new Date(year, month - 1, day);
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });

  const completed = monthTasks.filter(t => t.completed).length;
  const pending = monthTasks.filter(t => !t.completed).length;

  const overdue = monthTasks.filter(t => {
    if (t.completed) return false;
    return isOverdue(t.dueDate);
  }).length;

  const stats = [
    {
      label: 'Completadas',
      value: completed,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Pendientes',
      value: pending,
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Vencidas',
      value: overdue,
      icon: ExclamationIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4 transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarStats;
