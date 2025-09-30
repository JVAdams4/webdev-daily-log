import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import Navbar from './components/layout/Navbar';
import './App.css';

interface PrivateRouteProps {
  children: React.ReactNode;
  isTeacherRoute?: boolean;
}

const PrivateRoute = ({ children, isTeacherRoute = false }: PrivateRouteProps) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (isTeacherRoute && !user.isTeacher) return <Navigate to="/" />;
    if (!isTeacherRoute && user.isTeacher) return <Navigate to="/teacher" />;
    return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/teacher" element={<PrivateRoute isTeacherRoute={true}><TeacherDashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <div className="container mt-5"><AppRoutes /></div>
    </Router>
  </AuthProvider>
);

export default App;