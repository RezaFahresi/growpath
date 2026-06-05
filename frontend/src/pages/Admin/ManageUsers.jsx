import React from 'react';
import { MoreVertical, Search, Filter, Shield, User, Mail, Calendar, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function ManageUsers() {
  const { user } = useAppContext();

  // Double check RBAC - only SuperAdmin should access this
  if (user?.role !== 'SuperAdmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Mengubah 'interest' menjadi 'access' agar sesuai dengan header kolom
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Learner', joined: 'Oct 24, 2023', access: 'Restricted' },
    { id: 2, name: 'Admin Frontend', email: 'frontend@growpath.com', role: 'Admin', joined: 'Sep 12, 2023', access: 'Frontend Dept' },
    { id: 3, name: 'Super Admin', email: 'admin@growpath.com', role: 'SuperAdmin', joined: 'Aug 01, 2023', access: 'Full System' },
    { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Learner', joined: 'Nov 05, 2023', access: 'Restricted' },
  ];

  return (
    // Margin diseragamkan dengan menambahkan w-full max-w-7xl mx-auto p-4 md:p-8 agar fit in
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Ikon Header Diperbarui dengan background & highlight */}
          <div className="p-3 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-lg shrink-0">
            <Users className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-slate-400 text-sm mt-1">Manage system users, roles, and access permissions.</p>
          </div>
        </div>
        
        {/* Toolbar: Search & Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2.5 bg-[#0B172E] border border-[#1E2A45] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-full sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F1B33] border border-[#1E2A45] hover:bg-[#1E2A45] text-slate-300 rounded-xl text-sm font-bold transition-colors">
            <Filter size={16} className="text-blue-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse min-w-[900px]">
            <thead className="bg-[#0F1B33]">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">User Details</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">System Role</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Management Access</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Date Joined</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider text-right border-b border-[#1E2A45]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A45]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#0F1B33] transition-colors group">
                  
                  {/* User Column */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar diselaraskan dengan tema navy gelap */}
                      <div className="w-10 h-10 rounded-full bg-[#071226] border border-[#1E2A45] flex items-center justify-center text-blue-400 font-bold text-sm shadow-inner shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 font-medium">
                          <Mail size={12} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Role Column */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${
                        u.role === 'SuperAdmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : u.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-[#071226] text-slate-300 border-[#1E2A45]'
                      }`}>
                        {u.role === 'SuperAdmin' ? <Shield size={12} /> 
                        : u.role === 'Admin' ? <Shield size={12} /> 
                        : <User size={12} />}
                        {u.role}
                      </span>
                    </div>
                  </td>
                  
                  {/* Access Column */}
                  <td className="px-6 py-5 font-medium text-slate-400">
                    <span className="bg-[#071226] px-3 py-1.5 rounded-lg text-xs border border-[#1E2A45]">
                      {u.access}
                    </span>
                  </td>
                  
                  {/* Joined Column */}
                  <td className="px-6 py-5 text-slate-400">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Calendar size={14} className="text-slate-500" />
                      {u.joined}
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-blue-500/30 outline-none focus:ring-2 focus:ring-blue-500/50">
                      <MoreVertical size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Visual Only) */}
        <div className="px-8 py-5 border-t border-[#1E2A45] bg-[#0F1B33] flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 gap-4">
          <div>
            Showing <span className="text-white">1</span> to <span className="text-white">{users.length}</span> of <span className="text-white">{users.length}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[#1E2A45] rounded-xl text-slate-400 hover:bg-[#1E2A45] hover:text-white transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-[#1E2A45] rounded-xl text-slate-400 hover:bg-[#1E2A45] hover:text-white transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}