import React, { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle, Shield, Mail, Calendar, User, Search, Edit2, Trash2, X, Save, Search } from 'lucide-react';
import API from '../../api/axios'; 

export default function UserInsights() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- STATE UNTUK EDIT USER ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

useEffect(() => {
    fetchUsers();
  }, []);
  
 const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Backend akan membaca Token JWT dari Header secara otomatis melalui axios interceptor
      const response = await API.get('/users');
      const data = response.data;
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Sesi Anda telah berakhir atau akses ditolak.');
        setTimeout(() => {
          // Bersihkan storage dan lempar ke login admin
          localStorage.removeItem('token');
          localStorage.removeItem('growpath_user');
          window.location.href = '/login-admin';
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PERBAIKAN: Logout JWT (Tidak perlu hit API backend)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('growpath_user');
    window.location.href = '/login-admin';
  };

  const handleExportCSV = () => {
    if (users.length === 0) return;

    const csvContent = [
      ['ID', 'Nama', 'Email', 'Role', 'Created At'],
      ...users.map(user => [
        user.id || user._id,
        user.name || 'N/A',
        user.email || 'N/A',
        user.role || 'user',
        user.created_at || user.createdAt || 'N/A'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-insights-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user'
    });
    setIsEditOpen(true);
  };

  const closeEditForm = () => {
    setIsEditOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsSaving(true);
      const userId = editingUser.id || editingUser._id;
      
      await API.put(`/users/${userId}`, formData);
      
      setUsers(users.map(u => 
        (String(u.id || u._id) === String(userId)) ? { ...u, ...formData } : u
      ));
      
      closeEditForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memperbarui data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;
    
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter(u => String(u.id || u._id) !== String(id)));
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Margin diseragamkan dengan menambahkan w-full max-w-7xl mx-auto agar fit in
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 p-4 md:p-8">
      
      {/* ========================================= */}
      {/* HEADER SECTION */}
      {/* ========================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Insights</h1>
          <p className="text-slate-400 text-sm mt-1">
            Menampilkan total <span className="text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded-md">{users.length}</span> pengguna terdaftar
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#0B172E] border border-[#1E2A45] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-full"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            disabled={users.length === 0 || loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Download size={16} strokeWidth={2.5} />
            <span className="inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* ERROR / EXPIRED STATE */}
      {/* ========================================= */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Ikon Error Diperbarui dengan background & highlight */}
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0 border border-red-500/30">
              <AlertCircle className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-400 text-base mb-1">Gagal memuat data</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
          {sessionExpired && (
            <button onClick={handleLogout} className="whitespace-nowrap px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20">
              Logout Sekarang
            </button>
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* FORM EDIT MODAL */}
      {/* ========================================= */}
      {isEditOpen && editingUser && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 mb-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {/* Ikon Header Edit Modal Diperbarui dengan background & highlight */}
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <User className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              Edit Data Pengguna
            </h2>
            <button onClick={closeEditForm} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl transition-colors border border-[#1E2A45]">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hak Akses (Role)</label>
              <select 
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User (Student)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-3 flex justify-end gap-3 border-t border-[#1E2A45] pt-6 mt-2">
              <button type="button" onClick={closeEditForm} className="px-6 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 font-bold rounded-xl transition-colors border border-[#1E2A45]">
                Batal
              </button>
              <button type="submit" disabled={isSaving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================= */}
      {/* MAIN DATA TABLE */}
      {/* ========================================= */}
      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden relative min-h-[400px]">
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B172E]/80 backdrop-blur-sm z-20">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
            <p className="text-sm font-bold tracking-wider uppercase text-slate-400">Memuat Data...</p>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse min-w-[900px]">
            <thead className="bg-[#0F1B33]">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45] w-24">ID</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Pengguna</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Informasi Kontak</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Role</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-[#1E2A45]">Tgl Daftar</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider text-right border-b border-[#1E2A45]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A45]">
              {!loading && filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || user._id || index} className="hover:bg-[#0F1B33] transition-colors group">
                    {/* ID */}
                    <td className="px-8 py-5">
                      <span className="text-slate-500 font-mono text-xs font-bold">
                        #{String(index + 1).padStart(4, '0')}
                      </span>
                    </td>
                    
                    {/* Name & Avatar */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#071226] border border-[#1E2A45] flex items-center justify-center text-blue-400 font-bold text-sm shadow-inner shrink-0">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {user.name || 'No Name'}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <Mail size={14} className="text-slate-500" />
                        {user.email || '—'}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${
                        user.role?.toLowerCase() === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-[#071226] text-slate-300 border-[#1E2A45]'
                      }`}>
                        {user.role?.toLowerCase() === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {user.role || 'user'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Calendar size={14} className="text-slate-500" />
                        {user.created_at || user.createdAt ? new Date(user.created_at || user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </div>
                    </td>

                    {/* ACTIONS (Edit & Delete) */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(user)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-blue-500/30"
                          title="Edit Pengguna"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id || user._id)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-red-500/30"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : !loading && filteredUsers.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {/* Ikon Empty State Diperbarui dengan background & highlight */}
                      <div className="w-20 h-20 bg-[#071226] rounded-2xl flex items-center justify-center mb-5 border border-[#1E2A45] shadow-lg">
                        <Search size={32} className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]" />
                      </div>
                      <p className="text-slate-300 font-bold text-lg mb-1">Tidak ada data pengguna</p>
                      {searchQuery && (
                        <p className="text-slate-500 text-sm">Pencarian "{searchQuery}" tidak membuahkan hasil.</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {!loading && (
          <div className="px-8 py-5 border-t border-[#1E2A45] bg-[#0F1B33] flex items-center justify-between text-xs font-bold text-slate-500">
            <div>Menampilkan {filteredUsers.length} data</div>
            {users.length > 0 && searchQuery && (
              <div>Difilter dari total {users.length} pengguna</div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}