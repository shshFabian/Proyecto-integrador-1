import React from 'react';
import { XIcon, CalendarIcon, TagIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { formatDate } from '../../utils/dateUtils';

const TaskPreviewModal = ({ task, onClose }) => {
    if (!task) return null;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'alta': return 'text-red-600 bg-red-50 border-red-200';
            case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'baja': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };



    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-900/60 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100 relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl leading-6 font-bold text-gray-900 pr-8 break-words">
                                {task.title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-gray-50 rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 absolute top-4 right-4"
                            >
                                <XIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Descripción</h4>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                    {task.description || 'Sin descripción'}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {/* Due Date */}
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(task.dueDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className={`flex items-start gap-3 p-3 rounded-xl border ${getPriorityColor(task.priority)}`}>
                                    <FlagIcon className="h-5 w-5 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium opacity-75 uppercase tracking-wider">Prioridad</p>
                                        <p className="text-sm font-semibold mt-0.5 capitalize">{task.priority || 'Media'}</p>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{task.category || 'Personal'}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`flex items-start gap-3 p-3 rounded-xl border ${task.completed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                                    <CheckCircleIcon className="h-5 w-5 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium opacity-75 uppercase tracking-wider">Estado</p>
                                        <p className="text-sm font-semibold mt-0.5">
                                            {task.completed ? 'Completada' : 'Pendiente'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskPreviewModal;
