import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
//PERBAIKAN: Semua ikon yang digunakan di bawah sekarang sudah di-import dengan benar
import { Trash2, Plus, Edit2, X, Upload, Network, Search, Users, Shield, TrendingUp } from 'lucide-react';

export default function ManageTalentMapping() {
  const { talentMappings, addTalentMapping, deleteTalentMapping, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newTalent, setNewTalent] = useState({
    name: '',
    role: '',
    department: '',
    performance: 'Medium',
    potential: 'Medium',
    image: ''
  });

  const handleAdd = () => {
    if (newTalent.name && newTalent.role) {
      addTalentMapping({ 
        ...newTalent, 
        id: Date.now(), // ID sementara
        image: newTalent.image || 'https://via.placeholder.com/150' 
      });
      setIsAdding(false);
      setNewTalent({ name: '', role: '', department: '', performance: 'Medium', potential: 'Medium', image: '' });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewTalent({ ...newTalent, image: imageUrl });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Talent Mapping</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data talenta, evaluasi performa, dan potensi karyawan.</p>
        </div>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/30 font-bold text-sm"
          >
            <Plus size={18} strokeWidth={2.5} /> Tambah Talenta Baru
          </button>
        )}
      </div>

      {/* ================= FORM PANEL ================= */}
      {isAdding && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <Users className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              Registrasi Talenta Baru
            </h2>
            <button onClick={() => setIsAdding(false)} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl transition-colors border border-[#1E2A45]">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Kolom Upload Foto */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Foto Profil</label>
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#1E2A45] flex items-center justify-center overflow-hidden bg-[#071226] group relative cursor-pointer hover:border-blue-500 transition-colors" onClick={() => fileInputRef.current.click()}>
                {newTalent.image ? (
                  <>
                    <img src={newTalent.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Edit2 size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-400 transition-colors">
                    <Upload size={28} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Kolom Input Form */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Ex: John Doe" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                  value={newTalent.name} 
                  onChange={e => setNewTalent({...newTalent, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departemen</label>
                <input 
                  type="text" 
                  placeholder="Ex: Engineering" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                  value={newTalent.department} 
                  onChange={e => setNewTalent({...newTalent, department: e.target.value})} 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posisi / Peran</label>
                <input 
                  type="text" 
                  placeholder="Ex: Senior Frontend Developer" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                  value={newTalent.role} 
                  onChange={e => setNewTalent({...newTalent, role: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kinerja (Performance)</label>
                <select 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium appearance-none cursor-pointer"
                  value={newTalent.performance}
                  onChange={e => setNewTalent({...newTalent, performance: e.target.value})}
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
                  value={newTalent.potential}
                  onChange={e => setNewTalent({...newTalent, potential: e.target.value})}
                >
                  <option value="Low">Low Potential</option>
                  <option value="Medium">Medium Potential</option>
                  <option value="High">High Potential</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#1E2A45] pt-6">
            <button onClick={() => setIsAdding(false)} className="px-8 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 font-bold rounded-xl transition-colors border border-[#1E2A45]">
              Batal
            </button>
            <button onClick={handleAdd} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              Simpan Data
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE LIST ================= */}
      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden min-h-[400px]">
        
        {/* Table Header Wrapper */}
        <div className="p-6 border-b border-[#1E2A45] flex items-center justify-between bg-[#0F1B33]">
          <h2 className="font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[#071226] border border-[#1E2A45] rounded-lg shadow-sm">
              <Network size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            </div>
            Database Talenta (9-Box Grid)
          </h2>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
            {talentMappings.length} Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
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
              {talentMappings.length > 0 ? (
                talentMappings.map(talent => (
                  <tr key={talent.id} className="hover:bg-[#0F1B33] transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#071226] overflow-hidden shrink-0 border border-[#1E2A45] shadow-sm">
                        <img src={talent.image || 'https://via.placeholder.com/150'} alt={talent.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{talent.name}</div>
                        <div className="text-slate-500 text-xs mt-1 font-medium">{talent.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1 bg-[#071226] text-slate-300 rounded-lg text-xs font-bold border border-[#1E2A45]">
                        {talent.department || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-xs font-bold">
                          <Shield size={14} className={talent.performance === 'High' ? 'text-emerald-400' : talent.performance === 'Medium' ? 'text-blue-400' : 'text-orange-400'} />
                          <span className="text-slate-400">Perf:</span> <span className="text-white">{talent.performance}</span>
                        </span>
                        <span className="flex items-center gap-2 text-xs font-bold">
                          <TrendingUp size={14} className={talent.potential === 'High' ? 'text-emerald-400' : talent.potential === 'Medium' ? 'text-blue-400' : 'text-orange-400'} />
                          <span className="text-slate-400">Pot:</span> <span className="text-white">{talent.potential}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-blue-500/30" title="Edit Talenta">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteTalentMapping(talent.id)} className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-red-500/30" title="Hapus Talenta">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-[#071226] rounded-2xl flex items-center justify-center mb-5 border border-[#1E2A45] shadow-lg">
                        <Search size={32} className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]" />
                      </div>
                      <p className="text-slate-300 font-bold text-lg mb-1">Belum ada data talenta.</p>
                      <p className="text-slate-500 text-sm">Klik "Tambah Talenta Baru" untuk memulai pemetaan 9-Box Grid.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}