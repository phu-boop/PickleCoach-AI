// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

function ProtectedRoute({ children, requiredRole }) {
  const { role, token } = useAuth();

  // Hàm chuẩn hóa vai trò (thêm "ROLE_" nếu chưa có)
  const normalizeRole = (roleStr) => {
    if (!roleStr) return null;
    return roleStr.startsWith('ROLE_') ? roleStr : `ROLE_${roleStr}`;
  };

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!token) {
    Swal.fire({
      title: "Unauthorized",
      text: "You need to log in to access this page.",
      icon: "error",
      draggable: true,
    });
    return <Navigate to="/login" replace />;
  }

  // Chuẩn hóa role từ AuthContext
  const userRoles = role ? role.split(',').map(normalizeRole) : [];
  // Chuẩn hóa requiredRole
  const normalizedRequiredRole = normalizeRole(requiredRole);

  // Kiểm tra vai trò người dùng
  if (normalizedRequiredRole && !userRoles.some((r) => r === normalizedRequiredRole)) {
    Swal.fire({
      title: "Access Denied",
      text: `You do not have the required role (${requiredRole}) to access this page.`,
      icon: "warning",
      draggable: true,
    });
    return <Navigate to="/login" replace />; // Hoặc /unauthorized nếu có trang 403
  }

  return children;
}

export default ProtectedRoute;