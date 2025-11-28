import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, HomeIcon, ClipboardListIcon, CalendarIcon, UserCircleIcon } from '@heroicons/react/outline';

import LogoIcon from '../common/LogoIcon';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Inicio', icon: HomeIcon },
    { path: '/tasks', label: 'Tareas', icon: ClipboardListIcon },
    { path: '/calendar', label: 'Calendario', icon: CalendarIcon },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 flex items-center justify-center text-slate-900">
                <LogoIcon className="w-full h-full" />
              </div>
              <span className="text-xl font-semibold text-slate-900 hidden sm:block">TaskManager</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-12 space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${active
                      ? 'text-slate-900'
                      : 'text-gray-600 hover:text-slate-900'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Profile Button - Desktop */}
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-slate-900 transition-colors">
              <UserCircleIcon className="h-5 w-5" />
              <span>Mi Perfil</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-slideUp overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${active
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-slate-900 transition-all">
              <UserCircleIcon className="h-5 w-5" />
              <span>Mi Perfil</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
