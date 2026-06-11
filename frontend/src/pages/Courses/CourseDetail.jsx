import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';
import Swal from 'sweetalert2';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, markCourseCompleted } = useAppContext();

  const course = courses?.find(c => String(c.id) === String(id) || String(c._id) === String(id));

  const courseVideoIds = {
    1: 'nu_pCVPKzTk', 
    2: 'OvoFCEFkglw', 
    3: 'bixR-KIJKYM', 
    4: 'c9Wg6Cb_YlU', 
  };

  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const checkPreviousProgress = async () => {
      try {
        const response = await API.get(`/progress/courses/${id}`);
        if (response.data?.isCompleted) {
          const total = Array.isArray(course?.lessons) ? course.lessons.length : Number(course.lessons);
          setCompletedLessons(Array.from({ length: total || 0 }).map((_, i) => i));
        }
      } catch (error) {
        console.log("Belum ada riwayat progres.");
      }
    };

    if (course) checkPreviousProgress();
  }, [id, course]);

  useEffect(() => {
    if (isPlaying && course) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    }
  }, [isPlaying, course]);

  const initializePlayer = () => {
    if (!course) return;

    playerRef.current = new window.YT.Player(`Youtubeer-${course.id || course._id}`, {
      videoId: courseVideoIds[String(course.id || course._id)] || 'c9Wg6Cb_YlU',
      playerVars: { autoplay: 1, rel: 0 },
      events: { 
        onStateChange: (e) => e.data === 0 && handleVideoCompletion() 
      }
    });
  };

  const handleVideoCompletion = () => {
    handleFinishCourse();
  };

  const handleFinishCourse = async () => {
    if (!course || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await API.post(`/courses/${course.id || course._id}/complete`);

      if (markCourseCompleted) {
        markCourseCompleted(course.id || course._id);
      }
      
      await Swal.fire({
        title: 'Luar Biasa!',
        text: 'Anda telah berhasil menyelesaikan kelas ini.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        confirmButtonText: 'Lanjutkan',
        background: '#ffffff',
        color: '#1e293b'
      });

      navigate('/dashboard/progress');

    } catch (error) {
      console.error('Complete Course Error:', error);

      await Swal.fire({
        title: 'Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Coba Lagi',
        background: '#ffffff',
        color: '#1e293b'
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <button 
        onClick={() => navigate('/dashboard/courses')} 
        className="flex items-center gap-2 text-slate-500 font-semibold hover:text-indigo-600"
      >
        <ChevronLeft size={16} /> Kembali ke Daftar
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-slate-950 rounded-[2rem] aspect-video flex items-center justify-center overflow-hidden border border-slate-200">
            {!isPlaying ? (
              <button 
                onClick={() => setIsPlaying(true)} 
                className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:scale-110 transition"
              >
                <Play size={32} fill="white" />
              </button>
            ) : (
              <div id={`Youtubeer-${course.id || course._id}`} className="w-full h-full" />
            )}
          </div>

          <div className="bg-white p-8 mt-6 rounded-[2.5rem] border">
            <h1 className="text-3xl font-extrabold text-slate-800">{course.title}</h1>
            <p className="text-slate-600 mt-4">{course.description}</p>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Kurikulum</h2>

            <button 
              onClick={handleFinishCourse} 
              disabled={isSubmitting} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Selesaikan Kelas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}