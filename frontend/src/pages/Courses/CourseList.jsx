import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { PlayCircle, Clock, BookOpen, Search, Sparkles, SlidersHorizontal, Lock } from 'lucide-react';
import API from '../../api/axios'; // Pastikan path ini sesuai dengan letak axios Anda

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [dbCompletedIds, setDbCompletedIds] = useState([]); // State khusus untuk data dari Database
  const navigate = useNavigate();
  
  const { courses, progress } = useAppContext();
  const dbCourses = courses || [];
  
  // ========================================================
  // 1. TARIK DATA PROGRESS DARI DATABASE SAAT HALAMAN DIBUKA
  // ========================================================
  useEffect(() => {
    const fetchRealProgress = async () => {
      try {
        const response = await API.get('/progress');
        // Pastikan kita mendapatkan data activeCourses dari backend
        if (response.data && response.data.activeCourses) {
          // Cari course yang statusnya isCompleted = true, lalu jadikan format String
          const completedFromDB = response.data.activeCourses
            .filter(course => course.isCompleted)
            .map(course => String(course.courseId));
          
          setDbCompletedIds(completedFromDB);
        }
      } catch (error) {
        console.error("Gagal mengambil data progress murni:", error);
      }
    };
    
    fetchRealProgress();
  }, []);

  // 2. GABUNGKAN DATA (Context + Database) AGAR AKURAT 100%
  const contextCompletedIds = (progress?.completedCourses || []).map(id => String(id));
  const completedCourses = Array.from(new Set([...contextCompletedIds, ...dbCompletedIds]));

  // ========================================================
  // LOGIKA ANTI-DUPLIKASI
  // ========================================================
  const uniqueCourses = dbCourses.filter(
    (item, index, self) =>
      index === self.findIndex((t) => {
        const isSameId = item.id && t.id === item.id;
        const isSameMongoId = item._id && t._id === item._id;
        return isSameId || isSameMongoId;
      })
  );

  // Logic filter kategori
  const filteredCourses = uniqueCourses.filter(course => {
    if (activeTab === 'Semua') return true;
    
    const tabMap = {
      'Desain': 'design',
      'Frontend': 'frontend',
      'Backend': 'backend'
    };
    
    const targetTab = tabMap[activeTab] || activeTab.toLowerCase().trim();
    const courseCategory = (course.category || '').toLowerCase().trim();
    const courseStatus = (course.status || '').toLowerCase().trim();
    
    return courseCategory === targetTab || courseStatus === targetTab;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 p-4 md:p-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pustaka Kelas</h1>
          <p className="text-slate-500 text-sm mt-1">Pilih kelas IT terbaik yang disesuaikan dengan kebutuhan kompetensimu.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari materi belajar..." 
              className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm font-medium placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm shrink-0">
            <SlidersHorizontal size={16} />
            <span>Saring</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {['Semua', 'Desain', 'Frontend', 'Backend'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-200 shrink-0 ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-500 border border-slate-200/60 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* COURSE GRID (DENGAN LOGIKA GEMBOK) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {filteredCourses.map((course) => {
          const courseId = String(course.id || course._id);
          const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
          const courseImage = course.image && course.image !== '[null]' ? course.image : fallbackImage;

          // LOGIKA KUNCI: Cek ID kelas sebelumnya
          const originalIndex = uniqueCourses.findIndex(c => String(c.id || c._id) === courseId);
          const prevCourseId = originalIndex > 0 
            ? String(uniqueCourses[originalIndex - 1].id || uniqueCourses[originalIndex - 1]._id) 
            : null;

          // Gembok terbuka jika index ke-0 ATAU kelas sebelumnya ada di dalam array completedCourses
          const isLocked = originalIndex > 0 && !completedCourses.includes(prevCourseId);

          return (
            <div 
              key={courseId} 
              className={`bg-white rounded-[2.2rem] overflow-hidden border border-slate-200/80 transition-all duration-300 flex flex-col relative ${
                isLocked ? 'opacity-80 grayscale-[0.2]' : 'shadow-sm hover:shadow-xl hover:-translate-y-1.5 group'
              }`}
            >
              {!isLocked && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
              )}

              {/* THUMBNAIL AREA */}
              <div className="relative h-52 md:h-56 bg-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={courseImage} 
                  alt={course.title} 
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isLocked ? 'opacity-40' : 'opacity-80 group-hover:scale-105 group-hover:opacity-60'
                  }`} 
                />
                
                {isLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm z-10">
                    <div className="w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center shadow-lg border border-slate-600/50 mb-3">
                      <Lock size={28} className="text-slate-300" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-900/60 px-3 py-1 rounded-full">Terkunci</span>
                  </div>
                ) : (
                  <div 
                    onClick={() => navigate(`/dashboard/courses/${courseId}`)}
                    className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                  >
                    <PlayCircle size={56} className="text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                )}
              </div>
              
              {/* CONTENT AREA */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider border ${
                    isLocked ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {course.category || 'Umum'}
                  </span>
                </div>

                <h3 
                  onClick={() => !isLocked && navigate(`/dashboard/courses/${courseId}`)}
                  className={`text-xl font-extrabold mb-2 line-clamp-1 transition-colors ${
                    isLocked ? 'text-slate-500' : 'text-slate-800 hover:text-indigo-600 cursor-pointer'
                  }`}
                >
                  {course.title}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                  {course.description && course.description !== '[null]' ? course.description : 'Pelajari keahlian esensial dan studi kasus mendalam pada kelas akselerasi kompetensi ini.'}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-100 pt-5 mb-6 mt-auto">
                  <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                    <div className="p-1 bg-slate-800 rounded-md">
                      <BookOpen size={14} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    </div>
                    {course.lessons || 0} Modul
                  </span>
                  <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                    <div className="p-1 bg-slate-800 rounded-md">
                      <Clock size={14} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                    </div>
                    {course.duration || 'Mandiri'}
                  </span>
                </div>
                
                {/* Enroll Action Button */}
                <button 
                  disabled={isLocked}
                  onClick={() => navigate(`/dashboard/courses/${courseId}`)}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
                    isLocked 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock size={16} />
                      <span>Selesaikan Kelas Sebelumnya</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Belajar</span>
                      <Sparkles size={16} className="opacity-80" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-lg">Tidak ada kelas yang tersedia.</p>
            <p className="text-slate-400 text-sm mt-1">Silakan pilih tab kategori materi atau filter pencarian lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}