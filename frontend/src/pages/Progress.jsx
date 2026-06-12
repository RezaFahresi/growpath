import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { Target, Zap, Award, Star, Clock, TrendingUp, BookOpen, Trophy, Activity, Hexagon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios';

const iconMap = {
  Target: Target,
  Zap: Zap,
  Award: Award,
  Star: Star,
  Clock: Clock,
  TrendingUp: TrendingUp,
  BookOpen: BookOpen,
  Trophy: Trophy
};

export default function Progress() {
  const { user } = useAppContext();

  const [data, setData] = useState({
    stats: { totalHours: 0, streak: 0, completed: 0, achievements: 0 },
    activityData: [],
    skillData: [],
    badges: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/progress');
        setData((prevData) => ({
          ...prevData,
          ...response.data
        }));
      } catch (error) {
        console.error("Gagal mengambil data progress:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-500 animate-pulse tracking-widest text-sm uppercase">Menarik Data Analitik...</p>
      </div>
    );
  }

  // Diperbarui menjadi 6 item agar membentuk Hexagon (Segienam) sempurna
  const defaultSkillData = [
    { subject: 'Frontend', A: 85, fullMark: 100 },
    { subject: 'Web Dev', A: 70, fullMark: 100 },
    { subject: 'Teknologi', A: 50, fullMark: 100 },
    { subject: 'Marketing', A: 75, fullMark: 100 },
    { subject: 'Bisnis', A: 90, fullMark: 100 },
  ];

  const displaySkillData = data?.skillData?.length > 0
    ? data.skillData
    : defaultSkillData;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-8">

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Progres</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">
          Pantau aktivitas belajarmu, analisis keahlian, dan pamerkan pencapaianmu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Jam Belajar" 
          value={`${data?.stats?.totalHours || 0}h`} 
          icon={Clock} 
          color="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
          bg="bg-slate-800" 
          border="border-slate-100" 
        />
        <StatCard 
          label="Runtutan Belajar" 
          value={`${data?.stats?.streak || 0} Hari`} 
          icon={TrendingUp} 
          color="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" 
          bg="bg-slate-800" 
          border="border-slate-100" 
        />
        <StatCard 
          label="Modul Selesai" 
          value={data?.stats?.completed || 0} 
          icon={BookOpen} 
          color="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
          bg="bg-slate-800" 
          border="border-slate-100" 
        />
        <StatCard 
          label="Pencapaian Diraih" 
          value={data?.stats?.achievements || 0} 
          icon={Trophy} 
          color="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
          bg="bg-slate-800" 
          border="border-slate-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* AKTIVITAS BELAJAR */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl shadow-md">
                  <Activity size={18} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" />
                </div>
                Aktivitas Belajar
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-2">
                Total jam belajar dalam 7 hari terakhir
              </p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.activityData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontWeight: 'bold',
                    color: '#1e293b'
                  }}
                />
                <Bar dataKey="hours" fill="url(#colorIndigo)" radius={[6, 6, 6, 6]} barSize={32} />
                <defs>
                  <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUSI KEAHLIAN (RADAR CHART) */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="mb-4 relative z-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl shadow-md">
                <Hexagon size={18} className="text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.6)]" />
              </div>
              Distribusi Keahlian
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Persentase penguasaan tiap area kompetensi
            </p>
          </div>

          {/* Kotak gelap khusus untuk mempertegas radar chart seperti referensi */}
          <div className="flex-1 w-full min-h-[300px] bg-[#0f172a] rounded-3xl p-4 mt-2 relative z-10 flex items-center justify-center border border-slate-800 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={displaySkillData}>
                {/* Menghapus strokeDasharray agar garis solid dan mengubah warna lebih terang */}
                <PolarGrid gridType="polygon" stroke="#334155" strokeWidth={1} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Penguasaan"
                  dataKey="A"
                  stroke="#3b82f6" /* Biru terang */
                  strokeWidth={3}
                  fill="#2563eb" /* Biru solid */
                  fillOpacity={0.45}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Penguasaan']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-5 text-xs text-slate-400 font-medium text-center relative z-10">
            Area yang lebih luas menunjukkan tingkat penguasaan yang lebih tinggi.
          </div>
        </div>
      </div>

      {/* KOLEKSI LENCANA */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500 pointer-events-none">
          <Award size={150} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 rounded-xl shadow-md">
                <Award size={24} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
              Koleksi Lencana
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Prestasi dan pencapaian yang berhasil kamu raih selama belajar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 relative z-10">
          {data?.badges?.length > 0 ? (
            data.badges.map((badge, idx) => {
              const IconComponent = iconMap[badge.icon_name] || Award;
              return (
                <div key={badge.id || idx} className="group flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-200 border-4 border-white transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 cursor-pointer">
                      <IconComponent size={40} className="text-white drop-shadow-md" />
                      <Star size={12} className="absolute top-3 right-3 text-amber-300 fill-amber-300 opacity-80" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm text-center group-hover:text-indigo-600 transition-colors">
                    {badge.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium text-center mt-1 uppercase tracking-wider">Unlocked</p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Trophy size={28} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
              </div>
              <h3 className="text-slate-700 font-bold mb-1">Belum Ada Pencapaian</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Selesaikan modul dan ujian untuk mendapatkan lencana eksklusif pertamamu!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg, border }) {
  return (
    <div className={`bg-white p-5 md:p-6 rounded-[1.5rem] border ${border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group`}>
      <div className={`w-14 h-14 shrink-0 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <h3 className="text-2xl lg:text-3xl font-black text-slate-800 leading-none mb-1.5 truncate">{value}</h3>
        <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-tight truncate">{label}</p>
      </div>
    </div>
  );
}