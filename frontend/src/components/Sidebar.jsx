import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Map, BookOpen, TrendingUp, User, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LogoGrowPath from '../assets/logo-growpath.png'; 

export default function Sidebar() {
  const { logout } = useAppContext();
  
  //  STATE BARU: Mengontrol visibilitas sidebar di HP
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Assessment', path: '/dashboard/assessments', icon: FileText },
    { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map },
    { name: 'Course', path: '/dashboard/courses', icon: BookOpen },
    { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
    { name: 'Profil', path: '/dashboard/profile', icon: User },
  ];

  return (
    <>
      {/* 🔥 TOMBOL MENU MOBILE (Hanya tampil di layar kecil) */}
      {/* Tombol ini diposisikan melayang (fixed) di sudut kiri atas layar */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-indigo-950 text-indigo-200 hover:text-white rounded-xl shadow-xl border border-indigo-800/50 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* 🔥 OVERLAY GELAP UNTUK MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🔥 SIDEBAR UTAMA */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-indigo-950 border-r border-indigo-900/50 flex flex-col font-sans shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* BRANDING SECTION */}
        <div className="px-9 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl border border-indigo-800/60 shrink-0 bg-indigo-900">
              <img src={LogoGrowPath} alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">GrowPath</span>
          </div>
          
          {/* 🔥 Tombol Tutup (X) khusus HP */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-indigo-400 hover:text-white p-1 rounded-lg hover:bg-indigo-900/50 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* NAVIGATION MENU */}
        <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-indigo-300/50 mb-4 mt-2">Main Menu</p>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'} 
              onClick={() => setIsOpen(false)} // 🔥 Tutup sidebar otomatis saat menu dipilih (HP)
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden text-left w-full ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 font-bold' 
                    : 'text-indigo-200/70 hover:bg-indigo-900/50 hover:text-white font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                  )}
                  
                  <item.icon 
                    size={20} 
                    className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110 text-indigo-300 group-hover:text-white'}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  <span className="text-[15px] tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER SECTION */}
        <div className="p-5 border-t border-indigo-900/50 bg-indigo-950 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3.5 w-full bg-indigo-900/40 border border-indigo-800/50 rounded-2xl text-indigo-200 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-sm transition-all group font-bold text-left"
          >
            <LogOut size={20} strokeWidth={2} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[15px] tracking-wide">Keluar Akun</span>
          </button>
        </div>

      </aside>
    </>
  );
}