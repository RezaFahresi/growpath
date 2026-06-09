import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const context = useAppContext();
  
  //STATE BARU: Mengontrol sidebar di HP dari level Layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!context || !context.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
      
      {/* 🔥 OVERLAY GELAP UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Teruskan state isSidebarOpen ke komponen Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen w-full relative">
        {/* Teruskan fungsi buka sidebar ke Header */}
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Gunakan w-full agar tidak melebihi layar di HP */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}