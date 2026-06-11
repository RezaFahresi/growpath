import React, { useState, useMemo } from 'react';
import { Lock, Zap, ChevronRight, Trophy, AlertTriangle, Target, Code2, Megaphone, TrendingUp, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Roadmap() {
  const { progress, userTalent } = useAppContext();
  const navigate = useNavigate();

  // Daftar Pilihan Roadmap Universal (IT & Non-IT)
  const availableRoadmaps = [
    {
      id: 'web-dev-101',
      title: 'Fullstack Web Development',
      category: 'Teknologi',
      icon: <Code2 size={32} className="text-cyan-400" />,
      description: 'Pelajari rekayasa perangkat lunak dari dasar HTML/CSS hingga membangun server backend yang tangguh.',
      totalModules: 5,
      theme: 'from-slate-800 to-slate-900',
      border: 'border-cyan-500/30'
    },
    {
      id: 'marketing-101',
      title: 'Digital Marketing Specialist',
      category: 'Marketing',
      icon: <Megaphone size={32} className="text-amber-400" />,
      description: 'Kuasai taktik SEO, periklanan media sosial, dan analitik data konsumen untuk memenangkan pasar.',
      totalModules: 5,
      theme: 'from-slate-800 to-slate-900',
      border: 'border-amber-500/30'
    },
    {
      id: 'ui-ux-101',
      title: 'UI/UX Design Masterclass',
      category: 'Kreatif',
      icon: <Palette size={32} className="text-pink-400" />,
      description: 'Asah empati dan pelajari cara merancang antarmuka digital yang intuitif dan memanjakan mata.',
      totalModules: 5,
      theme: 'from-slate-800 to-slate-900',
      border: 'border-pink-500/30'
    },
    {
      id: 'business-101',
      title: 'Business & Data Analytics',
      category: 'Bisnis',
      icon: <TrendingUp size={32} className="text-emerald-400" />,
      description: 'Pahami cara membaca tren bisnis, memodelkan keuangan, dan mengambil keputusan berbasis data empiris.',
      totalModules: 5,
      theme: 'from-slate-800 to-slate-900',
      border: 'border-emerald-500/30'
    }
  ];

  // Menghitung total XP dari semua roadmap yang pernah dikerjakan
  const totalXP = useMemo(() => {
    let xp = 0;
    if (progress?.roadmapChecklist) {
      Object.values(progress.roadmapChecklist).forEach(checklist => {
        xp += (checklist.length * 10);
      });
    }
    return xp;
  }, [progress]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2.5rem] p-10 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <Target size={250} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-4">Peta Perjalanan Karir</h1>
          <p className="text-indigo-200/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Pilih jalur pembelajaran spesifik yang ingin Anda kuasai. Anda bebas mengambil lintas disiplin ilmu untuk menjadi profesional yang serba bisa.
          </p>
          
          <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            <div className="p-2 bg-slate-800 rounded-lg shadow-lg">
              <Trophy size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <span className="font-bold tracking-wide">{totalXP} Total Experience Points</span>
          </div>
        </div>
      </div>

      {/* PERINGATAN JIKA BELUM DILAKUKAN TALENT MAPPING */}
      {!userTalent && (
        <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">Sistem Rekomendasi Belum Aktif</h2>
            <p className="text-amber-800/80 text-sm leading-relaxed">
              Anda bebas memilih roadmap manapun di bawah ini secara manual. Namun, jika Anda bingung harus mulai dari mana, silakan ikuti <button onClick={() => navigate('/dashboard/assessments')} className="font-bold text-indigo-600 underline hover:text-indigo-800">Diagnostic Assessment</button> terlebih dahulu agar kami bisa mengarahkan Anda.
            </p>
          </div>
        </div>
      )}

      {/* ROADMAP GRID */}
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2.5 bg-slate-800 rounded-xl shadow-md">
            <Zap size={20} className="text-indigo-400 fill-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Katalog Roadmap Tersedia</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {availableRoadmaps.map((roadmap) => {
            const completedItems = progress?.roadmapChecklist?.[roadmap.id]?.length || 0;
            const progressPercentage = Math.round((completedItems / roadmap.totalModules) * 100);
            const isCompleted = progressPercentage === 100;

            return (
              <div 
                key={roadmap.id} 
                onClick={() => navigate(`/dashboard/roadmap/${roadmap.id}`)}
                className={`group cursor-pointer rounded-[2rem] border-2 p-8 transition-all duration-300 flex flex-col h-full bg-white hover:shadow-xl hover:-translate-y-1.5 ${
                  isCompleted ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roadmap.theme} border ${roadmap.border} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {roadmap.icon}
                  </div>
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-200">
                    {roadmap.category}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">
                  {roadmap.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  {roadmap.description}
                </p>

                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className={isCompleted ? 'text-emerald-600' : 'text-slate-500'}>
                      {isCompleted ? 'Roadmap Selesai!' : 'Progres Belajar'}
                    </span>
                    <span className={isCompleted ? 'text-emerald-600' : 'text-indigo-600'}>
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isCompleted ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                      }`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <span>Lihat Kurikulum Lengkap</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}