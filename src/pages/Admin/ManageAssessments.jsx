import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X, ClipboardCheck, FileText, Search } from 'lucide-react';
import API from '../../api/axios';

export default function ManageAssessments() {
  const {
    availableAssessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    user
  } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultCategory = user?.role === 'Admin' ? (user?.interest || '') : '';

  const [assessmentData, setAssessmentData] = useState({
    title: '',
    category: defaultCategory,
    duration: '',
    description: ''
  });

  const displayAssessments = Array.isArray(availableAssessments) 
    ? [...availableAssessments].sort((a, b) => (a.id || 0) - (b.id || 0)) 
    : [];

  const openAddForm = () => {
    setAssessmentData({ title: '', category: defaultCategory, duration: '', description: '' });
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    const itemId = item.id || item._id;
    setAssessmentData({
      title: item.title || '',
      category: item.category || '',
      duration: item.duration || '',
      description: item.description || ''
    });
    setIsEditing(true);
    setEditId(itemId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
    setAssessmentData({ title: '', category: defaultCategory, duration: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!assessmentData.title) {
      alert('Title is required!');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isEditing) {
        response = await API.put(`/assessments/${editId}`, assessmentData);
      } else {
        response = await API.post('/assessments', assessmentData);
      }

      const data = response.data;
      
      if (isEditing) {
        const updatedPayload = { ...data, id: data.id || editId };
        if (updateAssessment) updateAssessment(updatedPayload); 
      } else {
        addAssessment(data);
      }

      closeForm();
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} assessment:`, error);
      alert(error.response?.data?.message || `Failed to save assessment.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;

    try {
      await API.delete(`/assessments/${id}`);
      deleteAssessment(id);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete assessment.');
    }
  };

  return (
    // Margin diseragamkan dengan w-full max-w-7xl mx-auto agar fit in
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Assessments</h1>
          <p className="text-sm text-slate-400 mt-1">Buat, perbarui, dan kelola ujian evaluasi untuk pengguna.</p>
        </div>
        
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/30 font-bold text-sm"
          >
            <Plus size={18} strokeWidth={2.5} /> Buat Ujian Baru
          </button>
        )}
      </div>

      {/* ================= FORM PANEL ================= */}
      {isFormOpen && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 mb-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {/* Ikon Form Diperbarui dengan background & highlight */}
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <FileText className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              {isEditing ? 'Edit Assessment' : 'Add New Assessment'}
            </h2>
            <button onClick={closeForm} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl transition-colors border border-[#1E2A45]">
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Ujian</label>
              <input 
                type="text" 
                placeholder="Ex: Dasar Pemrograman React" 
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                value={assessmentData.title} 
                onChange={e => setAssessmentData({...assessmentData, title: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
              <input 
                type="text" 
                placeholder="Ex: Frontend Development" 
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                value={assessmentData.category} 
                onChange={e => setAssessmentData({...assessmentData, category: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi (Menit)</label>
              <input 
                type="number" 
                placeholder="Ex: 45" 
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                value={assessmentData.duration} 
                onChange={e => setAssessmentData({...assessmentData, duration: e.target.value})} 
              />
            </div>

            <div className="col-span-1 md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat</label>
              <textarea 
                placeholder="Jelaskan secara singkat apa yang akan diuji dalam assessment ini..." 
                rows="3" 
                className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium resize-none" 
                value={assessmentData.description} 
                onChange={e => setAssessmentData({...assessmentData, description: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#1E2A45] pt-6">
            <button onClick={closeForm} className="px-6 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 font-bold rounded-xl transition-colors border border-[#1E2A45]">
              Batal
            </button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              {loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Ujian')}
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE LIST ================= */}
      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden min-h-[400px]">
        
        {/* Table Header Wrapper */}
        <div className="p-6 border-b border-[#1E2A45] flex items-center justify-between bg-[#0F1B33]">
          <h2 className="font-bold text-white flex items-center gap-3">
            {/* Ikon Table Diperbarui dengan background & highlight */}
            <div className="p-2 bg-[#071226] border border-[#1E2A45] rounded-lg shadow-sm">
              <ClipboardCheck size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            </div>
            Daftar Ujian Tersedia
          </h2>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/20">
            {displayAssessments.length} Total
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead className="bg-[#0B172E]">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Informasi Ujian</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Kategori</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Durasi</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider text-right border-b border-[#1E2A45]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A45]">
              {displayAssessments.length > 0 ? (
                displayAssessments.map((item) => (
                  <tr key={item.id} className="hover:bg-[#0F1B33] transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors">{item.title}</p>
                      <p className="text-slate-500 text-xs truncate max-w-sm">{item.description || 'Tidak ada deskripsi.'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1.5 bg-[#071226] text-slate-300 rounded-lg text-xs font-semibold border border-[#1E2A45]">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-400">
                      {item.duration ? `${item.duration} Menit` : '-'}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(item)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-blue-500/30"
                          title="Edit Ujian"
                        >
                          <Edit2 size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-red-500/30"
                          title="Hapus Ujian"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {/* Ikon Empty State Diperbarui */}
                      <div className="w-20 h-20 bg-[#071226] rounded-2xl flex items-center justify-center mb-5 border border-[#1E2A45] shadow-lg">
                        <Search size={32} className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]" />
                      </div>
                      <p className="text-slate-300 font-bold text-lg mb-1">Belum ada ujian.</p>
                      <p className="text-slate-500 text-sm">Klik "Buat Ujian Baru" untuk menambahkan data.</p>
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