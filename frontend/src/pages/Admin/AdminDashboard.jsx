import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { Users, ClipboardCheck, Network, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import API from '../../api/axios';

// Import komponen ApexCharts
import CourseEnrollmentsChart from '../../components/CourseEnrollmentsChart'; 
import AssessmentPassRateChart from '../../components/AssessmentPassRateChart';

export default function AdminDashboard() {
  const [data, setData] = useState({ 
    stats: { 
      totalUsers: 0, 
      activeAssessments: 0, 
      matches: 0, 
      progress: 0,
      talentDistribution: [] 
    }, 
    recentActivities: [] 
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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
        // Backend akan memvalidasi Token JWT dari Header
        const response = await API.get('/admin/stats');
        setData(response.data);
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

  const statCards = [
    { title: 'Total Users', val: data.stats?.totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Assessments', val: data.stats?.activeAssessments || 0, icon: ClipboardCheck, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { title: 'Career Matches', val: data.stats?.matches || 0, icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Avg. Progress', val: `${data.stats?.progress || 0}%`, icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
  ];

  if (!mounted) return null;

  // Jangan render konten jika belum mounted (mencegah bug chart)
  if (!mounted) {
    return <div className="p-8 text-slate-500 flex items-center justify-center h-full">Memuat Dashboard...</div>;
  }

  return (
    // Margin diseragamkan dengan menambahkan w-full max-w-7xl mx-auto agar fit in
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Pantau statistik pengguna, analitik keahlian, dan performa platform.</p>
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

      {/* --- AREA GRAFIK (CHARTS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAFIK 1: Radar Chart (Talent Distribution) */}
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
                  contentStyle={{ backgroundColor: '#0F1B33', borderColor: '#1E2A45', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                  itemStyle={{ color: '#60A5FA', fontWeight: 'bold' }} 
                />
                <Radar name="Skor Rata-rata" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAFIK 2: Course Enrollments (Area Chart) */}
        <div className="bg-[#0B172E] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] h-[400px] flex flex-col shadow-xl">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Tren Pendaftaran Baru
            </h2>
            <p className="text-xs text-slate-400 mt-1">Aktivitas pendaftaran dalam 7 hari terakhir.</p>
          </div>
          
          <div className="relative flex-1 w-full bg-[#071226]/50 rounded-2xl border border-[#1E2A45]/50 overflow-hidden">
            {/* Wrapper diatur agar ApexCharts dapat menghitung 100% width/height dengan benar */}
            <div className="absolute inset-0 pt-4">
              <CourseEnrollmentsChart dataSeries={recentEnrollments} categories={recentDates} />
            </div>
          </div>
        </div>

        {/* GRAFIK 3: Assessment Pass Rates (Bar Chart) */}
        <div className="bg-[#0B172E] p-6 md:p-8 rounded-[2rem] border border-[#1E2A45] h-[400px] flex flex-col shadow-xl lg:col-span-2">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-400" /> Tingkat Kelulusan Ujian
            </h2>
            <p className="text-xs text-slate-400 mt-1">Persentase kelulusan berdasarkan kategori materi.</p>
          </div>
          
          <div className="relative flex-1 w-full bg-[#071226]/50 rounded-2xl border border-[#1E2A45]/50 overflow-hidden">
            {/* Wrapper diatur agar ApexCharts dapat menghitung 100% width/height dengan benar */}
            <div className="absolute inset-0 pt-4">
              <AssessmentPassRateChart dataSeries={recentPassRates} categories={recentCategories} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}