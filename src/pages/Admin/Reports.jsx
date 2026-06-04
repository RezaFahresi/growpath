import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Users, BookOpen, ClipboardCheck, TrendingUp, Download, ArrowUpRight, Calendar } from 'lucide-react';

import CourseEnrollmentsChart from '../../components/CourseEnrollmentsChart'; 
import AssessmentPassRateChart from '../../components/AssessmentPassRateChart';

export default function Reports() {
  const { courses, availableAssessments, talentMappings } = useAppContext();

  // Menambahkan properti "trend", "glowColor", beserta "color" (glow) & "bg" (abu-tua) standar admin
  const stats = [
    { 
      title: 'Total Courses', 
      value: courses?.length || 0, 
      icon: BookOpen, 
      color: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]', 
      bg: 'bg-[#071226] border border-[#1E2A45] shadow-md',
      glowColor: 'bg-blue-500',
      trend: '+3 this month'
    },
    { 
      title: 'Assessments', 
      value: availableAssessments?.length || 0, 
      icon: ClipboardCheck, 
      color: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]', 
      bg: 'bg-[#071226] border border-[#1E2A45] shadow-md',
      glowColor: 'bg-emerald-500',
      trend: '+5 this month'
    },
    { 
      title: 'Mapped Talents', 
      value: talentMappings?.length || 0, 
      icon: Users, 
      color: 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]', 
      bg: 'bg-[#071226] border border-[#1E2A45] shadow-md',
      glowColor: 'bg-purple-500',
      trend: '+12% growth'
    },
    { 
      title: 'Completion Rate', 
      value: '84%', 
      icon: TrendingUp, 
      color: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]', 
      bg: 'bg-[#071226] border border-[#1E2A45] shadow-md',
      glowColor: 'bg-amber-500',
      trend: '+2.4% vs last mo'
    },
  ];

  // --- Simulasi Data dari Backend ---
  const backendEnrollmentData = [30, 40, 35, 50, 49, 70, 90]; 
  const backendEnrollmentDates = ["1 May", "5 May", "10 May", "15 May", "20 May", "25 May", "30 May"];

  const backendPassRateData = [84, 92, 75, 88];
  const backendPassRateCategories = ['React Basics', 'Vue Intro', 'JS Logic', 'UI/UX'];
  // --------------------------------------------

  return (
    // Margin diseragamkan: w-full max-w-7xl mx-auto agar fit in
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of learning progress, enrollments, and system metrics.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 w-full sm:w-auto">
          <Download size={16} strokeWidth={2.5} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0B172E] p-6 rounded-[1.5rem] border border-[#1E2A45] shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            {/* Subtle background glow effect */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 blur-3xl opacity-20 rounded-full ${stat.glowColor}`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              </div>
              {/* Ikon dengan background abu-tua dan efek highlight */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-1.5 text-xs text-slate-500 relative z-10">
              <ArrowUpRight size={14} className="text-emerald-400 drop-shadow-sm" />
              <span className="text-slate-300 font-medium">{stat.trend.split(' ')[0]}</span>
              <span>{stat.trend.substring(stat.trend.indexOf(' ') + 1)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        
        {/* Course Enrollments Chart Card */}
        <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl flex flex-col overflow-hidden">
          {/* Chart Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1E2A45] bg-[#0F1B33]">
            <div className="flex items-center gap-4">
              {/* Ikon Header Diperbarui dengan background & highlight */}
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <BarChart className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Course Enrollments</h3>
                <p className="text-xs text-slate-400 mt-0.5">Registration trends over time</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-[#071226] px-4 py-2 rounded-xl border border-[#1E2A45] hover:text-white hover:bg-[#1E2A45] transition-colors shadow-sm">
              <Calendar size={14} />
              Last 30 Days
            </button>
          </div>
          
          {/* Chart Body */}
          <div className="p-6 flex-1 min-h-[350px] flex items-center justify-center w-full">
            <div className="w-full h-full relative">
              <div className="absolute inset-0">
                <CourseEnrollmentsChart 
                  dataSeries={backendEnrollmentData} 
                  categories={backendEnrollmentDates} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Pass Rates Chart Card */}
        <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl flex flex-col overflow-hidden">
          {/* Chart Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1E2A45] bg-[#0F1B33]">
            <div className="flex items-center gap-4">
              {/* Ikon Header Diperbarui dengan background & highlight */}
              <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
                <TrendingUp className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Assessment Pass Rates</h3>
                <p className="text-xs text-slate-400 mt-0.5">Average scores by category</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-[#071226] px-4 py-2 rounded-xl border border-[#1E2A45] hover:text-white hover:bg-[#1E2A45] transition-colors shadow-sm">
              <Calendar size={14} />
              All Time
            </button>
          </div>
          
          {/* Chart Body */}
          <div className="p-6 flex-1 min-h-[350px] flex items-center justify-center w-full">
            <div className="w-full h-full relative">
              <div className="absolute inset-0">
                <AssessmentPassRateChart 
                  dataSeries={backendPassRateData}
                  categories={backendPassRateCategories}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}