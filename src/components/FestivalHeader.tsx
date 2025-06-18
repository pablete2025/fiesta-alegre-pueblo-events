
import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Calendar, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const FestivalHeader = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      setShowAdminAccess(true);
    }, 2000); // 2 segundos de mantener pulsado
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-white animate-bounce-gentle" />
            <div>
              <h1 className="text-2xl font-bold text-white">Fiestas Patronales</h1>
              <p 
                className="text-white/90 text-sm cursor-pointer select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
              >
                PEDRAJA DE SAN ESTEBAN
              </p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            {!user ? (
              showAdminAccess && (
                <Link to="/login">
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Administrador
                  </Button>
                </Link>
              )
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-white/90 text-sm">
                  Bienvenido, {user.username}
                </span>
                {isAdmin && location.pathname !== '/admin' && (
                  <Link to="/admin">
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      <Settings className="w-4 h-4 mr-2" />
                      Panel Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default FestivalHeader;
