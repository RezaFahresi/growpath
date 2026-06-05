import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const context = useAppContext();

  // Jika konteks belum siap atau user null, lempar ke login
  if (!context || !context.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    // Memastikan background utama menggunakan slate-50 yang bersih
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}