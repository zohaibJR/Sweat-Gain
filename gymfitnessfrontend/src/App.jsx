import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import NavBar from './Components/NavBar';
import Login          from './Pages/Login';
import Signup         from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword  from './Pages/ResetPassword';
import DashBoard      from './Pages/DashBoard';
import AttendenceForm from './Components/AttendenceForm/AttendenceForm';
import Records        from './Pages/Records';
import Pricing        from './Pages/Pricing';
import GoalTracker    from './Pages/GoalTracker';
import AdminPanel     from './Pages/AdminPanel';
import Aboutus        from './Pages/Aboutus';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

// Hides NavBar on public pages (login / signup / admin)
function AppContent() {
  const location   = useLocation();
  const hiddenPaths = ['/', '/signup', '/forgot-password', '/reset-password', '/admin'];
  const showNavBar  = !hiddenPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        {/* Public */}
        <Route path="/"       element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected */}
        <Route path="/dashboard"  element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        <Route path="/attendence" element={<ProtectedRoute><AttendenceForm /></ProtectedRoute>} />
        <Route path="/records"    element={<ProtectedRoute><Records /></ProtectedRoute>} />
        <Route path="/about"      element={<ProtectedRoute><Aboutus /></ProtectedRoute>} />
        <Route path="/pricing"    element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
        <Route path="/goals"      element={<ProtectedRoute><GoalTracker /></ProtectedRoute>} />

        {/* Admin — has its own login screen inside */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Fallback → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
