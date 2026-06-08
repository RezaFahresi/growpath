import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Sparkles, History } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AssessmentList() {
  const navigate = useNavigate();
  const { progress, availableAssessments } = useAppContext();

  const pastAssessments = progress?.assessments || [];
  const primaryAssessment = availableAssessments?.[0];
  const hasCompletedAssessments = pastAssessments.length > 0;

  return (
    <div className="space-y-10 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Assessments</h1>
        <p className="text-slate-500 mt-2 text-sm">Measure your skills and track your growth over time.</p>
      </div>

      {/* Banner Section */}
      {!hasCompletedAssessments ? (
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 rounded-3xl p-8 md:p-10 shadow-xl shadow-indigo-200/50">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4 inline-block backdrop-blur-md border border-white/30">
              New User
            </span>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">Unlock Your Learning Path</h2>
            <p className="text-indigo-50 mb-8 text-base leading-relaxed opacity-90">
              Take your first talent mapping assessment to discover your strengths and get personalized course recommendations.
            </p>
            <button 
              onClick={() => navigate(`/dashboard/assessments/take/${primaryAssessment?.id || 1}`)}
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-50 hover:scale-[1.02] transition-all shadow-lg"
            >
              Start First Assessment <ChevronRight size={18} />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50/80 to-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm flex flex-col md:flex-row items-center justify-between group">
          <div className="relative z-10 mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-indigo-950 flex items-center gap-3 mb-1.5">
              <div className="p-2 bg-slate-800 rounded-xl shadow-md flex items-center justify-center">
                <Sparkles className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={20} />
              </div>
              Ready for another challenge?
            </h2>
            <p className="text-sm text-slate-500 font-medium ml-12">Take a new assessment to update your dynamic skills profile.</p>
          </div>
          <button 
            onClick={() => navigate(`/dashboard/assessments/take/${primaryAssessment?.id || 1}`)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm group-hover:scale-[1.02]"
          >
            Take New Assessment <ChevronRight size={18} />
          </button>
        </section>
      )}

      {/* Past Results Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <History className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Past Results</h2>
        </div>

        {!hasCompletedAssessments ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-slate-700">
              <History className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={32} />
            </div>
            <h3 className="text-slate-700 font-bold mb-1">No History Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm">Complete your first assessment to see your scores and skill breakdowns here.</p>
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
                        {item.title || 'React Fundamentals Test'}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        Completed: {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                      View Full Detail <ChevronRight size={16} />
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