import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Brain, BarChart3, ShieldCheck, BookOpen, Star, Menu, Code2, Database, Palette, Shield, Smartphone, LineChart, ChevronRight, Zap, Target, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

// IMPORT LOGO
import LogoGrowPath from '../assets/logo-growpath.png'; // Pastikan path dan nama file sesuai

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans selection:bg-indigo-500/30">

      {/* ========================================= */}
      {/* NAVBAR */}
      {/* ========================================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-indigo-900">
              <img src={LogoGrowPath} alt="GrowPath" className="w-full h-full object-cover scale-110" />
            </div>
            <h1 className="font-black text-slate-800 text-xl tracking-tight">
              GrowPath
            </h1>
          </div>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-semibold">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#careers" className="hover:text-indigo-600 transition-colors">Careers</a>
            <a href="#dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#steps" className="hover:text-indigo-600 transition-colors">How it Works</a>
          </div>

          {/* BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden text-slate-600 hover:text-indigo-600">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* ========================================= */}
      {/* HERO SECTION */}
      {/* ========================================= */}
      <section className="relative pt-40 pb-24 px-5 md:px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold tracking-[0.15em] uppercase text-indigo-600 mb-8 shadow-sm">
              <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              Discover Your Future
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900 mb-8">
              Peta Jalan Menuju
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500">
                Karir Teknologi Anda.
              </span>
            </h1>

            <p className="text-slate-500 leading-relaxed text-lg max-w-xl mb-10 font-medium">
              GrowPath membantu Anda mengenali minat, kekuatan, dan mencocokkannya dengan karir IT terbaik melalui evaluasi AI dan roadmap belajar yang dipersonalisasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              >
                Mulai Sekarang Secara Gratis
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 font-bold shadow-sm hover:shadow-md transition-all"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Personalized AI</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Career Discovery</span>
            </div>
          </motion.div>

          {/* RIGHT CONTENT (Glassmorphism Mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 blur-lg"></div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl p-8 relative z-10">
              
              {/* TOP BAR */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xl mb-1 flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" />
                    Career Match Analytics
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">AI recommendation dashboard</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">98%</div>
              </div>

              {/* PROGRESS BARS */}
              <div className="space-y-6">
                <ProgressItem title="Frontend Development" percent="92%" width="92%" color="from-indigo-500 to-indigo-400" icon={<Code2 size={16} />} />
                <ProgressItem title="UI/UX Design" percent="84%" width="84%" color="from-fuchsia-500 to-pink-400" icon={<Palette size={16} />} />
                <ProgressItem title="Data Analytics" percent="76%" width="76%" color="from-cyan-500 to-sky-400" icon={<LineChart size={16} />} />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}
      <section className="py-16 bg-white border-y border-slate-200/60 relative z-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatCard value="10K+" label="Active Learners" />
            <StatCard value="500+" label="Tech Roadmaps" />
            <StatCard value="95%" label="Success Rate" />
            <StatCard value="50+" label="Tech Careers" />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FEATURES */}
      {/* ========================================= */}
      <section id="features" className="py-32 px-5 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-indigo-600 text-sm font-bold tracking-[0.2em] uppercase mb-4">Powerful Features</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 mb-6 tracking-tight">
              Semua yang Anda butuhkan <br className="hidden md:block" /> untuk memulai karir IT.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Bangun roadmap pembelajaran, eksplorasi karir teknologi, dan analisis keterampilan Anda dengan panduan kecerdasan buatan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard icon={<Brain size={28} />} title="AI Interest Assessment" desc="Temukan kekuatan dan minat terpendam Anda melalui analisis pintar berbasis AI." />
            <FeatureCard icon={<BookOpen size={28} />} title="Personalized Roadmap" desc="Dapatkan jalur pembelajaran yang disusun khusus untuk mencapai tujuan karir Anda." />
            <FeatureCard icon={<BarChart3 size={28} />} title="Skill Tracking" desc="Pantau progres belajar dan lihat analitik perkembangan kompetensi Anda secara real-time." />
            <FeatureCard icon={<ShieldCheck size={28} />} title="Career Matching" desc="Temukan posisi karir yang paling selaras dengan kelebihan dan profil keterampilan Anda." />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CAREERS */}
      {/* ========================================= */}
      <section id="careers" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <p className="text-fuchsia-400 text-sm font-bold tracking-[0.2em] uppercase mb-4">Explore Career Paths</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Jelajahi Karir Teknologi <br className="hidden md:block" /> Masa Depan
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
              Kenali berbagai peluang karir, ekspektasi gaji rata-rata, dan kemampuan spesifik yang dibutuhkan oleh industri.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CareerCard icon={<Code2 />} title="Frontend Developer" salary="$5k - $8k/mo" />
            <CareerCard icon={<Database />} title="Backend Developer" salary="$6k - $10k/mo" />
            <CareerCard icon={<Palette />} title="UI/UX Designer" salary="$4k - $7k/mo" />
            <CareerCard icon={<LineChart />} title="Data Analyst" salary="$7k - $11k/mo" />
            <CareerCard icon={<Shield />} title="Cyber Security" salary="$8k - $12k/mo" />
            <CareerCard icon={<Smartphone />} title="Mobile Developer" salary="$6k - $9k/mo" />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* STEPS */}
      {/* ========================================= */}
      <section id="steps" className="py-32 px-5 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-indigo-600 text-sm font-bold tracking-[0.2em] uppercase mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
              3 Langkah Membangun Karir
            </h2>
            <p className="text-slate-500 text-lg font-medium">Sistem pintar yang dirancang untuk memandu kesuksesan Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-100 -z-10"></div>
            
            <StepCard number="1" title="Take Assessment" desc="Selesaikan tes kepribadian dan evaluasi logika dasar." />
            <StepCard number="2" title="Get Your Roadmap" desc="Terima kurikulum dan peta jalan karir yang dipersonalisasi." />
            <StepCard number="3" title="Learn & Conquer" desc="Ikuti materi, selesaikan tantangan, dan capai tujuanmu." />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* DASHBOARD SHOWCASE */}
      {/* ========================================= */}
      <section id="dashboard" className="py-32 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-20">
            <p className="text-fuchsia-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">Dashboard Showcase</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Pusat Kontrol Belajarmu
            </h2>
            <p className="text-slate-500 text-lg font-medium">Pantau pertumbuhan dan analitik keahlian dalam satu layar interaktif.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-slate-200 shadow-2xl shadow-slate-200/50">
            <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 md:p-10 relative overflow-hidden">
              
              {/* Efek Cahaya di Belakang Gambar */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/20 blur-[120px] pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                <div>
                  <h3 className="font-extrabold text-2xl text-slate-800 mb-1">Performance Analytics</h3>
                  <p className="text-sm font-medium text-slate-500">Pemetaan keahlian berbasis modul yang diselesaikan.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all">Skill Level</button>
                  <button className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-all">Daily Goal</button>
                </div>
              </div>

              {/* AREA GAMBAR (FOTO) */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group bg-slate-100">
                <img 
                  // Kamu bisa mengganti URL gambar ini dengan Screenshot halaman "Progress" aplikasimu nanti!
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Dashboard Analytics Preview" 
                  className="w-full h-auto max-h-[400px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient transparan agar gambar terlihat menyatu */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* TESTIMONIALS */}
      {/* ========================================= */}
      <section className="py-32 px-5 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-indigo-600 text-sm font-bold tracking-[0.2em] uppercase mb-4">Success Stories</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Dipercaya Ribuan Talenta</h2>
            <p className="text-slate-500 text-lg font-medium">Lihat bagaimana GrowPath membantu mereka menemukan karir impian.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard name="Sarah Chen" role="Frontend Developer" initial="S" quote="GrowPath memberiku arah yang jelas. Aku tadinya bingung harus mulai dari mana, sekarang aku sudah bekerja sebagai Frontend Dev!" />
            <TestimonialCard name="Michael Rodriguez" role="Data Analyst" initial="M" quote="Tes AI-nya sangat akurat membaca potensiku. Roadmap yang diberikan sangat terstruktur dan mudah diikuti untuk pemula." />
            <TestimonialCard name="Emily Thompson" role="UI/UX Designer" initial="E" quote="Akhirnya aku menemukan platform yang menggabungkan talent mapping dan course secara bersamaan. Sangat direkomendasikan!" />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CTA SECTION */}
      {/* ========================================= */}
      <section className="px-5 md:px-8 pb-32 bg-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[3rem] px-8 py-24 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <p className="uppercase tracking-[0.2em] text-sm font-bold mb-6 text-indigo-300">Siap Mengubah Masa Depan?</p>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8 tracking-tight">
              Mulai Perjalanan Karir <br className="hidden md:block"/> Teknologi Anda Hari Ini.
            </h2>
            <p className="max-w-2xl mx-auto text-indigo-100/80 mb-12 text-lg font-medium">
              Bergabunglah dengan komunitas pembelajar kami dan buka potensi penuh Anda melalui panduan AI yang revolusioner.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 rounded-2xl bg-white text-indigo-900 font-extrabold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto"
            >
              Daftar Sekarang Gratis <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}
      <footer className="bg-slate-950 text-slate-300 py-20 px-5 md:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-900 border border-slate-700">
                 <img src={LogoGrowPath} alt="GrowPath" className="w-full h-full object-cover scale-110" />
              </div>
              <h2 className="font-black text-2xl text-white tracking-tight">GrowPath</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Platform edukasi cerdas yang membantu siswa menemukan dan mengejar jalur karir IT ideal mereka menggunakan panduan berbasis Artificial Intelligence.
            </p>
          </div>

          <FooterColumn title="Platform" links={['Features', 'Career Roadmaps', 'AI Assessment', 'Pricing']} />
          <FooterColumn title="Company" links={['About Us', 'Careers', 'Contact', 'Blog']} />
          <FooterColumn title="Legal" links={['Privacy Policy', 'Terms of Service', 'Cookie Policy']} />
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>© {new Date().getFullYear()} GrowPath. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========================================= */
/* SUB-COMPONENTS */
/* ========================================= */

