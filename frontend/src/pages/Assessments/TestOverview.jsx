import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Target, AlertCircle, Play, ArrowLeft, Brain, ListChecks, CheckCircle2, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function TestOverview() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const { availableAssessments } = useAppContext();
  
  const assessmentData = availableAssessments?.find(a => String(a.id) === String(id)) || {};

  const handleStartTest = () => {
    navigate(`/dashboard/assessments/take/${id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <button 
        onClick={() => navigate('/dashboard/assessments')}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Daftar</span>
      </button>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <Brain size={300} />
          </div>
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-800/80 text-amber-400 text-xs font-bold rounded-full border border-slate-700 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Sparkles size={14} className="drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" /> 
                {assessmentData.category || 'Diagnostic Test'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              {assessmentData.title || 'Talent Mapping Assessment'}
            </h1>
            
            <p className="text-indigo-200/90 leading-relaxed max-w-2xl text-sm md:text-base">
              {assessmentData.description || 'Sebelum memulai perjalanan belajarmu, mari evaluasi kemampuan dasar dan minat profesi Anda di sini. Tes ini dirancang khusus untuk memetakan logika dan insting Anda.'}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-slate-800 rounded-xl shrink-0 shadow-md">
                <Clock size={22} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Durasi</p>
                <p className="text-slate-800 font-extrabold">{assessmentData.duration ? `${assessmentData.duration} Menit` : '15 Menit'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-slate-800 rounded-xl shrink-0 shadow-md">
                <Target size={22} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tujuan</p>
                <p className="text-slate-800 font-extrabold">Evaluasi Kompetensi</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-slate-800 rounded-xl shrink-0 shadow-md">
                <ListChecks size={22} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Format</p>
                <p className="text-slate-800 font-extrabold">Pilihan Ganda</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 md:p-8 mb-2">
            <h3 className="text-amber-900 font-bold mb-4 flex items-center gap-2 text-lg">
              <AlertCircle size={20} className="text-amber-500" />
              Persiapan Sebelum Memulai
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800/80 leading-relaxed">
                  <strong className="text-amber-900">Fokus Penuh.</strong> Baca setiap pertanyaan dengan seksama dan pastikan Anda berada di lingkungan yang kondusif.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800/80 leading-relaxed">
                  <strong className="text-amber-900">Koneksi Internet.</strong> Pastikan perangkat Anda memiliki jaringan yang stabil selama waktu pengerjaan ujian.
                </p>
              </div>
            </div>
          </div>
          
        </div>

        <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium text-center md:text-left">
            Waktu akan mulai dihitung secara otomatis saat Anda masuk ke halaman soal pertama.
          </p>
          <button 
            onClick={handleStartTest}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 group"
          >
            <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
            Mulai Ujian Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}