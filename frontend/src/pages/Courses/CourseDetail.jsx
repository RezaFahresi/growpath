import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle2, PlayCircle, BookOpen, Award, Lock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { courses, markCourseCompleted } = useAppContext();

  const course = courses?.find(c => String(c.id) === String(id) || String(c._id) === String(id));

  const courseVideoIds = {
    1: 'c9Wg6Cb_YlU', 
    2: 'TNhaISOUy6Q',
    3: 'Oe421EPjeBE', 
  };

  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const playerRef = useRef(null);

  useEffect(() => {
    if (isPlaying && course && (courseVideoIds[course.id] || courseVideoIds[course._id])) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isPlaying, course]);

  const initializePlayer = () => {
    if (!course) return;
    const currentId = course.id || course._id;
    
    playerRef.current = new window.YT.Player(`Youtubeer-${currentId}`, {
      videoId: courseVideoIds[String(currentId)] || 'c9Wg6Cb_YlU',
      playerVars: {
        autoplay: 1, 
        rel: 0,      
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 0) { // Video selesai (state 0)
      handleVideoCompletion();
    }
  };

  const handleVideoCompletion = () => {
    if (course?.lessons && Array.isArray(course.lessons)) {
      const allLessonIds = course.lessons.map(l => l.id);
      setCompletedLessons(allLessonIds);
    } else if (course?.lessons && !isNaN(course.lessons)) {
      const allLessonIds = Array.from({ length: Number(course.lessons) }).map((_, i) => i);
      setCompletedLessons(allLessonIds);
    }
    
    handleFinishCourse();
  };

  const handleFinishCourse = async () => {
    if (!course) return;
    const currentId = course.id || course._id;

    try {
      setIsSubmitting(true);
      
      // Request ini akan otomatis menggunakan header Authorization dengan Token JWT.
      // Backend (req.user.id) akan mendeteksi user mana yang menyelesaikan kursus ini.
      await API.post(`/courses/${currentId}/complete`);

      // Mengupdate state lokal di AppContext agar UI langsung berubah selesai
      if (markCourseCompleted) markCourseCompleted(currentId);
      
      alert("🎉 Selamat! Kelas berhasil diselesaikan.");
      navigate('/dashboard/progress');
      
    } catch (error) {
      console.error("Error menyelesaikan kelas:", error);
      alert(`Gagal: ${error.response?.data?.message || 'Terjadi kesalahan pada server.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLesson = (lessonId, isLocked) => {
    if (isLocked) return;

    let newCompleted;
    if (completedLessons.includes(lessonId)) {
      newCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      newCompleted = [...completedLessons, lessonId];
    }
    setCompletedLessons(newCompleted);
  };

  // --- TAMPILAN JIKA COURSE TIDAK DITEMUKAN ---
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 w-full max-w-7xl mx-auto">
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm text-center max-w-md">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Kelas Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-8">Maaf, materi yang Anda cari tidak tersedia atau telah dipindahkan.</p>
          <button
            onClick={() => navigate('/dashboard/courses')}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 w-full"
          >
            Kembali ke Pustaka
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = Array.isArray(course.lessons) ? course.lessons.length : (Number(course.lessons) || 1);
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- TOMBOL KEMBALI --- */}
      <button
        onClick={() => navigate('/dashboard/courses')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold group w-max"
      >
        <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-300 transition-colors">
          <ChevronLeft size={16} />
        </div>
        Kembali ke Daftar Kelas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: VIDEO PLAYER & DESKRIPSI */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CONTAINER VIDEO */}
          <div className="bg-slate-950 rounded-[2rem] aspect-video relative overflow-hidden shadow-xl shadow-slate-200/50 group border border-slate-200">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={course.image && course.image !== '[null]' ? course.image : "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200"}
                  alt="Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/30 hover:bg-white hover:text-indigo-600 hover:scale-110 transition-all duration-300 z-10"
                >
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              </div>
            ) : (
              <div id={`Youtubeer-${course.id || course._id}`} className="w-full h-full"></div>
            )}
          </div>

          {/* DESKRIPSI MATERI */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {course.category || 'Kelas IT'}
              </span>
              
              <span className="text-slate-500 text-sm font-bold flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded-md shadow-sm">
                  <BookOpen size={14} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" />
                </div>
                {totalLessons} Modul Tersedia
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-500 font-medium mb-8 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 text-xs font-bold shadow-md">
                {course.author ? course.author.charAt(0).toUpperCase() : 'G'}
              </span>
              Oleh <span className="text-slate-700">{course.author || 'Pakar GrowPath'}</span>
            </p>

            <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Tentang Kelas Ini</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {course.description && course.description !== '[null]' ? course.description : "Pelajari konsep fundamental dan lanjutan melalui kelas ini. Kelas dirancang agar mudah dipahami, berorientasi pada studi kasus riil, dan mempersiapkan Anda untuk tantangan di dunia industri sebenarnya."}
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: SYLLABUS / COURSE CONTENT */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden lg:sticky lg:top-8 flex flex-col max-h-[85vh]">
            
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800 mb-1">Kurikulum</h2>
              <p className="text-sm text-slate-500 mb-5 font-medium">Lacak progres belajarmu di sini</p>
              
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-indigo-600">{progressPercentage}% Selesai</span>
                <span className="text-slate-400">{completedLessons.length} / {totalLessons}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
              {course.lessons && Array.isArray(course.lessons) ? (
                course.lessons.map((lesson, idx) => {
                  const isChecked = completedLessons.includes(lesson.id);
                  const isLocked = idx > 0 && !completedLessons.includes(course.lessons[idx - 1].id);
                  const isActive = !isLocked && !isChecked; 

                  return (
                    <div
                      key={lesson.id || idx}
                      onClick={() => toggleLesson(lesson.id, isLocked)}
                      className={`group p-4 rounded-2xl transition-all border ${
                        isLocked 
                          ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                          : isActive 
                          ? 'bg-indigo-50 border-indigo-200 cursor-pointer' 
                          : isChecked 
                          ? 'bg-emerald-50/30 border-transparent hover:bg-emerald-50 cursor-pointer'
                          : 'bg-transparent border-transparent hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 shrink-0">
                          {isLocked ? (
                            <Lock size={20} className="text-slate-300" />
                          ) : isChecked ? (
                            <CheckCircle2 size={20} className="text-emerald-500 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                          ) : isActive ? (
                            <PlayCircle size={20} className="text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-slate-200 rounded-full bg-white group-hover:border-slate-300 transition-colors"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-sm font-bold transition-colors leading-snug ${
                            isLocked ? 'text-slate-400' : isActive ? 'text-indigo-900' : isChecked ? 'text-emerald-800' : 'text-slate-600 group-hover:text-slate-800'
                          }`}>
                            {idx + 1}. {lesson.title}
                          </p>
                          <p className={`text-xs mt-1 font-medium ${isLocked ? 'text-slate-300' : 'text-slate-400'}`}>
                            {lesson.duration || 'Video Materi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : course.lessons && (!isNaN(course.lessons) || typeof course.lessons === 'number') ? (
                Array.from({ length: Number(course.lessons) || 0 }).map((_, idx) => {
                  const isChecked = completedLessons.includes(idx);
                  const isLocked = idx > 0 && !completedLessons.includes(idx - 1);
                  const isActive = !isLocked && !isChecked;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleLesson(idx, isLocked)}
                      className={`group p-4 rounded-2xl transition-all border ${
                        isLocked 
                          ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                          : isActive 
                          ? 'bg-indigo-50 border-indigo-200 cursor-pointer' 
                          : isChecked 
                          ? 'bg-emerald-50/30 border-transparent hover:bg-emerald-50 cursor-pointer'
                          : 'bg-transparent border-transparent hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 shrink-0">
                          {isLocked ? (
                            <Lock size={20} className="text-slate-300" />
                          ) : isChecked ? (
                            <CheckCircle2 size={20} className="text-emerald-500 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                          ) : isActive ? (
                            <PlayCircle size={20} className="text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-slate-200 rounded-full bg-white group-hover:border-slate-300 transition-colors"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-sm font-bold transition-colors leading-snug ${
                            isLocked ? 'text-slate-400' : isActive ? 'text-indigo-900' : isChecked ? 'text-emerald-800' : 'text-slate-600 group-hover:text-slate-800'
                          }`}>
                            {idx + 1}. Pengenalan Modul Pembelajaran
                          </p>
                          <p className={`text-xs mt-1 font-medium ${isLocked ? 'text-slate-300' : 'text-slate-400'}`}>
                            Belajar Mandiri
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : null}

              {(!course.lessons || Number(course.lessons) === 0) && (
                <div className="text-center py-10 px-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl shadow-md flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} className="text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.6)]" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Belum ada modul yang ditambahkan ke kelas ini.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
              <button
                onClick={handleFinishCourse}
                disabled={isSubmitting || completedLessons.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all shadow-sm ${
                  isSubmitting || completedLessons.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Award size={18} className="text-amber-400" />
                    Selesaikan Kelas
                  </>
                )}
              </button>
              {completedLessons.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-wider">
                  Selesaikan materi untuk membuka modul selanjutnya
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}