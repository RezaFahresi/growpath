import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Import context kita

export default function UserRoute({ children }) {
  const { user, loading } = useAppContext();
  const location = useLocation();
  const userToken = localStorage.getItem('token');

  // 1. Tunggu sampai AppContext selesai memverifikasi token ke backend
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Jika tidak ada token ATAU data user tidak valid/kosong
  if (!userToken || !user) {
    console.warn("Token/User tidak ditemukan, melempar ke /login!");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}