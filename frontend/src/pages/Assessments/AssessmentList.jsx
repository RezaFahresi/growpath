import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Sparkles, History, Target, BookOpen } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AssessmentList() {
  const navigate = useNavigate();
  const { progress, availableAssessments } = useAppContext();

  const pastAssessments = progress?.assessments || [];
  const hasCompletedAssessments = pastAssessments.length > 0;

  return (
    <div className="space-y-10 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Assessments</h1>
        <p className="text-slate-500 mt-2 text-sm">Ukur kemampuan Anda dan pantau perkembangan karir dari waktu ke waktu.</p>
      </div>

      {/* Available Assessments Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <Target className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Ujian Tersedia</h2>
        </div>

        {availableAssessments && availableAssessments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAssessments.map((assessment) => (
              <div 
                key={assessment.id} 
                onClick={() => navigate(`/dashboard/assessments/${assessment.id}`)}
                className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-200 transition-all duration-300 flex flex-col relative group overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    <BookOpen size={24} />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {assessment.duration ? `${assessment.duration} Menit` : '15 Menit'}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-3">
                  {assessment.description || 'Evaluasi kemampuan Anda di bidang ini untuk mendapatkan rekomendasi pembelajaran terbaik.'}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {assessment.category || 'General'}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Lihat Detail <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
            <p className="text-slate-500 font-medium">Belum ada ujian yang ditambahkan oleh admin.</p>
          </div>
        )}
      </section>

      {/* Past Results Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="p-2.5 bg-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <History className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Riwayat Hasil Ujian</h2>
        </div>

        {!hasCompletedAssessments ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-slate-700">
              <History className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={32} />
            </div>
            <h3 className="text-slate-700 font-bold mb-1">Belum Ada Riwayat</h3>
            <p className="text-slate-500 text-sm max-w-sm">Selesaikan ujian pertama Anda untuk melihat skor dan analisis keahlian di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pastAssessments.map((item) => {
              const isExcellent = item.score >= 80;
              const badgeColor = isExcellent ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100';
              
              const checkHighlightClass = isExcellent 
                ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]' 
                : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]';

              return (
                <div 
                  key={item.attemptId} 
                  className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-200 transition-all duration-300 flex flex-col relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="pr-4">
                      <h3 className="text-lg font-extrabold text-slate-800 mb-1.5 leading-tight group-hover:text-indigo-700 transition-colors">
                        {item.title || 'Diagnostic Test'}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        Selesai: {new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="relative flex flex-col items-center shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-inner ${badgeColor}`}>
                        <span className="text-lg font-black">{item.score}</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border-2 border-white shadow-sm">
                        <CheckCircle2 size={16} className={checkHighlightClass} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => navigate(`/dashboard/assessments/result/${item.attemptId}`)}
                      className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Lihat Hasil Lengkap <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}