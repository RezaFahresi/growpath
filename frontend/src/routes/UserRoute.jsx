import React from 'react';
import { Navigate } from 'react-router-dom';

export default function UserRoute({ children }) {
  const userToken = localStorage.getItem('token');

  // Tambahkan console.log ini untuk mengecek
  console.log("Pengecekan UserRoute - Token LocalStorage:", userToken);

  if (!userToken) {
    console.warn("Token tidak ditemukan, melempar ke /login!");
    return <Navigate to="/login" replace />;
  }

  return children;
}