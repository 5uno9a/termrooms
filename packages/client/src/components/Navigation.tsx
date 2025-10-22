import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/library', label: 'Game Library' },
    { path: '/sandbox', label: 'Dev Sandbox' },
    { path: '/room', label: 'Game Room' },
    { path: '/docs', label: 'Documentation' },
    { path: '/help', label: 'Help' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav 
      className="bg-black bg-opacity-90 backdrop-blur-xl border-b border-white border-opacity-20"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2 md:space-x-12">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold text-white tracking-wide"
              aria-label="TermRooms - Go to homepage"
            >
              TermRooms
            </Link>
            
            <div className="hidden md:flex space-x-2" role="menubar">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white hover:text-white hover:bg-white hover:bg-opacity-10 hover:shadow-md'
                  }`}
                  role="menuitem"
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-8">
            <span 
              className="text-sm text-white font-medium hidden sm:block"
              aria-label="Current user: Guest User"
            >
              Guest User
            </span>
            <Button 
              variant="primary" 
              size="sm" 
              className="md:!px-4 md:!py-3 md:!text-sm"
              aria-label="Sign in to your account"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
