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

  // 1. Daftar ID Video YouTube yang disesuaikan dengan topik kelas Anda
  const courseVideoIds = {
    1: 'mU6anWqZJcc', // Fullstack Web Dev: FreeCodeCamp HTML/CSS Course
    2: 'VwVg9jCtqaU', // Business & Data Analytics: Data Analytics for Beginners
    3: 'nU-IIXBWlS4', // Digital Marketing: Digital Marketing Full Course
    4: 'c9Wg6Cb_YlU', // UI/UX Design: Figma UI/UX Tutorial
  };

  // 2. 🔥 TAMBAHAN: Daftar Gambar Cover Premium Unsplash yang Sesuai dengan Kelas Anda
  const courseImages = {
    1: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop', // Web Dev (Laptop + Code)
    2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop', // Business Analytics (Grafik/Data)
    3: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop', // Digital Marketing (Strategi/Sosmed)
    4: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2070&auto=format&fit=crop', // UI/UX Design (Wireframe/Sketsa)
  };

  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const playerRef = useRef(null);

  // Menentukan ID video dan Gambar saat ini berdasarkan ID Kelas
  const currentVideoId = courseVideoIds[String(course?.id || course?._id)] || 'mU6anWqZJcc';
  const currentImageUrl = courseImages[String(course?.id || course?._id)] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop';

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
      videoId: currentVideoId,
      playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
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
        className="flex items-center gap-2 text-slate-500 font-semibold hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft size={16} /> Kembali ke Daftar
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          
          {/* CONTAINER VIDEO DENGAN GAMBAR BANNER KELAS YANG COCOK DAN HD */}
          <div 
            className="bg-slate-900 rounded-[2rem] aspect-video flex items-center justify-center overflow-hidden border border-slate-200 relative bg-cover bg-center"
            style={{ backgroundImage: !isPlaying ? `url(${currentImageUrl})` : 'none' }}
          >
            {!isPlaying ? (
              <div className="absolute inset-0 bg-slate-950/50 hover:bg-slate-950/30 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                <button 
                  onClick={() => setIsPlaying(true)} 
                  className="w-20 h-20 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl group"
                >
                  <Play size={36} fill="white" className="ml-2 group-hover:text-indigo-100" />
                </button>
              </div>
            ) : (
              <div id={`Youtubeer-${course.id || course._id}`} className="w-full h-full" />
            )}
          </div>

          <div className="bg-white p-8 mt-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{course.title}</h1>
            <p className="text-slate-600 mt-4 leading-relaxed">{course.description}</p>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Kurikulum Kelas</h2>

            <button 
              onClick={handleFinishCourse} 
              disabled={isSubmitting} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? 'Memproses...' : 'Selesaikan Kelas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}