function ProgressItem({ title, percent, width, color, icon }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span className="text-slate-400">{icon}</span> {title}
        </p>
        <span className="text-sm font-black text-slate-800">{percent}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width }} />
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center group">
      <h3 className="text-4xl md:text-5xl font-black mb-2 text-indigo-600 group-hover:scale-110 transition-transform duration-300 tracking-tight">
        {value}
      </h3>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-indigo-100 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-8">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function CareerCard({ icon, title, salary }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-slate-800/50 backdrop-blur-md rounded-[2rem] border border-slate-700/50 p-8 hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-700 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-extrabold text-xl mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 font-medium">Jalur Karir Direkomendasikan</p>
      <div className="inline-flex px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wide">
        Est: {salary}
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-200/50 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-8 font-black text-2xl shadow-lg">
        {number}
      </div>
      <h3 className="font-extrabold text-2xl mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote, initial }) {
  return (
    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 md:p-10 hover:shadow-xl hover:bg-white transition-all duration-300">
      <div className="flex items-center gap-1 text-amber-400 mb-8">
        {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={18} />)}
      </div>
      <p className="text-slate-700 font-medium leading-relaxed mb-10 text-lg">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-200">
          {initial}
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 text-lg">{name}</h4>
          <p className="text-sm text-slate-500 font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-extrabold text-white mb-6 uppercase tracking-wider text-sm">{title}</h4>
      <ul className="space-y-4 text-sm font-medium text-slate-400">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="hover:text-indigo-400 transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}