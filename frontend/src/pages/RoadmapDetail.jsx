import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, Zap, CheckCircle2, PlayCircle, ExternalLink, Sparkles, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios'; 
import Swal from 'sweetalert2';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // MENGAMBIL FUNGSI addNotification DARI CONTEXT
  const { user, progress, toggleRoadmapItem, addNotification } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState(null);
  
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchRoadmapDetail = async () => {
      try {
        setLoading(true);
        const res = await API.get('/roadmaps');
        const currentRoadmap = res.data.find(r => String(r.id) === String(id));
        
        if (currentRoadmap) {
          setModuleData(currentRoadmap);
        } else {
          Swal.fire('Tidak Ditemukan', 'Roadmap ini tidak tersedia.', 'error');
          navigate('/dashboard/roadmap');
        }
      } catch (error) {
        console.error("Gagal menarik detail roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapDetail();
  }, [id, navigate]);

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleOpenMaterial = (link) => {
    if (!link) return;
    
    const ytId = getYoutubeId(link);
    
    if (ytId) {
      setActiveVideo(ytId);
    } else if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  const currentPhaseChecklist = progress?.roadmapChecklist?.[id] || [];

  const handleToggleTask = async (itemId) => {
    const stringItemId = String(itemId);
    
    // Cek apakah item ini baru saja diselesaikan (sebelumnya belum ada di checklist)
    const isNewlyChecked = !currentPhaseChecklist.includes(stringItemId);

    toggleRoadmapItem(id, stringItemId);

    // TEMBAKKAN NOTIFIKASI HANYA JIKA DICENTANG SELESAI
    if (isNewlyChecked) {
      addNotification(
        'XP Bertambah!', 
        'Bagus sekali! Anda mendapatkan +10 XP dari penyelesaian modul ini.', 
        'success'
      );
    }

    if (user) {
      try {
        await API.post('/roadmaps/progress', { phaseId: id, taskId: stringItemId });
        Swal.fire({ icon: 'success', title: 'Progress Disimpan', text: 'Progress roadmap berhasil diperbarui.', timer: 1200, showConfirmButton: false });
      } catch (error) {
        toggleRoadmapItem(id, stringItemId); 
        Swal.fire({ icon: 'error', title: 'Gagal Menyimpan Progress', text: error.response?.data?.message || 'Progress gagal disimpan ke server.' });
      }
    }
  };

  if (loading || !moduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-500 animate-pulse tracking-widest text-sm uppercase mt-4">Menyiapkan Kurikulum...</p>
      </div>
    );
  }

  const moduleItems = moduleData.items || [];
  const isCompleted = currentPhaseChecklist.length === moduleItems.length && moduleItems.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      <button 
        onClick={() => navigate('/dashboard/roadmap')} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors text-sm font-semibold group w-max"
      >
        <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-300 transition-colors">
          <ChevronLeft size={16} />
        </div>
        Kembali ke Katalog Karir
      </button>

      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-indigo-900/10 relative overflow-hidden mb-12 text-white">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <BookOpen size={250} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-400/30 backdrop-blur-sm">
              KATEGORI: {moduleData.category || 'General'}
            </span>
            {isCompleted && (
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-400/20">
                <Sparkles size={14} className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" /> Roadmap Selesai
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            {moduleData.title}
          </h1>
          
          <p className="text-indigo-100/80 max-w-3xl leading-relaxed text-sm md:text-base mb-10">
            {moduleData.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-white text-sm font-semibold shadow-inner">
              <div className="p-1.5 bg-slate-800 rounded-lg shadow-md">
                <Clock size={16} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              </div>
              <span>Estimasi Waktu: {moduleData.est_time || 'Mandiri'}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-white text-sm font-semibold shadow-inner">
              <div className="p-1.5 bg-slate-800 rounded-lg shadow-md">
                <BookOpen size={16} className="text-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]" />
              </div>
              <span>{moduleItems.length} Topik Pembelajaran</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <h2 className="text-2xl font-extrabold text-slate-800">Daftar Modul Kurikulum</h2>
          <div className="flex items-center gap-3 text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm w-max">
            <div className="p-1.5 bg-slate-800 rounded-md shadow-md">
              <Zap size={16} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <span>Selesaikan modul untuk mendapatkan +10 XP</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {moduleItems.length === 0 ? (
             <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-bold">Modul belum ditambahkan oleh Admin.</p>
             </div>
          ) : moduleItems.map((item, index) => {
            const isChecked = currentPhaseChecklist.includes(String(item.id));

            return (
              <div 
                key={item.id} 
                className={`group bg-white p-5 md:p-6 rounded-[1.5rem] border-2 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
                  isChecked 
                    ? 'border-emerald-100 bg-emerald-50/30' 
                    : 'border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/50'
                }`}
              >
                
                <div className="flex items-start md:items-center gap-4 md:gap-6">
                  <div 
                    onClick={() => handleToggleTask(item.id)}
                    className="cursor-pointer shrink-0 mt-1 md:mt-0"
                    title={isChecked ? "Batalkan Selesai" : "Tandai Selesai"}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={32} className="text-emerald-500 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)] hover:text-emerald-600 transition-colors" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                        <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-indigo-100 transition-colors" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={`font-bold text-lg md:text-xl transition-colors mb-1 ${
                      isChecked ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800 group-hover:text-indigo-900'
                    }`}>
                      {item.step_order || index + 1}. {item.title}
                    </h4>
                    <p className={`text-sm font-medium ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto pl-12 md:pl-0">
                  <button 
                    onClick={() => handleOpenMaterial(item.video_link)}
                    disabled={!item.video_link}
                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      !item.video_link 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none'
                        : isChecked
                          ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:shadow-md'
                    }`}
                  >
                    {item.video_link && (item.video_link.includes('youtube.com') || item.video_link.includes('youtu.be')) ? (
                      <PlayCircle size={18} />
                    ) : (
                      <ExternalLink size={18} />
                    )}
                    {item.video_link ? 'Buka Modul Belajar' : 'Tidak Ada Tautan'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h3 className="text-white font-bold flex items-center gap-2">
                <PlayCircle size={18} className="text-indigo-400" /> Pemutar Video
              </h3>
              <button 
                onClick={() => setActiveVideo(null)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}