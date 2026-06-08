import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAppContext();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Menunggu AppContext memvalidasi token dan memuat data user
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#090E17] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Cek apakah user sudah login dan memiliki token
  if (!token || !user) {
    return <Navigate to="/login-admin" state={{ from: location }} replace />;
  }

  // RBAC: Hanya admin atau superadmin yang boleh masuk
  const role = user.role?.toLowerCase();
  if (role !== 'admin' && role !== 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}