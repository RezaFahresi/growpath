import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const location = useLocation();
  
  // Kita tidak lagi menggunakan token. 
  // Kita mengecek data profil sebagai indikator bahwa user sudah login.
  const adminData = localStorage.getItem('adminData');

  // DEBUG: Pantau status login di console
  console.log("Admin Session Status:", adminData ? "Active" : "Logged Out");

  if (!adminData) {
    // Jika data admin tidak ada di storage, arahkan ke login.
    // Replace digunakan agar user tidak bisa menekan tombol 'back' ke halaman terproteksi.
    return <Navigate to="/login-admin" state={{ from: location }} replace />;
  }

  // Jika session indikator ada, tampilkan halaman admin
  return children;
}