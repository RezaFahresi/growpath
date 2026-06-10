import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Circle, Lock, Zap, ChevronRight, Trophy, BookOpen, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios';

export default function Roadmap() {
  // 🔥 AMBIL userTalent DARI CONTEXT
  const { user, progress, toggleRoadmapItem, userTalent } = useAppContext();
  const [phases, setPhases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await API.get('/roadmaps');
        const data = response.data;
        
        const formatted = data.map((item, index) => ({
          id: `phase${index + 1}`,
          dbId: item.id, 
          title: item.title,
          description: item.description,
          items: [
            { id: `p${index + 1}_1`, title: item.category },
            { id: `p${index + 1}_2`, title: item.level },
          ],
        }));
        setPhases(formatted);
      } catch (error) {
        console.error("Error Fetching Roadmaps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleToggleTask = async (phaseId, itemId) => {
    toggleRoadmapItem(phaseId, itemId);
    if (user) {
      try {
        await API.post('/roadmaps/progress', { phaseId, taskId: itemId });
      } catch (error) {
        console.error("Gagal sinkronisasi:", error);
      }
    }
  };

  const processedPhases = useMemo(() => {
    // 🔥 JIKA BELUM ADA DATA TALENT MAPPING, KUNCI SEMUA ROADMAP!
    if (!userTalent) {
      return phases.map(phase => ({ ...phase, isLocked: true, progress: 0, isCompleted: false }));
    }

    return phases.map((phase, index) => {
      const checklist = progress?.roadmapChecklist?.[phase.id] || [];
      const isCompleted = phase.items.length > 0 && phase.items.every(item => checklist.includes(item.id));
      let currentProgress = Math.round((checklist.length / phase.items.length) * 100);
      if (currentProgress > 100 || isCompleted) currentProgress = 100;

      let isLocked = true;

      // 🔥 LOGIKA AKSELERASI BERDASARKAN TALENT MAPPING
      if (index === 0) {
        isLocked = false; // Phase 1 selalu terbuka jika sudah punya talent mapping
      } else {
        const prev = phases[index - 1];
        const prevChecklist = progress?.roadmapChecklist?.[prev?.id] || [];
        const prevCompleted = prev?.items?.length > 0 && prev.items.every(item => prevChecklist.includes(item.id));
        
        // JIKA POTENSI HIGH, PHASE 2 LANGSUNG TERBUKA WALAUPUN PHASE 1 BELUM SELESAI
        if (userTalent.potential === 'High' && index === 1) {
          isLocked = false;
        } else {
          isLocked = !prevCompleted;
        }
      }

      return { ...phase, isLocked, progress: currentProgress, isCompleted };
    });
  }, [phases, progress, userTalent]);

  const totalXP = useMemo(() => {
    let xp = 0;
    processedPhases.forEach((phase) => {
      const checklist = progress?.roadmapChecklist?.[phase.id] || [];
      xp += checklist.length * 10;
    });
    return xp;
  }, [processedPhases, progress]);

  if (isLoading) return <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-center text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-4xl font-black mb-4">Your Learning Roadmap</h1>
        <p className="text-indigo-200/80 mb-6 max-w-lg mx-auto">Ikuti jalur pembelajaran khusus untuk menguasai keterampilan secara bertahap.</p>
        
        <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
          <div className="p-2 bg-slate-800 rounded-lg shadow-lg">
            <Trophy size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </div>
          <span className="font-bold">{totalXP} Total Experience Points</span>
        </div>
      </div>

      {/* 🔥 PERINGATAN JIKA BELUM DILAKUKAN TALENT MAPPING */}
      {!userTalent && (
        <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">Roadmap Terkunci!</h2>
            <p className="text-amber-800/80 text-sm leading-relaxed">
              Sistem membutuhkan data statistik "Talent Mapping" milikmu untuk menyusun jalur belajar. Silakan ikuti <button onClick={() => navigate('/dashboard/assessments')} className="font-bold text-indigo-600 underline">Diagnostic Assessment</button> terlebih dahulu atau hubungi Admin/HR.
            </p>
          </div>
        </div>
      )}

      {/* TIMELINE CONTAINER */}
      <div className="relative pl-8 md:pl-12 space-y-12">
        <div className="absolute left-[27px] top-4 bottom-12 w-1.5 bg-slate-200 rounded-full z-0" />

        {processedPhases.map((phase, index) => {
          const isDone = phase.isCompleted;
          const isActive = !phase.isLocked && !phase.isCompleted;
          
          return (
            <div key={phase.id} className="relative flex gap-8 items-start">
              
              {/* STATUS ICON & CONNECTOR */}
              <div className={`absolute left-[-46px] w-14 h-14 rounded-full border-4 border-white flex items-center justify-center z-10 transition-colors duration-500 shadow-md ${
                isDone ? 'bg-emerald-500' : isActive ? 'bg-indigo-600' : 'bg-slate-300'
              }`}>
                {isDone ? <CheckCircle size={24} className="text-white" /> : 
                 phase.isLocked ? <Lock size={20} className="text-white" /> : 
                 <Zap size={24} className="text-white fill-white animate-pulse" />}
              </div>

              {/* CARD */}
              <div className={`flex-1 p-8 rounded-[2rem] border-2 transition-all duration-300 ${
                isActive ? 'bg-white border-indigo-300 shadow-2xl shadow-indigo-100' : 'bg-white border-slate-100'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-slate-800">{phase.title}</h3>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${
                    isDone ? 'bg-emerald-100 text-emerald-700' : isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isDone ? 'Selesai' : isActive ? 'Aktif' : 'Terkunci'}
                  </span>
                </div>

                <p className="text-slate-500 mb-6 text-sm">{phase.description}</p>

                {/* TASKS */}
                {!phase.isLocked && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {phase.items.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleToggleTask(phase.id, item.id)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          (progress?.roadmapChecklist?.[phase.id] || []).includes(item.id) 
                          ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                        }`}
                      >
                        {(progress?.roadmapChecklist?.[phase.id] || []).includes(item.id) 
                          ? <CheckCircle className="text-emerald-500" size={20} /> 
                          : <Circle className="text-indigo-400 font-bold" size={20} />}
                        <span className="text-sm font-bold text-slate-700">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* BUTTON ACTION */}
                {!phase.isLocked && (
                  <div className="pt-6 mt-6 border-t border-slate-100/80 flex flex-col md:flex-row gap-3">
                    <button 
                      onClick={() => navigate(`/dashboard/roadmap/${phase.id}`)}
                      className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all text-sm uppercase tracking-wider ${
                        phase.isCompleted 
                        ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5'
                      }`}
                    >
                      {phase.isCompleted ? 'Review Materi' : 'Lanjutkan Belajar'}
                      <ChevronRight size={18} />
                    </button>
                    
                    <button 
                      onClick={() => navigate('/dashboard/courses')}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all text-sm uppercase tracking-wider bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm hover:-translate-y-0.5"
                    >
                      <div className="p-1.5 bg-slate-800 rounded-md shadow-sm">
                        <BookOpen size={16} className="text-cyan-400" />
                      </div>
                      Buka Course Modul
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}