import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { Users, ClipboardCheck, Network, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import API from '../../api/axios';

// Import komponen ApexCharts
import CourseEnrollmentsChart from '../../components/CourseEnrollmentsChart'; 
import AssessmentPassRateChart from '../../components/AssessmentPassRateChart';

export default function AdminDashboard() {
  // PERBAIKAN: Set state default yang aman agar tidak undefined
  const [data, setData] = useState({ 
    stats: { 
      totalUsers: 0, 
      activeAssessments: 0, 
      highPotential: 0, // Disesuaikan dengan backend baru
      progress: 0,
      talentDistribution: [] 
    }, 
    recentActivities: [],
    trendingPaths: []
  });
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Default data grafik agar UI tidak kosong saat awal render
  const defaultTalentData = [
    { subject: 'Web Dev', score: 85 }, 
    { subject: 'UI/UX', score: 65 },
    { subject: 'Data Sci', score: 45 },
    { subject: 'Mobile', score: 70 },
    { subject: 'Soft Skill', score: 90 },
    { subject: 'DevOps', score: 55 }
  ];

  const recentEnrollments = [20, 35, 40, 55, 60, 80, 110];
  const recentDates = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const recentPassRates = [78, 85, 92, 88];
  const recentCategories = ['HTML/CSS', 'JS Basic', 'React', 'UI/UX'];

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mengambil data ASLI dari backend
        const response = await API.get('/admin/stats');
        
        // Memastikan data ter-set dengan benar
        if (response.data) {
          setData({
            stats: response.data.stats || data.stats,
            recentActivities: response.data.recentActivities || [],
            trendingPaths: response.data.trendingPaths || []
          });
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const talentData = data.stats?.talentDistribution?.length > 0 
    ? data.stats.talentDistribution 
    : defaultTalentData;

  //PERBAIKAN: Menggunakan data.stats yang diambil dari backend
  const statCards = [
    { title: 'Total Users', val: data.stats?.totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Assessments', val: data.stats?.activeAssessments || 0, icon: ClipboardCheck, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { title: 'High Potential', val: data.stats?.highPotential || 0, icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }, // Mengganti Matches menjadi High Potential
    { title: 'Avg. Progress', val: `${data.stats?.progress || 0}%`, icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
  ];

  if (!mounted) return null;

  if (loading) {
    return <div className="p-8 text-slate-500 flex items-center justify-center h-full">Memuat Data Dashboard...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Pantau statistik pengguna, analitik keahlian, dan performa platform secara real-time.</p>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-[#0B172E] p-6 rounded-2xl border border-[#1E2A45] shadow-lg flex items-center gap-5 group hover:border-[#2A3B5D] transition-colors">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.border} border`}>
              <s.icon size={24} className={s.color} />
            </div>
            <div>
              <p className="text-slate-400 text-[11px] uppercase font-bold tracking-wider mb-1">{s.title}</p>
              <p className="text-3xl font-black text-white">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- AREA DAFTAR DATA ASLI (TAMBAHAN BARU) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Aktivitas Terbaru */}
        <div className="bg-[#0B172E] p-6 rounded-[2rem] border border-[#1E2A45] shadow-xl">
          <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-orange-400" /> Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((act, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#1E2A45] pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-white">{act.name}</p>
                    <p className="text-xs text-slate-400">{act.action || `Menyelesaikan kuis: ${act.assessment_name}`}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {act.time || new Date(act.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Belum ada aktivitas.</p>
            )}
          </div>
        </div>

        {/* Roadmap Trending */}
        <div className="bg-[#0B172E] p-6 rounded-[2rem] border border-[#1E2A45] shadow-xl">
          <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Tren Roadmap Karir
          </h2>
          <div className="space-y-4">
            {data.trendingPaths.length > 0 ? (
              data.trendingPaths.map((trend, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#1E2A45] pb-3 last:border-0">
                  <p className="text-sm font-bold text-white">{trend.title}</p>
                  <span className="text-xs font-bold px-3 py-1 bg-[#071226] text-blue-400 rounded-lg border border-[#1E2A45]">
                    {trend.match || `${trend.completion_count} User`}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Belum ada data tren.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- AREA GRAFIK (CHARTS) TETAP SAMA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAFIK 1: Radar Chart */}
        <div className="bg-[#0B172E] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] h-[400px] flex flex-col shadow-xl">
          <div className="mb-4">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Network size={18} className="text-blue-400" /> Distribusi Talenta
            </h2>
            <p className="text-xs text-slate-400 mt-1">Pemetaan keahlian pengguna secara keseluruhan.</p>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center -ml-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={talentData}>
                <PolarGrid stroke="#1E2A45" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1B33', borderColor: '#1E2A45', color: '#fff', borderRadius: '12px' }} 
                  itemStyle={{ color: '#60A5FA', fontWeight: 'bold' }} 
                />
                <Radar name="Skor Rata-rata" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAFIK 2: Course Enrollments */}
        <div className="bg-[#0B172E] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] h-[400px] flex flex-col shadow-xl">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Tren Pendaftaran Baru
            </h2>
            <p className="text-xs text-slate-400 mt-1">Aktivitas pendaftaran dalam 7 hari terakhir.</p>
          </div>
          <div className="relative flex-1 w-full bg-[#071226]/50 rounded-2xl border border-[#1E2A45]/50 overflow-hidden">
            <div className="absolute inset-0 pt-4">
              <CourseEnrollmentsChart dataSeries={recentEnrollments} categories={recentDates} />
            </div>
          </div>
        </div>

        {/* GRAFIK 3: Assessment Pass Rates */}
        <div className="bg-[#0B172E] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] h-[400px] flex flex-col shadow-xl lg:col-span-2">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-400" /> Tingkat Kelulusan Ujian
            </h2>
            <p className="text-xs text-slate-400 mt-1">Persentase kelulusan berdasarkan kategori materi.</p>
          </div>
          <div className="relative flex-1 w-full bg-[#071226]/50 rounded-2xl border border-[#1E2A45]/50 overflow-hidden">
            <div className="absolute inset-0 pt-4">
              <AssessmentPassRateChart dataSeries={recentPassRates} categories={recentCategories} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}