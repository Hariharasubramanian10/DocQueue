import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NewAppointment from './pages/NewAppointment';
import AppointmentDetails from './pages/AppointmentDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Records from './pages/Records';
import ChatbotAssistant from './components/ChatbotAssistant';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useClinic();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useClinic();
  const location = useLocation();

  // Show global chatbot on pages where a specific context-aware chatbot isn't already present.
  // AppointmentDetails page already has its own instance with specific props.
  const showGlobalChatbot = isAuthenticated && !location.pathname.startsWith('/appointment/');

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/new" element={
            <ProtectedRoute>
              <NewAppointment />
            </ProtectedRoute>
          } />
          
          <Route path="/appointment/:id" element={
            <ProtectedRoute>
              <AppointmentDetails />
            </ProtectedRoute>
          } />

          <Route path="/records" element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {showGlobalChatbot && <ChatbotAssistant />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ClinicProvider>
      <Router>
        <AppContent />
      </Router>
    </ClinicProvider>
  );
};

export default App;