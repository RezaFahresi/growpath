import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google'; 
import API from '../api/axios';

// IMPORT LOGO GAMBAR
import LogoGrowPath from '../assets/logo-growpath.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post('/auth/login-user', { email, password });
      const data = response.data;

      // PERBAIKAN: Gunakan key 'growpath_user' agar sinkron dengan AppContext
      localStorage.setItem('token', data.token);
      localStorage.setItem('growpath_user', JSON.stringify(data.user));
      
      await login(data.user);

      const role = (data.user.role || '').toLowerCase();
      
      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        if (location.state && location.state.isNewUser) {
          navigate('/dashboard/assessments/overview/1');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Email atau password salah!');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        
        const data = res.data;
        
        // PERBAIKAN: Gunakan key 'growpath_user'
        localStorage.setItem('token', data.token); 
        localStorage.setItem('growpath_user', JSON.stringify(data.user));
        
        await login(data.user); 
        
        const role = (data.user.role || '').toLowerCase();
        
        if (role === 'superadmin') {
          navigate('/superadmin');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          if (location.state && location.state.isNewUser) {
            navigate('/dashboard/assessments/overview/1');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        alert(error.response?.data?.message || 'Gagal masuk dengan Google');
      }
    },
    onError: () => {
      alert('Login Google dibatalkan.');
    }
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
            Selamat datang <br/> kembali.
          </h2>
          <p className="text-indigo-200/90 text-lg leading-relaxed">
            Masuk untuk melanjutkan perjalanan belajarmu, pantau progres harian, dan selesaikan tantangan di roadmap karirmu.
          </p>
        </div>
        
        <div className="relative z-10 text-indigo-300/60 text-sm font-medium">
          © {new Date().getFullYear()} GrowPath. All rights reserved.
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE - FORM CONTAINER */}
      {/* ========================================= */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
          
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Sign In</h3>
            <p className="text-sm text-slate-500 font-medium">Silakan masukkan detail akun Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800"
                placeholder="name@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 px-1">
              <label className="flex items-center text-xs text-slate-500 cursor-pointer font-medium hover:text-slate-800 transition-colors">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer w-4 h-4" />
                Ingat saya
              </label>
              <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-bold">Lupa password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all mt-4 text-sm flex justify-center items-center gap-2 ${
                isLoading ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-[10px] tracking-widest text-slate-400 font-bold uppercase">Atau masuk dengan</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all text-sm font-bold text-slate-700 bg-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Belum punya akun? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Daftar sekarang</Link>
          </p>

        </div>
      </div>
    </div>
  );
}