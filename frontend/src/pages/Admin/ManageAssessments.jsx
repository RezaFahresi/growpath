import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X, ClipboardCheck, FileText, Search } from 'lucide-react';
import API from '../../api/axios';

export default function ManageAssessments() {
  const { availableAssessments, addAssessment, deleteAssessment, updateAssessment, user } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultCategory = user?.role === 'Admin' ? (user?.interest || '') : '';
  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';

  const [assessmentData, setAssessmentData] = useState({
    title: '', category: defaultCategory, duration: '', description: '', questions: []
  });

  const displayAssessments = Array.isArray(availableAssessments) ? [...availableAssessments].sort((a, b) => (a.id || 0) - (b.id || 0)) : [];

  const openAddForm = () => {
    setAssessmentData({ title: '', category: defaultCategory, duration: '', description: '', questions: [] });
    setIsEditing(false); setEditId(null); setIsFormOpen(true);
  };

  const openEditForm = async (item) => {
    const itemId = item.id || item._id;
    try {
      const res = await API.get(`/assessments/${itemId}`);
      setAssessmentData({
        title: res.data.title || '',
        category: res.data.category || '',
        duration: res.data.duration || '',
        description: res.data.description || '',
        questions: res.data.questions || []
      });
      setIsEditing(true); setEditId(itemId); setIsFormOpen(true);
    } catch (err) {
      alert("Gagal mengambil detail ujian.");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false); setIsEditing(false); setEditId(null);
  };

  const handleAddQuestion = () => {
    setAssessmentData(prev => ({
      ...prev,
      questions: [
        ...prev.questions, 
        { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' }
      ]
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...assessmentData.questions];
    updatedQuestions[index][field] = value;
    setAssessmentData({ ...assessmentData, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = assessmentData.questions.filter((_, i) => i !== index);
    setAssessmentData({ ...assessmentData, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    if (!assessmentData.title) return alert('Judul ujian wajib diisi!');

    try {
      setLoading(true);
      let response;
      if (isEditing) {
        response = await API.put(`/assessments/${editId}`, assessmentData);
        if (updateAssessment) updateAssessment(response.data);
      } else {
        response = await API.post('/assessments', assessmentData);
        addAssessment(response.data);
      }
      closeForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Yakin ingin menghapus ujian beserta semua soalnya?")) return;
    try {
      setLoading(true);
      await API.delete(`/assessments/${id}`);
      deleteAssessment(id);
    } catch (error) {
      alert('Gagal menghapus assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Assessments</h1>
          <p className="text-sm text-slate-400 mt-1">Buat, perbarui, dan kelola ujian evaluasi beserta soal-soalnya.</p>
        </div>
        {!isFormOpen && (
          <button onClick={openAddForm} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm">
            <Plus size={18} /> Buat Ujian Baru
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0B172E] p-8 rounded-[2rem] border border-[#1E2A45] shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl"><FileText className="text-blue-400" size={20} /></div>
              {isEditing ? 'Edit Ujian & Soal' : 'Buat Ujian & Soal Baru'}
            </h2>
            <button onClick={closeForm} className="p-2.5 text-slate-400 hover:text-white bg-[#0F1B33] rounded-xl border border-[#1E2A45]"><X size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-[#1E2A45] pb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Judul Ujian</label>
              <input type="text" className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:border-blue-500" value={assessmentData.title} onChange={e => setAssessmentData({...assessmentData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
              <input type="text" className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:border-blue-500" value={assessmentData.category} onChange={e => setAssessmentData({...assessmentData, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Durasi (Menit)</label>
              <input type="number" className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:border-blue-500" value={assessmentData.duration} onChange={e => setAssessmentData({...assessmentData, duration: e.target.value})} />
            </div>
            <div className="col-span-1 md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Deskripsi Singkat</label>
              <textarea rows="2" className="w-full border border-[#1E2A45] bg-[#071226] text-white px-5 py-3.5 rounded-xl focus:border-blue-500 resize-none" value={assessmentData.description} onChange={e => setAssessmentData({...assessmentData, description: e.target.value})} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Daftar Pertanyaan ({assessmentData.questions.length})</h3>
              <button onClick={handleAddQuestion} className="flex items-center gap-2 px-4 py-2 bg-[#0F1B33] text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/10 transition-colors text-sm font-bold">
                <Plus size={16} /> Tambah Soal
              </button>
            </div>

            <div className="space-y-6">
              {assessmentData.questions.map((q, idx) => (
                <div key={idx} className="bg-[#071226] p-5 rounded-2xl border border-[#1E2A45] relative">
                  <button onClick={() => handleRemoveQuestion(idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                  <p className="text-blue-400 font-bold mb-3 text-sm">Soal #{idx + 1}</p>
                  
                  <div className="space-y-4">
                    <input type="text" placeholder="Tuliskan pertanyaan di sini..." className="w-full border border-[#1E2A45] bg-[#0B172E] text-white px-4 py-3 rounded-lg focus:border-blue-500 text-sm font-medium" value={q.question_text} onChange={e => handleQuestionChange(idx, 'question_text', e.target.value)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['a', 'b', 'c', 'd'].map(opt => (
                        <div key={opt} className="flex items-center gap-3">
                          <span className="text-slate-400 font-bold uppercase w-4">{opt}.</span>
                          <input type="text" placeholder={`Opsi ${opt.toUpperCase()}`} className="flex-1 border border-[#1E2A45] bg-[#0B172E] text-white px-4 py-2.5 rounded-lg focus:border-blue-500 text-sm" value={q[`option_${opt}`]} onChange={e => handleQuestionChange(idx, `option_${opt}`, e.target.value)} />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Kunci Jawaban Benar:</label>
                      <select className="bg-[#0B172E] border border-[#1E2A45] text-white px-4 py-2 rounded-lg text-sm font-bold focus:border-emerald-500" value={q.correct_answer} onChange={e => handleQuestionChange(idx, 'correct_answer', e.target.value)}>
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#1E2A45] pt-6">
            <button onClick={closeForm} className="px-6 py-3 bg-[#0F1B33] text-slate-300 font-bold rounded-xl border border-[#1E2A45]">Batal</button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              {loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Ujian & Soal')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-[#1E2A45] flex items-center justify-between bg-[#0F1B33]">
          <h2 className="font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[#071226] border border-[#1E2A45] rounded-lg shadow-sm"><ClipboardCheck size={18} className="text-blue-400" /></div>
            Daftar Ujian Tersedia
          </h2>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/20">{displayAssessments.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead className="bg-[#0B172E]">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs border-b border-[#1E2A45]">Informasi Ujian</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs border-b border-[#1E2A45]">Kategori</th>
                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-xs border-b border-[#1E2A45]">Durasi</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-xs text-right border-b border-[#1E2A45]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A45]">
              {displayAssessments.map((item) => (
                <tr key={item.id} className="hover:bg-[#0F1B33] transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-white text-base mb-1">{item.title}</p>
                    <p className="text-slate-500 text-xs truncate max-w-sm">{item.description}</p>
                  </td>
                  <td className="px-6 py-5"><span className="px-3 py-1.5 bg-[#071226] text-slate-300 rounded-lg text-xs font-semibold border border-[#1E2A45]">{item.category}</span></td>
                  <td className="px-6 py-5 font-medium text-slate-400">{item.duration} Menit</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditForm(item)} className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-blue-400 rounded-xl border border-[#1E2A45]"><Edit2 size={16}/></button>
                      
                      {isSuperAdmin && (
                        <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-[#0F1B33] text-slate-400 hover:text-red-400 rounded-xl border border-[#1E2A45]"><Trash2 size={16}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}