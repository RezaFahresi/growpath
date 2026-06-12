import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google'; 
import API from '../api/axios';
import Swal from 'sweetalert2';

import LogoGrowPath from '../assets/logo-growpath.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const goAfterLogin = (role) => {
    if (role === 'superadmin') {
      navigate('/superadmin');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      // 🔥 PERBAIKAN: Arahkan ke daftar assessment, BUKAN ke id 1
      if (location.state && location.state.isNewUser) {
        navigate('/dashboard/assessments'); 
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Email dan password wajib diisi.'
      });
    }

    setIsLoading(true);

    Swal.fire({
      title: 'Sedang Masuk...',
      text: 'Mohon tunggu...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Pastikan endpoint backend Anda benar (login-user atau login)
      const response = await API.post('/auth/login-user', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('growpath_user', JSON.stringify(data.user));

      await login(data.user);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang kembali!',
        timer: 1500,
        showConfirmButton: false
      });

      const role = (data.user.role || '').toLowerCase();
      goAfterLogin(role);

    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.response?.data?.message || 'Email atau password salah!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        Swal.fire({
          title: 'Memproses...',
          text: 'Mohon tunggu...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const res = await API.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });

        const data = res.data;

        localStorage.setItem('token', data.token);
        localStorage.setItem('growpath_user', JSON.stringify(data.user));

        await login(data.user);

        Swal.close();

        await Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: 'Berhasil masuk dengan Google',
          timer: 1500,
          showConfirmButton: false
        });

        const role = (data.user.role || '').toLowerCase();
        goAfterLogin(role);

      } catch (error) {
        console.error("Google Login Error:", error);

        Swal.fire({
          icon: 'error',
          title: 'Google Login Gagal',
          text: error.response?.data?.message || 'Gagal masuk dengan Google'
        });
      }
    },

    onError: () => {
      Swal.fire({
        icon: 'warning',
        title: 'Dibatalkan',
        text: 'Login Google dibatalkan.'
      });
    }
  });

  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-12 relative overflow-hidden">
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

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
          
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Sign In</h3>
            <p className="text-sm text-slate-500 font-medium">Silakan masukkan detail akun Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  {showPassword ? 'Sembunyi' : 'Lihat'}
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

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-[10px] tracking-widest text-slate-400 font-bold uppercase">Atau masuk dengan</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all text-sm font-bold text-slate-700 bg-white"
          >
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