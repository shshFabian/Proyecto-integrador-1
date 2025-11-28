import { useState, useEffect } from 'react';
import { getTasks } from '../../services/api/tasks';
import StatCard from '../../components/home/StatCard';
import QuickActions from '../../components/home/QuickActions';
import RecentTasks from '../../components/home/RecentTasks';
import UpcomingTasks from '../../components/home/UpcomingTasks';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';
import TaskPreviewModal from '../../components/tasks/TaskPreviewModal';

const PRODUCTIVITY_TIPS = [
  "Haz primero lo difícil: lo que más evitas, hazlo primero.",
  "Empieza aunque no tengas ganas: la acción crea motivación.",
  "No busques perfección: busca avanzar.",
  "Tu ambiente define tu productividad: ordena tu espacio."
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % PRODUCTIVITY_TIPS.length);
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      const mappedTasks = data.map(task => ({
        id: task.id_tarea,
        title: task.titulo,
        description: task.descripcion,
        dueDate: task.fecha_limite,
        completed: task.completada,
        category: task.categoria || 'personal',
        priority: task.prioridad,
        createdAt: task.fecha_creacion
      }));

      setTasks(mappedTasks);
      calculateStats(mappedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = taskList.length;
    const completed = taskList.filter(t => t.completed).length;
    const pending = taskList.filter(t => !t.completed).length;
    const overdue = taskList.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const [year, month, day] = t.dueDate.split('-').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return dueDate < today;
    }).length;

    setStats({ total, completed, pending, overdue });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {getGreeting()} 👋
        </h1>
        <p className="text-gray-600">
          Aquí está el resumen de tus tareas y actividades
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Tareas"
          value={stats.total}
          icon={ClipboardListIcon}
          color="slate"
        />
        <StatCard
          title="Completadas"
          value={stats.completed}
          icon={CheckCircleIcon}
          color="green"
          trend={stats.completed > 0 ? 'up' : null}
          trendValue={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'}
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={ClockIcon}
          color="blue"
        />
        <StatCard
          title="Vencidas"
          value={stats.overdue}
          icon={ExclamationCircleIcon}
          color={stats.overdue > 0 ? "red" : "slate"}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTasks tasks={tasks} onTaskClick={handleTaskClick} />
        <UpcomingTasks tasks={tasks} onTaskClick={handleTaskClick} />
      </div>

      {/* Productivity Tip */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Consejo de Productividad
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              {PRODUCTIVITY_TIPS[currentTipIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Task Preview Modal */}
      {selectedTask && (
        <TaskPreviewModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default Home;
