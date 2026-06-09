import React, { useState } from 'react'; 
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart,
  Settings, Network, Route as RouteIcon, Search, Bell,
  ChevronDown, LogOut
} from 'lucide-react';
import { useAppContext } from '../context/AppContext'; // ✅ Import AppContext
import LogoGrowPath from '../assets/logo-growpath.png';

export default function AdminLayout() {
  // ✅ Ambil data user dan fungsi logout langsung dari Context yang sudah valid
  const { user, logout } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fallback nama jika user masih loading sepersekian detik
  const userName = user?.name || 'Administrator';
  const userRole = user?.role || 'Admin';

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Insights', path: '/admin/users', icon: Users },
    { name: 'Talent Mapping', path: '/admin/talent-mapping', icon: Network },
    { name: 'Career Paths', path: '/admin/courses', icon: RouteIcon },
    { name: 'Assessments', path: '/admin/assessments', icon: ClipboardCheck },
    { name: 'Reports', path: '/admin/reports', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#071226] text-slate-300 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[250px] bg-[#0F1B33] border-r border-[#1E2A45] flex flex-col h-screen sticky top-0">
        <div className="h-20 px-6 flex items-center border-b border-[#1E2A45]">
          <div className="flex items-center gap-3">
            <img src={LogoGrowPath} alt="GrowPath" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-white">GrowPath</h1>
              <p className="text-xs text-slate-400">Career Development</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3">Menu</p>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-[#162544] hover:text-white'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-[#1E2A45] flex flex-col gap-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 px-4 rounded-xl transition-all font-medium border border-red-500/20 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-[#091529] border-b border-[#1E2A45] flex items-center justify-between px-8 relative z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <div className="hidden md:flex items-center bg-[#0F1B33] border border-[#1E2A45] rounded-full px-4 h-11 w-[320px]">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Cari user, skill, atau laporan..." className="bg-transparent outline-none border-none text-sm text-white placeholder:text-slate-500 ml-3 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>

            <div className="relative">
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 cursor-pointer hover:bg-[#0F1B33] p-1.5 pr-3 rounded-full transition-all">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                  <img src={`https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff`} alt={userName} className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
              </div>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-[#0F1B33] border border-[#1E2A45] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-3 border-b border-[#1E2A45] mb-2">
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                      <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold mt-1">{userRole}</p>
                    </div>
                    <div className="px-2">
                      <NavLink to="/admin/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-[#162544] hover:text-white rounded-xl transition-colors">
                        <Settings size={16} className="text-slate-400" /> Pengaturan Akun
                      </NavLink>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left mt-1">
                        <LogOut size={16} /> Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#071226] p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}