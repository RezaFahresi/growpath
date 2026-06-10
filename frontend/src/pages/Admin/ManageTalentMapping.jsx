import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import API from '../../api/axios'; // Pastikan path ini benar sesuai struktur Anda

export default function ManageTalentMapping() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null); // Menyimpan ID user yang sedang diedit
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    performance: 'Medium',
    potential: 'Medium',
    image: ''
  });

  // 1. AMBIL DATA DARI DATABASE SAAT HALAMAN DIBUKA
  const fetchTalents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/talent-mapping');
      setTalents(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  // 2. FUNGSI UNTUK MEMBUKA FORM EDIT
  const handleEditClick = (talent) => {
    setFormData({
      name: talent.name || '',
      role: talent.role || '',
      department: talent.department || 'General',
      performance: talent.performance || 'Medium',
      potential: talent.potential || 'Medium',
      image: talent.image || ''
    });
    setEditId(talent.id);
    setIsAdding(true);
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. FUNGSI SUBMIT (Bisa untuk Edit / Tambah Baru)
  const handleSubmit = async () => {
    if (!formData.name) return alert("Nama harus diisi!");

    try {
      if (editId) {
        // PROSES EDIT (PUT)
        await API.put(`/talent-mapping/${editId}`, formData);
        alert("Data berhasil diupdate!");
      } else {
        // PROSES TAMBAH (POST) - Opsional jika Anda punya rute POST
        // await API.post('/talent-mapping', formData);
        alert("Fungsi tambah manual sedang disiapkan.");
      }
      
      // Reset form dan reload data
      setIsAdding(false);
      setEditId(null);
      setFormData({ name: '', role: '', department: '', performance: 'Medium', potential: 'Medium', image: '' });
      fetchTalents(); 

    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  // 4. FUNGSI HAPUS (DELETE)
  const handleDeleteClick = async (id, name) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus data talenta atas nama ${name}?`);
    
    if (isConfirmed) {
      try {
        await API.delete(`/talent-mapping/${id}`);
        // Hilangkan dari tampilan tanpa perlu reload halaman
        setTalents(talents.filter(t => t.id !== id));
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Terjadi kesalahan saat menghapus data.");
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditId(null);
    setFormData({ name: '', role: '', department: '', performance: 'Medium', potential: 'Medium', image: '' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Talent Mapping</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data talenta, evaluasi performa, dan potensi karyawan.</p>
        </div>
      </div>

      {/* ================= FORM PANEL (TAMBAH/EDIT) ================= */}
      {isAdding && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <LucideIcons.Users className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              {editId ? 'Edit Data Talenta' : 'Registrasi Talenta Baru'}
            </h2>
            <button onClick={handleCancel} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl transition-colors border border-[#1E2A45]">
              <LucideIcons.X size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Kolom Upload Foto */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Foto Profil</label>
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#1E2A45] flex items-center justify-center overflow-hidden bg-[#071226] group relative cursor-pointer hover:border-blue-500 transition-colors" onClick={() => fileInputRef.current.click()}>
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <LucideIcons.Edit2 size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-400 transition-colors">
                    <LucideIcons.Upload size={28} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
            </div>

            {/* Kolom Input Form */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departemen</label>
                <input 
                  type="text" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium" 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})} 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posisi / Peran</label>
                <input 
                  type="text" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kinerja (Performance)</label>
                <select 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium appearance-none cursor-pointer"
                  value={formData.performance}
                  onChange={e => setFormData({...formData, performance: e.target.value})}
                >
                  <option value="Low">Low Performance</option>
                  <option value="Medium">Medium Performance</option>
                  <option value="High">High Performance</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potensi (Potential)</label>
                <select 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium appearance-none cursor-pointer"
                  value={formData.potential}
                  onChange={e => setFormData({...formData, potential: e.target.value})}
                >
                  <option value="Low">Low Potential</option>
                  <option value="Medium">Medium Potential</option>
                  <option value="High">High Potential</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#1E2A45] pt-6">
            <button onClick={handleCancel} className="px-8 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 font-bold rounded-xl transition-colors border border-[#1E2A45]">
              Batal
            </button>
            <button onClick={handleSubmit} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              {editId ? 'Simpan Perubahan' : 'Simpan Data Baru'}
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE LIST ================= */}
      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-[#1E2A45] flex items-center justify-between bg-[#0F1B33]">
          <h2 className="font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[#071226] border border-[#1E2A45] rounded-lg shadow-sm">
              <LucideIcons.Network size={18} className="text-blue-400" />
            </div>
            Database Talenta (9-Box Grid)
          </h2>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
            {talents.length} Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-slate-400">Memuat data...</div>
          ) : (
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead className="bg-[#0B172E]">
                <tr>
                  <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Karyawan</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Departemen</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Metrik 9-Box</th>
                  <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider text-right border-b border-[#1E2A45]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A45]">
                {talents.length > 0 ? (
                  talents.map(talent => (
                    <tr key={talent.id} className="hover:bg-[#0F1B33] transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#071226] overflow-hidden shrink-0 border border-[#1E2A45]">
                          <img src={talent.image || 'https://via.placeholder.com/150'} alt={talent.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{talent.name}</div>
                          <div className="text-slate-500 text-xs mt-1 font-medium">{talent.role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 bg-[#071226] text-slate-300 rounded-lg text-xs font-bold border border-[#1E2A45]">
                          {talent.department || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-2 text-xs font-bold">
                            <LucideIcons.Shield size={14} className={talent.performance === 'High' ? 'text-emerald-400' : talent.performance === 'Medium' ? 'text-blue-400' : 'text-orange-400'} />
                            <span className="text-slate-400">Perf:</span> <span className="text-white">{talent.performance}</span>
                          </span>
                          <span className="flex items-center gap-2 text-xs font-bold">
                            <LucideIcons.TrendingUp size={14} className={talent.potential === 'High' ? 'text-emerald-400' : talent.potential === 'Medium' ? 'text-blue-400' : 'text-orange-400'} />
                            <span className="text-slate-400">Pot:</span> <span className="text-white">{talent.potential}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditClick(talent)} className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45]" title="Edit">
                            <LucideIcons.Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteClick(talent.id, talent.name)} className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-[#1E2A45]" title="Hapus">
                            <LucideIcons.Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-[#071226] rounded-2xl flex items-center justify-center mb-5 border border-[#1E2A45]">
                          <LucideIcons.Search size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-300 font-bold text-lg mb-1">Belum ada data talenta.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}