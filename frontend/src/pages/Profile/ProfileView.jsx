import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Mail, Calendar, User, ShieldCheck, TrendingUp, Clock, BookOpen } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios'; 

export default function ProfileView() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // State untuk menyimpan data statistik yang ditarik dari backend
  const [stats, setStats] = useState({
    totalHours: 0,
    streak: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      // Pastikan user exist sebelum melakukan request
      if (!user) return; 
      
      try {
        const response = await API.get('/progress');
        const result = response.data;
        
        if (result && result.stats) {
          setStats(result.stats);
        }
      } catch (error) {
        console.error("Gagal mengambil data statistik profil:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user]);

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Baru saja bergabung';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[70vh]">
         <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
         <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-sm">Memuat Profil...</p>
       </div>
     );
  }

  return (
    // Margin dan width diseragamkan: w-full max-w-7xl mx-auto
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-8">
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile & Statistics</h1>
      </div>

      {/* ========================================= */}
      {/* MAIN PROFILE CARD */}
      {/* ========================================= */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 relative">
        
        {/* Banner Gradient (Menggunakan warna navy gelap persis seperti dashboard) */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-[#071226] via-slate-900 to-indigo-950 relative overflow-hidden">
        </div>

        <div className="px-6 md:px-12 pb-12">
          {/* Avatar & Header Section */}
          <div className="relative flex flex-col lg:flex-row justify-between items-center lg:items-end -mt-20 lg:-mt-24 mb-10 gap-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 w-full lg:w-auto text-center lg:text-left">
              
              {/* 🔥 PERBAIKAN: Menampilkan Foto Profil jika ada, jika tidak pakai Ikon User */}
              <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white p-2 shadow-2xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#071226] to-slate-800 flex items-center justify-center text-white relative overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} strokeWidth={2} className="relative z-10 text-slate-300" />
                  )}
                </div>
              </div>
              
              <div className="pb-2">
                <div className="flex items-center justify-center lg:justify-start mb-1 gap-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    {user?.name || 'Learner'}
                  </h2>
                </div>
                <p className="text-indigo-600 font-bold tracking-wide uppercase text-sm bg-indigo-50 px-3 py-1 rounded-full inline-block mt-1">
                  {user?.role || 'Active Learner'}
                </p>
              </div>
            </div>

            {/* Tombol Edit */}
            <button 
              onClick={() => navigate('/dashboard/profile/edit')}
              className="w-full lg:w-auto px-8 py-3.5 bg-[#071226] text-white rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#071226]/20"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-12 pt-8 border-t border-slate-100">
            <InfoCard icon={Mail} title="Email Address" value={user?.email || 'N/A'} color="text-indigo-600" bg="bg-indigo-50" />
            <InfoCard icon={MapPin} title="Location" value={user?.location || 'Indonesia'} color="text-emerald-600" bg="bg-emerald-50" />
            <InfoCard icon={Calendar} title="Member Since" value={formatJoinDate(user?.created_at || user?.createdAt)} color="text-cyan-600" bg="bg-cyan-50" />
            <InfoCard icon={ShieldCheck} title="Account Status" value="Verified Account" color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* STATS SECTION */}
      {/* ========================================= */}
      <h2 className="text-2xl font-bold text-slate-800 px-2 pt-4">Your Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={100} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-800 shadow-md flex items-center justify-center mb-6">
            <TrendingUp size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-1">{stats.streak}</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Days Streak</p>
        </div>
        
        {/* Completed Courses Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen size={100} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-800 shadow-md flex items-center justify-center mb-6">
            <BookOpen size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-1">{stats.completed}</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Courses Completed</p>
        </div>

        {/* Total Hours Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock size={100} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-800 shadow-md flex items-center justify-center mb-6">
            <Clock size={24} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-1">{stats.totalHours}<span className="text-2xl text-slate-400">h</span></h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Learning Time</p>
        </div>

      </div>

    </div>
  );
}

// Komponen Pembantu InfoCard
function InfoCard({ icon: Icon, title, value, color, bg }) {
  return (
    <div className="flex items-center gap-5 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/60 hover:bg-slate-50 hover:shadow-sm transition-all group">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{title}</p>
        <p className="text-base md:text-lg font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}