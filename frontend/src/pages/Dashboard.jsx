import React, { useState, useEffect, useMemo } from 'react';
import { Target, Trophy, Clock, ArrowRight, Lock, BookOpen, Calendar, PlayCircle, Map, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const { user, progress, setProgress, courses } = useAppContext();
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    streak: 0,
    completed: 0,
    totalHours: 0,
    achievements: 0
  });

  //  State baru untuk menyimpan data Roadmap dari Database
  const [dbRoadmaps, setDbRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setLoading(true);

      try {
        //  Menarik data Progress & Roadmap dari backend secara bersamaan
        const [progressRes, roadmapsRes] = await Promise.all([
          API.get('/progress'),
          API.get('/roadmaps').catch(() => ({ data: [] })) // Fallback jika gagal
        ]);

        const progressData = progressRes.data;

        if (progressData?.stats) {
          setDashboardStats(progressData.stats);
        }

        if (progressData) {
          setProgress(prev => ({
            ...prev,
            ...progressData
          }));
        }

        if (roadmapsRes.data) {
          setDbRoadmaps(roadmapsRes.data);
        }

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, setProgress]);

  // Menggunakan data Roadmap Asli dari Database
  const roadmapSteps = useMemo(() => {
    // Ambil maksimal 4 roadmap untuk ditampilkan di Tracker Dashboard agar desain tidak rusak
    const displayRoadmaps = dbRoadmaps.slice(0, 4);

    return displayRoadmaps.map((roadmap, index) => {
      const totalModules = (roadmap.items || []).length || 1; // Menghindari dibagi 0
      const completedItems = progress?.roadmapChecklist?.[roadmap.id]?.length || 0;
      const progressPercentage = Math.round((completedItems / totalModules) * 100);

      let status = 'Locked';

      if (progressPercentage >= 100) {
        status = 'Done';
      } else if (progressPercentage > 0 || index === 0) {
        status = 'Active';
      }

      return {
        id: roadmap.id,
        title: roadmap.title,
        status
      };
    });
  }, [dbRoadmaps, progress?.roadmapChecklist]);

  const stats = [
    { title: 'Current Streak', value: `${dashboardStats.streak} Days`, icon: Calendar, color: 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]', bg: 'bg-slate-800 shadow-md', border: 'border-slate-100' },
    { title: 'Courses Done', value: dashboardStats.completed.toString(), icon: BookOpen, color: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]', bg: 'bg-slate-800 shadow-md', border: 'border-slate-100' },
    { title: 'Hours Learned', value: `${dashboardStats.totalHours}h`, icon: Clock, color: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]', bg: 'bg-slate-800 shadow-md', border: 'border-slate-100' },
    { title: 'Skills Gained', value: dashboardStats.achievements.toString(), icon: Trophy, color: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]', bg: 'bg-slate-800 shadow-md', border: 'border-slate-100' },
  ];

  const activeCourseIds = progress?.activeCourses?.map(ac => ac.courseId?.toString()) || [];
  const myActiveCourses = courses?.filter(c => activeCourseIds.includes((c.id || c._id)?.toString())) || [];
  const displayCourses = myActiveCourses.length > 0 ? myActiveCourses.slice(0, 2) : courses?.slice(0, 2) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Memuat Workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-indigo-900/10 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <Target size={300} />
        </div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-4 py-1.5 bg-indigo-500/30 text-indigo-200 text-xs font-bold rounded-full border border-indigo-400/30 backdrop-blur-md uppercase tracking-wider inline-block mb-1">
              Dashboard Pembelajaran
            </span>

            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Selamat datang kembali, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
                {user?.name?.split(' ')[0] || 'Learner'}!
              </span>
            </h1>

            <p className="text-indigo-200/90 text-sm md:text-base leading-relaxed">
              Lanjutkan progres belajarmu hari ini. Konsistensi adalah kunci untuk mencapai karir impianmu.
            </p>

            <button 
              onClick={() => navigate('/dashboard/courses')} 
              className="mt-2 px-8 py-3.5 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              Lanjutkan Belajar <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-[1.5rem] border ${stat.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group`}>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-slate-800 mb-1">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Lanjutkan Belajar</h2>
            <button 
              onClick={() => navigate('/dashboard/courses')} 
              className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1 group"
            >
              Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-4">
            {displayCourses.length > 0 ? (
              displayCourses.map((course) => {
                const currentProgress = progress?.activeCourses?.find(ac => ac.courseId?.toString() === (course.id || course._id)?.toString())?.percentage || 0;
                
                return (
                  <div key={course.id || course._id} className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-5 group">
                    <div className="w-full md:w-24 h-40 md:h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative">
                      {course.image && course.image !== '[null]' ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md">
                          <BookOpen size={28} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 font-medium mb-3 line-clamp-1">
                        {course.description && course.description !== '[null]' ? course.description : 'Lanjutkan materi terakhirmu.'}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${currentProgress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 w-8">{currentProgress}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto flex-shrink-0">
                      <button 
                        onClick={() => navigate(`/dashboard/courses/${course.id || course._id}`)} 
                        className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <PlayCircle size={16} /> Lanjutkan
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <BookOpen size={28} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                </div>
                <h3 className="text-slate-700 font-bold mb-1">Belum ada kelas aktif</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Mulai eksplorasi katalog kelas kami dan kembangkan keahlian barumu hari ini.</p>
                <button 
                  onClick={() => navigate('/dashboard/courses')} 
                  className="px-6 py-2.5 bg-white border border-slate-200 text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
                >
                  Jelajahi Pustaka Kelas
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-slate-800 rounded-xl shadow-md">
                <Map size={20} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-800">Tracker Roadmap</h2>
            </div>
            
            <div className="space-y-0 relative ml-2">
              <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-slate-100 -z-10"></div>

              {roadmapSteps.length === 0 ? (
                <p className="text-sm text-slate-500 font-medium py-4 text-center">Belum ada roadmap yang dibuat oleh Admin.</p>
              ) : (
                roadmapSteps.map((step) => (
                  <div key={step.id} className="flex gap-5 items-start relative pb-8 last:pb-0">
                    <div className="relative z-10 bg-white py-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        step.status === 'Done'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : step.status === 'Active'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}>
                        {step.status === 'Done' ? (
                          <CheckCircle2 size={16} />
                        ) : step.status === 'Locked' ? (
                          <Lock size={12} />
                        ) : (
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-1.5 flex-1">
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                        step.status === 'Done'
                          ? 'text-emerald-500'
                          : step.status === 'Active'
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                      }`}>
                        {step.status === 'Done' ? 'Selesai' : step.status === 'Active' ? 'Fase Aktif' : 'Terkunci'}
                      </p>

                      <span className={`text-sm font-bold transition-colors ${
                        step.status === 'Locked' ? 'text-slate-400' : 'text-slate-800'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => navigate('/dashboard/roadmap')} 
              className="w-full mt-10 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 hover:shadow-sm text-sm transition-all flex items-center justify-center gap-2 group"
            >
              Lihat Semua Roadmap <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}