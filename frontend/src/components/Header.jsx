import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, LogOut, Menu, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; //Tambahkan useLocation
import { useAppContext } from '../context/AppContext';

export default function Header({ onOpenSidebar }) {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation(); //Untuk membaca posisi halaman saat ini

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FUNGSI SEARCH PINTAR (CONTEXT-AWARE)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const currentPath = location.pathname;
    const encodedQuery = encodeURIComponent(searchQuery);

    // Cek pengguna sedang berada di halaman mana
    if (currentPath.includes('/dashboard/assessments')) {
      navigate(`/dashboard/assessments?search=${encodedQuery}`);
    } else if (currentPath.includes('/dashboard/roadmap')) {
      navigate(`/dashboard/roadmap?search=${encodedQuery}`);
    } else {
      // Default: Lempar ke halaman Courses
      navigate(`/dashboard/courses?search=${encodedQuery}`);
    }
  };

  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 border-b border-slate-100 w-full">
      <div className="flex items-center gap-3 w-full max-w-md">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>

        <form onSubmit={handleSearch} className="relative w-full group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5D5FEF] transition-colors" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-sm font-medium text-slate-700"
            placeholder="Search courses or skills..."
          />
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        <button className="sm:hidden p-2 text-slate-400 hover:text-[#5D5FEF] hover:bg-indigo-50 rounded-full transition-all">
          <Search size={20} />
        </button>

        <button className="relative p-2 text-slate-400 hover:text-[#5D5FEF] hover:bg-indigo-50 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 lg:gap-3 hover:bg-slate-50 p-1 lg:p-1.5 lg:pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all group focus:outline-none"
          >
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-tr from-[#5D5FEF] to-indigo-400 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow shrink-0 overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-bold text-slate-700 leading-tight">
                {user?.name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
                {user?.role || 'Student'}
              </p>
            </div>
            
            <ChevronDown size={16} className={`text-slate-400 hidden sm:block transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-slate-600' : 'group-hover:text-slate-600'}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 border-b border-slate-50 mb-1">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User Profile'}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard/profile'); }} className="w-full text-left px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-[#5D5FEF] flex items-center gap-3 transition-colors">
                <User size={16} /> Profil Saya
              </button>
              <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard/settings'); }} className="w-full text-left px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-[#5D5FEF] flex items-center gap-3 transition-colors">
                <Settings size={16} /> Pengaturan
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button onClick={logout} className="w-full text-left px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors group">
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Keluar Akun
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}