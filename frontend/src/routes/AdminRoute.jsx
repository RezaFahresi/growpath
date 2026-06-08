import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAppContext();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // 1. Tunggu AppContext selesai memuat data
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#090E17] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. CEK SESI: Jika tidak ada token atau tidak ada data user, lempar ke login admin
  if (!token || !user) {
    console.warn("User belum login atau token hilang. Redirect ke /login-admin");
    return <Navigate to="/login-admin" state={{ from: location }} replace />;
  }

  // 3. CEK ROLE: Pastikan role-nya adalah admin atau superadmin
  const role = user.role?.toLowerCase();
  if (role !== 'admin' && role !== 'superadmin') {
    console.error("Akses Ditolak: Anda tidak memiliki wewenang admin.");
    // Lempar ke dashboard umum agar tidak terjadi loop redirect
    return <Navigate to="/dashboard" replace />;
  }

  // Jika semua lolos, berikan akses ke children (dashboard admin)
  return children;
}