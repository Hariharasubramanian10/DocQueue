import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClinic } from '../context/ClinicContext';

const Navbar: React.FC = () => {
  const { doctor, logout, isAuthenticated } = useClinic();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path 
    ? "text-blue-600 bg-blue-50" 
    : "text-gray-600 hover:bg-gray-50";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fa-solid fa-user-doctor text-blue-600 text-2xl mr-2"></i>
              <span className="font-bold text-xl text-gray-900">DocQueue</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link to="/" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
                  Dashboard
                </Link>
                <Link to="/records" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/records')}`}>
                  <i className="fa-solid fa-magnifying-glass mr-1"></i> Records
                </Link>
                <Link to="/new" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/new')}`}>
                  <i className="fa-solid fa-plus mr-1"></i> New Appt
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated && doctor ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">Dr. {doctor.name}</span>
                  <span className="text-xs text-gray-500">{doctor.specialty}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <i className="fa-solid fa-sign-out-alt text-xl"></i>
                </button>
              </div>
            ) : (
               <div className="flex gap-2">
                 <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">Login</Link>
                 <span className="text-gray-300">|</span>
                 <Link to="/register" className="text-sm font-medium text-blue-600 hover:text-blue-700">Register</Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;