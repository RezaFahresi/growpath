import React, { useState, useEffect } from 'react';
import { Map, Plus, Trash2, Edit, X, BookOpen, Clock, Target, List, Video, AlertCircle } from 'lucide-react';
import API from '../../api/axios'; 
import Swal from 'sweetalert2';

export default function ManageRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Roadmap
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [roadmapForm, setRoadmapForm] = useState({
    title: '', category: 'Teknologi', description: '', level: 'Beginner',
    est_time: '8 Minggu', icon_name: 'Code2', theme: 'from-slate-800 to-slate-900', border_color: 'border-cyan-500/30'
  });

  // State Modal Modul
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [editingModuleId, setEditingModuleId] = useState(null); // State baru untuk melacak modul yang diedit
  const [moduleForm, setModuleForm] = useState({
    title: '', subtitle: '', video_link: '', step_order: 1
  });

  const darkSwal = {
    background: '#0F1B33',
    color: '#f8fafc',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#1E2A45'
  };

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const res = await API.get('/roadmaps');
      setRoadmaps(res.data);
    } catch (error) {
      console.error("Gagal mengambil roadmaps:", error);
      Swal.fire({ ...darkSwal, title: 'Error', text: 'Gagal memuat data roadmap', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  // --- HANDLER ROADMAP ---
  const handleAddRoadmap = async (e) => {
    e.preventDefault();
    try {
      await API.post('/roadmaps', roadmapForm);
      Swal.fire({ ...darkSwal, icon: 'success', title: 'Berhasil', text: 'Roadmap ditambahkan!', timer: 1500, showConfirmButton: false });
      setIsRoadmapModalOpen(false);
      setRoadmapForm({ title: '', category: 'Teknologi', description: '', level: 'Beginner', est_time: '8 Minggu', icon_name: 'Code2', theme: 'from-slate-800 to-slate-900', border_color: 'border-cyan-500/30' });
      fetchRoadmaps();
    } catch (error) {
      Swal.fire({ ...darkSwal, title: 'Error', text: 'Gagal menambah roadmap', icon: 'error' });
    }
  };

  const handleDeleteRoadmap = async (id) => {
    const result = await Swal.fire({
      ...darkSwal, title: 'Hapus Roadmap?', text: "Semua modul di dalamnya juga akan terhapus!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!'
    });
    if (result.isConfirmed) {
      try {
        await API.delete(`/roadmaps/${id}`);
        Swal.fire({ ...darkSwal, title: 'Terhapus!', text: 'Roadmap telah dihapus.', icon: 'success' });
        fetchRoadmaps();
      } catch (error) {
        Swal.fire({ ...darkSwal, title: 'Error', text: 'Gagal menghapus roadmap', icon: 'error' });
      }
    }
  };

  // --- HANDLER MODUL ---
  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      if (editingModuleId) {
        // Mode Edit
        await API.put(`/roadmaps/modules/${editingModuleId}`, moduleForm);
        Swal.fire({ ...darkSwal, icon: 'success', title: 'Berhasil', text: 'Modul diperbarui!', timer: 1500, showConfirmButton: false });
      } else {
        // Mode Tambah Baru
        await API.post(`/roadmaps/${selectedRoadmapId}/modules`, moduleForm);
        Swal.fire({ ...darkSwal, icon: 'success', title: 'Berhasil', text: 'Modul ditambahkan!', timer: 1500, showConfirmButton: false });
      }
      setIsModuleModalOpen(false);
      setModuleForm({ title: '', subtitle: '', video_link: '', step_order: 1 });
      setEditingModuleId(null);
      fetchRoadmaps();
    } catch (error) {
      Swal.fire({ ...darkSwal, title: 'Error', text: 'Gagal menyimpan modul', icon: 'error' });
    }
  };

  const handleEditModuleClick = (roadmapId, modul) => {
    setSelectedRoadmapId(roadmapId);
    setEditingModuleId(modul.id);
    setModuleForm({
      title: modul.title,
      subtitle: modul.subtitle || '',
      video_link: modul.video_link || '',
      step_order: modul.step_order || 1
    });
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (moduleId) => {
    const result = await Swal.fire({
      ...darkSwal, title: 'Hapus Modul?', text: "Modul ini akan dihapus secara permanen!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!'
    });
    if (result.isConfirmed) {
      try {
        await API.delete(`/roadmaps/modules/${moduleId}`);
        Swal.fire({ ...darkSwal, title: 'Terhapus!', text: 'Modul berhasil dihapus.', icon: 'success' });
        fetchRoadmaps();
      } catch (error) {
        Swal.fire({ ...darkSwal, title: 'Error', text: 'Gagal menghapus modul', icon: 'error' });
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0F1B33] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-inner">
            <Map size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Manajemen Roadmap</h1>
            <p className="text-sm font-medium text-slate-400">Atur jalur karir dan kurikulum pembelajaran user.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsRoadmapModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-900/50 hover:shadow-lg transition-all active:scale-95"
        >
          <Plus size={18} /> Tambah Roadmap
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#1E2A45] border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-[#0F1B33] rounded-[2rem] border-2 border-dashed border-[#1E2A45]">
          <Map size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-bold text-white">Belum ada Roadmap</h3>
        </div>
      ) : (
        <div className="space-y-8">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-[#0F1B33] rounded-[2rem] border border-[#1E2A45] overflow-hidden shadow-lg shadow-black/10">
              
              <div className="p-6 md:p-8 border-b border-[#1E2A45] bg-[#071226] flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase rounded-md tracking-wider">
                      {roadmap.category}
                    </span>
                    <span className="px-3 py-1 bg-[#1E2A45] text-slate-300 text-xs font-bold uppercase rounded-md tracking-wider border border-[#2a3b5c]">
                      {roadmap.level}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{roadmap.title}</h2>
                    <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">{roadmap.description}</p>
                  </div>
                </div>
                <div className="flex items-start shrink-0">
                  <button onClick={() => handleDeleteRoadmap(roadmap.id)} className="p-2 text-red-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors tooltip" title="Hapus Roadmap">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <List size={20} className="text-indigo-400" /> Kurikulum Modul
                  </h3>
                  <button 
                    onClick={() => {
                      setEditingModuleId(null);
                      setSelectedRoadmapId(roadmap.id);
                      setModuleForm({ title: '', subtitle: '', video_link: '', step_order: (roadmap.items || []).length + 1 });
                      setIsModuleModalOpen(true);
                    }}
                    className="text-sm font-bold text-indigo-400 bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Tambah Modul
                  </button>
                </div>

                {(roadmap.items || []).length === 0 ? (
                  <div className="text-center py-8 bg-[#071226] rounded-2xl border border-[#1E2A45]">
                    <p className="text-sm font-medium text-slate-500">Belum ada modul di roadmap ini.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roadmap.items.map((modul) => (
                      <div key={modul.id} className="flex items-start md:items-center gap-4 p-4 bg-[#0F1B33] border border-[#1E2A45] rounded-2xl hover:border-indigo-500/50 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-[#071226] text-slate-300 font-bold flex items-center justify-center shrink-0 border border-[#1E2A45]">
                          {modul.step_order}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{modul.title}</h4>
                          <p className="text-xs font-medium text-slate-400 mt-0.5">{modul.subtitle}</p>
                        </div>
                        
                        {/* Tombol Aksi Edit & Hapus Modul */}
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button 
                            onClick={() => handleEditModuleClick(roadmap.id, modul)}
                            className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit Modul">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteModule(modul.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Hapus Modul">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Roadmap disembunyikan agar kode tidak kepanjangan (Sama seperti sebelumnya) */}
      {isRoadmapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071226]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F1B33] border border-[#1E2A45] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0F1B33]/90 backdrop-blur-md border-b border-[#1E2A45] p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><Map size={24} className="text-indigo-400"/> Tambah Roadmap</h2>
              <button onClick={() => setIsRoadmapModalOpen(false)} className="p-2 hover:bg-[#162544] rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
            </div>
            <form onSubmit={handleAddRoadmap} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Roadmap</label>
                  <input type="text" required value={roadmapForm.title} onChange={e => setRoadmapForm({...roadmapForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                  <select value={roadmapForm.category} onChange={e => setRoadmapForm({...roadmapForm, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white cursor-pointer">
                    <option value="Teknologi">Teknologi</option><option value="Bisnis">Bisnis</option><option value="Marketing">Marketing</option><option value="Kreatif">Kreatif</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Level</label>
                  <select value={roadmapForm.level} onChange={e => setRoadmapForm({...roadmapForm, level: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white cursor-pointer">
                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimasi Waktu</label>
                  <input type="text" required value={roadmapForm.est_time} onChange={e => setRoadmapForm({...roadmapForm, est_time: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none text-sm font-medium text-white placeholder:text-slate-600" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi</label>
                <textarea required rows="3" value={roadmapForm.description} onChange={e => setRoadmapForm({...roadmapForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600 resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E2A45]">
                <button type="button" onClick={() => setIsRoadmapModalOpen(false)} className="px-6 py-3 rounded-xl text-slate-300 font-bold hover:bg-[#162544] transition-colors text-sm border border-transparent hover:border-[#1E2A45]">Batal</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95 text-sm">Simpan Roadmap</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT MODUL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071226]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F1B33] border border-[#1E2A45] rounded-[2rem] w-full max-w-lg shadow-2xl">
            <div className="border-b border-[#1E2A45] p-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-400"/> {editingModuleId ? 'Edit Modul' : 'Tambah Modul'}
              </h2>
              <button onClick={() => setIsModuleModalOpen(false)} className="p-2 hover:bg-[#162544] rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
            </div>
            <form onSubmit={handleSaveModule} className="p-6 space-y-5">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urutan</label>
                  <input type="number" required min="1" value={moduleForm.step_order} onChange={e => setModuleForm({...moduleForm, step_order: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] text-center font-black text-indigo-400 outline-none focus:border-indigo-500" />
                </div>
                <div className="col-span-3 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Modul</label>
                  <input type="text" required value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none text-sm font-medium text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub Judul (Singkat)</label>
                <input type="text" required value={moduleForm.subtitle} onChange={e => setModuleForm({...moduleForm, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none text-sm font-medium text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Video size={14}/> Link Materi / Video</label>
                <input type="url" value={moduleForm.video_link} onChange={e => setModuleForm({...moduleForm, video_link: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#1E2A45] bg-[#071226] focus:bg-[#0F1B33] focus:border-indigo-500 outline-none text-sm font-medium text-indigo-400" />
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><AlertCircle size={12}/> Kosongkan jika materi berbentuk teks mandiri.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E2A45]">
                <button type="button" onClick={() => setIsModuleModalOpen(false)} className="px-6 py-3 rounded-xl text-slate-300 font-bold hover:bg-[#162544] border border-transparent hover:border-[#1E2A45] transition-colors text-sm">Batal</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95 text-sm">
                  {editingModuleId ? 'Simpan Perubahan' : 'Simpan Modul'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}