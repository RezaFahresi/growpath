import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios'; 
import Swal from 'sweetalert2';

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

    if (!name || !email || !password || !confirmPassword) {
      return Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Nama, email, password, dan konfirmasi password wajib diisi.'
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Password Tidak Cocok',
        text: 'Pastikan password dan konfirmasi password sama.'
      });
    }

    if (!agreeTerms) {
      return Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Anda harus menyetujui Syarat & Ketentuan.'
      });
    }

    setIsLoading(true);

    Swal.fire({
      title: 'Membuat Akun...',
      text: 'Mohon tunggu...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await API.post('/auth/register', {
        name,
        email,
        password,
        role: 'user'
      });

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Silakan login untuk memulai.'
      });

      // Mengirim status isNewUser ke halaman login
      navigate('/login', {
        state: { isNewUser: true }
      });

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // FUNGSI BARU: Menangani respons dari Google One Tap & Tombol Direct
  const handleGoogleResponse = async (response) => {
    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Mendaftarkan akun dengan Google...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await API.post('/auth/google', {
        access_token: response.credential
      });

      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('growpath_user', JSON.stringify(data.user));

      await login(data.user);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Berhasil mendaftar dengan akun Google',
        timer: 1500,
        showConfirmButton: false
      });

      const role = (data.user.role || '').toLowerCase();

      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        // Arahkan ke daftar assessment untuk user baru
        navigate('/dashboard/assessments');
      }

    } catch (error) {
      console.error("Google Auth Error:", error);

      Swal.fire({
        icon: 'error',
        title: 'Registrasi Google Gagal',
        text: error.response?.data?.message || 'Gagal registrasi dengan Google'
      });
    }
  };

  // EFEK BARU: Memuat Script Google Identity Services secara otomatis
  useEffect(() => {
    const initializeGoogleOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "4913593618-u6om07sp5dd6vsngp3ek7f8761s662ur.apps.googleusercontent.com", 
          callback: handleGoogleResponse,
          auto_select: false, 
        });

        window.google.accounts.id.prompt();

        const btnContainer = document.getElementById("googleSignUpButton");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: btnContainer.offsetWidth,
            shape: "rectangular",
            logo_alignment: "center",
            text: "signup_with" 
          });
        }
      }
    };

    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    } else {
      initializeGoogleOneTap();
    }
  }, []);

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

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center my-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Create Account</h3>
            <p className="text-sm text-slate-500 font-medium">Bergabunglah dengan GrowPath hari ini.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="name@example.com" />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  {showPassword ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase ml-1">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-slate-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm pr-12 bg-slate-50 hover:bg-slate-100/50 focus:bg-white font-medium text-slate-800" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  {showConfirmPassword ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>
            
            <div className="pt-2 px-1">
              <label className="flex items-start text-xs text-slate-500 cursor-pointer font-medium hover:text-slate-800 transition-colors">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 mr-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4 cursor-pointer shrink-0" />
                <span className="leading-snug">Saya setuju dengan <a href="#" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Syarat</a> & <a href="#" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Kebijakan Privasi</a></span>
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all mt-6 text-sm flex justify-center items-center gap-2 ${
                isLoading ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-[10px] tracking-widest text-slate-400 font-bold uppercase">Atau daftar dengan</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* WADAH TOMBOL GOOGLE DIRECT UNTUK REGISTER */}
          <div className="w-full flex justify-center">
            <div id="googleSignUpButton" className="w-full overflow-hidden rounded-[16px]"></div>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Sudah punya akun? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}