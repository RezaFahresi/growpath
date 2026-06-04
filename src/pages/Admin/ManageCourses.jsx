import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X, BookOpen, Clock, Layers, Search } from 'lucide-react';
import API from '../../api/axios';

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, updateCourse, user } = useAppContext();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inisialisasi state sesuai kolom database
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    category: '',
    duration: '',
    lessons: 0
  });

  const displayCourses = Array.isArray(courses) 
    ? [...courses].sort((a, b) => (a.id || 0) - (b.id || 0)) 
    : [];

  const openAddForm = () => {
    setCourseData({ title: '', description: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', category: '', duration: '', lessons: 0 });
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    setCourseData({
      title: course.title || '',
      description: course.description || '',
      image: course.image || '',
      category: course.category || '',
      duration: course.duration || '',
      lessons: course.lessons || 0
    });
    setIsEditing(true);
    setEditId(course.id || course._id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!courseData.title) return alert('Course Title is required!');

    try {
      setLoading(true);
      const response = isEditing 
        ? await API.put(`/courses/${editId}`, courseData)
        : await API.post('/courses', courseData);

      if (isEditing) updateCourse(response.data);
      else addCourse(response.data);

      closeForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Margin diseragamkan dengan menambahkan w-full max-w-7xl mx-auto p-4 md:p-8 agar fit in
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Courses</h1>
          <p className="text-sm text-slate-400 mt-1">Buat materi pembelajaran, atur kurikulum, dan kelola kelas aktif.</p>
        </div>
        
        {!isFormOpen && (
          <button 
            onClick={openAddForm} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/30 font-bold text-sm"
          >
            <Plus size={18} strokeWidth={2.5} /> Tambah Kelas Baru
          </button>
        )}
      </div>

      {/* ================= FORM PANEL ================= */}
      {isFormOpen && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {/* Ikon Form Diperbarui dengan background & highlight */}
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <BookOpen className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              {isEditing ? 'Edit Informasi Kelas' : 'Buat Kelas Baru'}
            </h2>
            <button onClick={closeForm} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl transition-colors border border-[#1E2A45]">
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Input Kiri / Atas */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Kelas</label>
                <input 
                  type="text" 
                  placeholder="Ex: Master React.js 2026" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                  value={courseData.title} 
                  onChange={e => setCourseData({...courseData, title: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                <input 
                  type="text" 
                  placeholder="Ex: Web Development" 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                  value={courseData.category} 
                  onChange={e => setCourseData({...courseData, category: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: 10 Jam" 
                      className="w-full border border-[#1E2A45] bg-[#071226] text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                      value={courseData.duration} 
                      onChange={e => setCourseData({...courseData, duration: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jml Modul</label>
                  <div className="relative">
                    <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full border border-[#1E2A45] bg-[#071226] text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium" 
                      value={courseData.lessons} 
                      onChange={e => setCourseData({...courseData, lessons: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Input Kanan / Bawah */}
            <div className="space-y-6 flex flex-col">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL Thumbnail</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium text-sm" 
                  value={courseData.image} 
                  onChange={e => setCourseData({...courseData, image: e.target.value})} 
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Kelas</label>
                <textarea 
                  placeholder="Jelaskan apa saja yang akan dipelajari di kelas ini..." 
                  className="w-full flex-1 min-h-[120px] border border-[#1E2A45] bg-[#071226] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 font-medium resize-none" 
                  value={courseData.description} 
                  onChange={e => setCourseData({...courseData, description: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#1E2A45] pt-6">
            <button onClick={closeForm} className="px-8 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 font-bold rounded-xl transition-colors border border-[#1E2A45]">
              Batal
            </button>
            <button onClick={handleSubmit} disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              {loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Kelas')}
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
              <Layers size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            </div>
            Katalog Kelas Tersedia
          </h2>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
            {displayCourses.length} Kelas
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead className="bg-[#0B172E]">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Informasi Kelas</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Kategori</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider border-b border-[#1E2A45]">Struktur</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs tracking-wider text-right border-b border-[#1E2A45]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A45]">
              {displayCourses.length > 0 ? (
                displayCourses.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-[#0F1B33] transition-colors group">
                    
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#071226] border border-[#1E2A45] flex items-center justify-center">
                          {c.image && c.image !== '[null]' ? (
                            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen size={20} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors">{c.title}</p>
                          <p className="text-slate-500 text-xs truncate max-w-[250px]">{c.description || 'Tidak ada deskripsi.'}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                        {c.category || 'General'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <Clock size={14} className="text-blue-400" /> {c.duration || '-'}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <Layers size={14} className="text-purple-400" /> {c.lessons || 0} Modul
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(c)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-blue-500/30"
                          title="Edit Kelas"
                        >
                          <Edit2 size={16}/>
                        </button>
                        <button 
                          onClick={() => deleteCourse(c.id || c._id)} 
                          className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-[#1E2A45] hover:border-red-500/30"
                          title="Hapus Kelas"
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
                      <p className="text-slate-300 font-bold mb-1">Belum ada kelas yang terdaftar.</p>
                      <p className="text-slate-500 text-sm">Klik "Tambah Kelas Baru" untuk menambahkan materi ke katalog.</p>
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