import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon } from '@heroicons/react/outline';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <ClipboardListIcon className="h-5 w-5 text-slate-900" />
                            </div>
                            <span className="text-lg font-semibold text-white">TaskManager</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Sistema profesional de gestión de tareas y proyectos para empresas modernas.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/tasks" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Tareas
                                </Link>
                            </li>
                            <li>
                                <Link to="/calendar" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Calendario
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Acerca de
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Contacto</h3>
                        <p className="text-sm text-gray-400 mb-3">
                            Soporte disponible
                        </p>
                        <a
                            href="mailto:soporte@taskmanager.com"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            fabianroqueminaya@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-800 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} TaskManager. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
