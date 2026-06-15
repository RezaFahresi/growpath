import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Target, Code2, PenTool, Megaphone, ArrowRight, Sparkles, CheckCircle2, Lightbulb, Palette, BookOpen, Zap, Monitor, Briefcase, Layout, Globe, Smartphone, Server } from 'lucide-react';
import API from '../../api/axios';

// Pemetaan Ikon agar sesuai dengan nama ikon dari Database
const IconMap = {
  Code2, Megaphone, Palette, TrendingUp, BookOpen, Target, Zap, Monitor, Briefcase, PenTool, Layout, Globe, Smartphone, Server
};

export default function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedPath, setSelectedPath] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State baru untuk daftar Roadmap dari Database
  const [dbRoadmaps, setDbRoadmaps] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Tarik hasil Assessment
        const response = await API.get(`/assessments/results/${id}`, {
          signal: controller.signal
        });

        const data = response.data;

        setAssessment({
          score: data.score,
          title: data.title || 'Laporan Ujian',
          date: data.created_at,
          attemptId: data.id.toString(),
          breakdown: data.breakdown || [
            { topic: 'Pemahaman Konsep', score: Math.min(100, data.score + 10) },
            { topic: 'Analisa Masalah', score: Math.max(0, data.score - 15) },
            { topic: 'Logika Keputusan', score: data.score },
            { topic: 'Manajemen Waktu', score: Math.min(100, data.score + 15) },
          ],
          recommendation: data.score >= 80 
            ? 'Skor analisa Anda sangat luar biasa! Anda sudah memiliki insting pemecahan masalah yang kuat. Kami merekomendasikan Anda untuk langsung mengambil sertifikasi spesifik.' 
            : data.score >= 60
            ? 'Kerja bagus! Pemahaman dasar Anda sudah cukup baik. Anda hanya perlu sedikit penyesuaian di beberapa studi kasus sebelum melangkah ke level manajerial.'
            : 'Setiap profesional dimulai dari pemula. Kami merekomendasikan Anda untuk memulai dari materi fundamental agar fondasi pemahaman teori Anda kokoh.',
        });

        // 🔥 2. Tarik daftar Roadmap dari Database
        const roadmapsRes = await API.get('/roadmaps');
        setDbRoadmaps(roadmapsRes.data || []);

      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          return;
        }
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Sesi Anda telah berakhir. Silakan login kembali untuk melihat hasil laporan.');
          } else if (err.response.status === 404) {
            setError('Maaf, data hasil laporan ujian ini tidak ditemukan di arsip kami.');
          } else {
            setError(err.response.data?.message || 'Gagal memuat rekapitulasi data dari server.');
          }
        } else {
          setError(err.message || 'Terjadi gangguan jaringan.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    } else {
      setError("ID Laporan Ujian tidak valid.");
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleSelectPath = (pathId) => {
    setSelectedPath(pathId);
  };

  const handleConfirmSelection = () => {
    if (!selectedPath) return;
    setIsSubmitting(true);
    setTimeout(() => {
      //  Akan mengarah ke ID angka yang benar di Database
      navigate(`/dashboard/roadmap/${selectedPath}`);
    }, 1200);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 px-4">
        <div className="p-8 bg-white border border-red-100 rounded-3xl text-center shadow-xl shadow-red-50 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h3 className="text-red-600 text-xl font-bold mb-2">Terjadi Kendala</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/assessments')}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Kembali ke Daftar
        </button>
      </div>
    );
  }

  if (loading || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-bold mt-6 animate-pulse tracking-widest text-sm uppercase">Merekapitulasi Hasil...</p>
      </div>
    );
  }

  const { score, date, attemptId, breakdown, recommendation } = assessment;

  const formattedDate = new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
  const isHigh = score >= 80;
  const isLow = score < 60;
  const statusTitle = isHigh ? 'Sangat Memuaskan' : isLow ? 'Perlu Ditingkatkan' : 'Cukup Baik';
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/dashboard/assessments')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-medium transition-colors text-sm mb-4">
            <ArrowLeft size={16} /> Kembali ke Arsip
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            Analisis Selesai <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" size={32} />
          </h1>
          <p className="text-slate-500 mt-1">Berikut adalah rincian profil kompetensi Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gradient-to-b from-indigo-600 to-indigo-900 rounded-[2rem] p-8 shadow-xl shadow-indigo-200 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h2 className="text-2xl font-bold mb-1 z-10">{statusTitle}</h2>
          <p className="text-indigo-200 text-xs font-medium mb-8 z-10 uppercase tracking-wider">Laporan #{attemptId} • {formattedDate}</p>
          <div className="relative w-40 h-40 flex justify-center items-center z-10 mb-4">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0 drop-shadow-md">
              <circle className="text-white/20" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" />
              <circle className="text-white" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black tracking-tighter">{score}</span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-200 mt-1">XP Points</span>
            </div>
          </div>
          <p className="text-indigo-100 text-sm z-10 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">Lebih tinggi dari {Math.max(10, score - 10)}% kandidat</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-800 shadow-md rounded-xl"><TrendingUp size={20} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" /></div>
            <h3 className="text-xl font-bold text-slate-800">Detail Pemetaan</h3>
          </div>
          <div className="space-y-6">
            {breakdown.map((item, idx) => {
              const barColor = item.score >= 80 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-indigo-500' : 'bg-amber-500';
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.topic}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${barColor}`}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className={`${barColor} h-3 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row items-start gap-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 text-indigo-500 -mb-6 -mr-6"><Lightbulb size={160} /></div>
        <div className="p-4 bg-slate-800 rounded-2xl shadow-md shrink-0 relative z-10"><Target size={32} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" /></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-indigo-950 mb-2">Saran & Evaluasi Sistem</h3>
          <p className="text-indigo-800/80 leading-relaxed max-w-3xl">{recommendation}</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-900 pointer-events-none"><Sparkles size={200} /></div>
        <div className="relative z-10">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">Tentukan Fokus Pelatihan Anda</h3>
            <p className="text-slate-500 text-sm md:text-base">Berdasarkan hasil analisa di atas, kami telah merangkum spesialisasi yang paling ideal. Pilih satu jalur untuk memulai program kurikulum Anda!</p>
          </div>

          {/* KOTAK PILIHAN ROADMAP DIAMBIL DARI DATABASE */}
          {dbRoadmaps.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">Memuat pilihan kurikulum...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
              {dbRoadmaps.slice(0, 3).map((roadmap) => {
                const IconCmp = IconMap[roadmap.icon_name] || BookOpen;
                const isSelected = selectedPath === roadmap.id;

                return (
                  <div 
                    key={roadmap.id} 
                    onClick={() => handleSelectPath(roadmap.id)} 
                    className={`cursor-pointer rounded-3xl border-2 p-8 transition-all duration-300 flex flex-col h-full ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-lg transform md:-translate-y-1' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-2xl bg-slate-800 shadow-md">
                        <IconCmp size={28} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xl">{roadmap.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-3">
                      {roadmap.description}
                    </p>
                    <div className={`text-sm font-bold flex items-center gap-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {isSelected ? 'Spesialisasi Dipilih' : 'Pilih Spesialisasi Ini'} <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center border-t border-slate-100 pt-10">
            <button 
              onClick={handleConfirmSelection} 
              disabled={!selectedPath || isSubmitting} 
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all ${
                selectedPath && !isSubmitting 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>Menyiapkan Program... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></>
              ) : (
                <>Konfirmasi Jalur Karir <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}