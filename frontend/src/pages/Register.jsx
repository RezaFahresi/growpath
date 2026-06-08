import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google'; 
import API from '../api/axios'; 

// IMPORT LOGO GAMBAR
import LogoGrowPath from '../assets/logo-growpath.png'; 

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext(); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Password tidak cocok!');
    if (!agreeTerms) return alert('Anda harus menyetujui Syarat & Ketentuan.');

    setIsLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      
      if (res.data && res.data.token) {
        // 🌟 PERBAIKAN: Gunakan key 'growpath_user'
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('growpath_user', JSON.stringify(res.data.user));
        
        await login(res.data.user); 
        navigate('/dashboard/assessments/overview/1');
      } else {
        alert('Registrasi berhasil! Silakan login untuk memulai.');
        navigate('/login', { state: { isNewUser: true } });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post('/auth/google', { access_token: tokenResponse.access_token });
        const data = res.data;
        
        // 🌟 PERBAIKAN: Gunakan key 'growpath_user'
        localStorage.setItem('token', data.token); 
        localStorage.setItem('growpath_user', JSON.stringify(data.user));
        
        await login(data.user); 
        
        const role = (data.user.role || '').toLowerCase();
        if (role === 'superadmin') navigate('/superadmin');
        else if (role === 'admin') navigate('/admin');
        else navigate('/dashboard/assessments/overview/1');
        
      } catch (error) {
        console.error("Google Auth Error:", error);
        alert(error.response?.data?.message || 'Gagal registrasi dengan Google');
      }
    },
    onError: () => alert('Registrasi Google dibatalkan.')
  });

  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      
      {/* ========================================= */}
      {/* LEFT SIDE - BRANDING (PREMIUM DARK MODE) */}
      {/* ========================================= */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-12 relative overflow-hidden">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500 blur-[120px]"></div>
           <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-400 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-indigo-500/30 bg-indigo-900">
            <img src={LogoGrowPath} alt="GrowPath Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">GrowPath</span>
        </div>
        
        <div className="relative z-10 max-w-lg mb-20">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Mulai petualangan <br/> belajarmu.
          </h2>
          <p className="text-indigo-200/90 text-lg leading-relaxed">
            Buat akun sekarang untuk membuka akses ke roadmap yang dipersonalisasi, kuis interaktif, dan materi pembelajaran berkualitas tinggi.
          </p>
        </div>
        
        <div className="relative z-10 text-indigo-300/60 text-sm font-medium">
          © {new Date().getFullYear()} GrowPath. All rights reserved.
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE - FORM CONTAINER */}
      {/* ========================================= */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center my-auto">
          
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Create Account</h3>
            <p className="text-sm text-slate-500 font-medium">Bergabunglah dengan GrowPath hari ini.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="name@example.com" />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg></button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg></button>
              </div>
            </div>
            
            <div className="pt-2 px-1">
              <label className="flex items-start text-xs text-slate-500 cursor-pointer font-medium hover:text-slate-800 transition-colors">
                <input type="checkbox" required checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 mr-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4 cursor-pointer shrink-0" />
                <span className="leading-snug">Saya setuju dengan <a href="#" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Syarat</a> & <a href="#" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Kebijakan Privasi</a></span>
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all mt-6 text-sm flex justify-center items-center gap-2 ${
                isLoading ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.