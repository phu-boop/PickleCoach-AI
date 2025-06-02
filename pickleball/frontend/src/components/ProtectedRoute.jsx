// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { role, token } = useAuth();

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Kiểm tra vai trò người dùng
  const userRoles = role ? role.split(',') : [];
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/login" replace />; // Hoặc /unauthorized nếu có trang 403
  }

  return children;
}

export default ProtectedRoute;
