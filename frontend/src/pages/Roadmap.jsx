import React, { useState, useEffect, useMemo } from 'react';
import { Zap, ChevronRight, Trophy, AlertTriangle, Target, Code2, Megaphone, TrendingUp, Palette, Search } from 'lucide-react'; // Tambah Search
import { useNavigate, useLocation } from 'react-router-dom'; // Tambah useLocation
import { useAppContext } from '../context/AppContext';
import API from '../api/axios';

export default function Roadmap() {
  const { progress, userTalent } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Membaca URL

  const [userTalentData, setUserTalentData] = useState(userTalent);

  // 1. AMBIL KATA KUNCI DARI URL (JIKA MENCARI DARI HEADER)
  const searchParams = new URLSearchParams(location.search);
  const urlSearchQuery = searchParams.get('search') || '';

  // 2. STATE UNTUK KOTAK SEARCH LOKAL
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  // Jika URL berubah (mencari lagi dari Header), perbarui state
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    setUserTalentData(userTalent);
  }, [userTalent]);

  useEffect(() => {
    const fetchUserTalent = async () => {
      try {
        const res = await API.get('/talent-mapping/me');
        if (res.data) {
          setUserTalentData(res.data);
        }
      } catch (error) {
        setUserTalentData(null);
      }
    };
    fetchUserTalent();
  }, []);

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

  const totalXP = useMemo(() => {
    let xp = 0;
    if (progress?.roadmapChecklist) {
      Object.values(progress.roadmapChecklist).forEach(checklist => {
        xp += checklist.length * 10;
      });
    }
    return xp;
  }, [progress]);

  // 3. LOGIKA FILTER UNTUK ROADMAP
  const filteredRoadmaps = availableRoadmaps.filter(roadmap => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const title = roadmap.title.toLowerCase();
    const desc = roadmap.description.toLowerCase();
    const cat = roadmap.category.toLowerCase();

    return title.includes(query) || desc.includes(query) || cat.includes(query);
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
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

      {/* Info Rekomendasi (Belum Aktif) */}
      {!userTalentData && (
        <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">Sistem Rekomendasi Belum Aktif</h2>
            <p className="text-amber-800/80 text-sm leading-relaxed">
              Anda bebas memilih roadmap manapun di bawah ini secara manual. Namun, jika Anda bingung harus mulai dari mana, silakan ikuti{' '}
              <button
                onClick={() => navigate('/dashboard/assessments')}
                className="font-bold text-indigo-600 underline hover:text-indigo-800"
              >
                Diagnostic Assessment
              </button>{' '}
              terlebih dahulu agar kami bisa mengarahkan Anda.
            </p>
          </div>
        </div>
      )}

      {/* Info Rekomendasi (Aktif) */}
      {userTalentData && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Zap size={32} className="text-emerald-500 fill-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-900 mb-2">Sistem Rekomendasi Aktif</h2>
            <p className="text-emerald-800/80 text-sm leading-relaxed">
              Roadmap Anda sudah disesuaikan berdasarkan hasil assessment. Silakan lanjutkan pembelajaran sesuai jalur yang direkomendasikan.
            </p>
          </div>
        </div>
      )}

      {/* Katalog Roadmap & Search Bar */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl shadow-md">
              <Zap size={20} className="text-indigo-400 fill-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Katalog Roadmap Tersedia</h2>
          </div>

          {/* KOTAK SEARCH LOKAL */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari roadmap atau kategori..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Daftar Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredRoadmaps.map((roadmap) => {
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
                        isCompleted
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                          : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
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

        {/* TAMPILAN JIKA PENCARIAN KOSONG */}
        {filteredRoadmaps.length === 0 && (
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 mt-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                <Search size={32} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-slate-700 font-bold text-lg mb-1">
              Roadmap "{searchQuery}" tidak ditemukan
            </h3>
            <p className="text-slate-500 text-sm">
              Coba gunakan kata kunci lain untuk mencari jalur karir.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 px-6 py-2 bg-white border border-slate-200 text-indigo-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors text-sm"
            >
              Hapus Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}