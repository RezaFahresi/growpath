import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Import context kita

export default function AdminRoute({ children }) {
  const { user, loading } = useAppContext();
  const location = useLocation();
  const adminToken = localStorage.getItem('token'); // SEMUA auth sekarang pakai token

  // 1. Tunggu proses verifikasi selesai
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Cek apakah ada sesi login (Token & User)
  if (!adminToken || !user) {
    console.warn("Tidak ada sesi login. Lempar ke /login-admin");
    return <Navigate to="/login-admin" state={{ from: location }} replace />;
  }

  // 3. PROTEKSI KEAMANAN EKSTRA: Pastikan rolenya benar-benar Admin
  // Mencegah User biasa yang nakal mengetik URL /admin di browser
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    console.error("Akses Ditolak: Anda bukan Admin! Melempar ke dashboard user.");
    return <Navigate to="/dashboard" replace />;
  }

  // Jika token valid dan role-nya admin, izinkan masuk
  return children;
}