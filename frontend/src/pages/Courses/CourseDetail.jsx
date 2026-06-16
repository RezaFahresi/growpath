import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Lock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';
import Swal from 'sweetalert2';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // MENGAMBIL FUNGSI addNotification DARI CONTEXT
  const { courses, markCourseCompleted, addNotification } = useAppContext();

  const course = courses?.find(c => String(c.id) === String(id) || String(c._id) === String(id));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const playerRef = useRef(null);

  const currentVideoId = course?.video_id || 'mU6anWqZJcc'; 
  const currentImageUrl = course?.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop';

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
        //Event deteksi video selesai (state 0 = ended)
        onStateChange: (e) => {
          if (e.data === 0) {
            setIsVideoFinished(true);
            
            // NOTIFIKASI SAAT VIDEO SELESAI
            addNotification(
              'Materi Video Selesai!', 
              'Bagus sekali! Tombol "Selesaikan Kelas" sekarang sudah terbuka.', 
              'info'
            );

            Swal.fire({
                title: 'Video Selesai!',
                text: 'Sekarang Anda bisa menyelesaikan kelas ini.',
                icon: 'info',
                timer: 2000
            });
          }
        }
      }
    });
  };

  const handleFinishCourse = async () => {
    //Proteksi: Cek apakah video sudah selesai
    if (!isVideoFinished) {
      Swal.fire('Tonton Video!', 'Harap tonton video hingga selesai sebelum menyelesaikan kelas.', 'warning');
      return;
    }

    if (!course || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await API.post(`/courses/${course.id || course._id}/complete`);
      if (markCourseCompleted) markCourseCompleted(course.id || course._id);
      
      // OTIFIKASI KETIKA KELAS BERHASIL DISELESAIKAN
      addNotification(
        'Kelas Diselesaikan!', 
        `Selamat! Anda telah menyelesaikan materi "${course.title}".`, 
        'success'
      );

      await Swal.fire({
        title: 'Luar Biasa!',
        text: 'Anda telah berhasil menyelesaikan kelas ini.',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
      navigate('/dashboard/progress');
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <button onClick={() => navigate('/dashboard/courses')} className="flex items-center gap-2 text-slate-500 font-semibold hover:text-indigo-600">
        <ChevronLeft size={16} /> Kembali ke Daftar
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div 
            className="bg-slate-900 rounded-[2rem] aspect-video flex items-center justify-center overflow-hidden border border-slate-200 relative bg-cover bg-center"
            style={{ backgroundImage: !isPlaying ? `url(${currentImageUrl})` : 'none' }}
          >
            {!isPlaying ? (
              <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center backdrop-blur-[1px]">
                <button onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                  <Play size={36} fill="white" />
                </button>
              </div>
            ) : (
              <div id={`Youtubeer-${course.id || course._id}`} className="w-full h-full" />
            )}
          </div>

          <div className="bg-white p-8 mt-6 rounded-[2.5rem] border shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-800">{course.title}</h1>
            <p className="text-slate-600 mt-4">{course.description}</p>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Kurikulum Kelas</h2>

            {/*TOMBOL DENGAN LOGIKA DISABLED */}
            <button 
              onClick={handleFinishCourse} 
              disabled={isSubmitting || !isVideoFinished} 
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isVideoFinished 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Memproses...' : !isVideoFinished ? (
                <><Lock size={18} /> Tonton Video Dahulu</>
              ) : (
                <><CheckCircle size={18} /> Selesaikan Kelas</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}