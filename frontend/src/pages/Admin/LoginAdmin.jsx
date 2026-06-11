import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../../api/axios'; 
import LogoGrowPath from '../../assets/logo-growpath.png'; 
import Swal from 'sweetalert2';

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await API.post('/auth/login-admin', formData);
    const { token, user } = response.data;

    const userData = { ...user, role: user.role || 'admin' };

    localStorage.setItem('token', token);
    localStorage.setItem('growpath_user', JSON.stringify(userData));

    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: 'Selamat datang di dashboard admin.',
      background: '#131C2F',
      color: '#ffffff',
      confirmButtonColor: '#2563eb',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = '/admin/dashboard';
    });

  } catch (err) {
    console.error('Login Error:', err);

    const errorMessage = err.response?.data?.message || 'Akses ditolak. Periksa kembali email dan password Anda.';
    setError(errorMessage);

    Swal.fire({
      icon: 'error',
      title: 'Login Gagal!',
      text: errorMessage,
      background: '#131C2F',
      color: '#ffffff',
      confirmButtonColor: '#dc2626'
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#090E17]">
      {/* LEFT SIDE - BACKGROUND */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          alt="Admin Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090E17]/10 via-[#090E17]/60 to-[#090E17]"></div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[420px] bg-[#131C2F] p-10 rounded-3xl border border-[#1E2D4A] shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl overflow-hidden bg-[#090E17] border border-[#1E2D4A] shadow-lg flex items-center justify-center">
            <img src={LogoGrowPath} alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>

          <div className="text-center mb-8 mt-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Sign In</h2>
            <p className="text-slate-400 text-xs font-medium">Access GrowPath administration dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-slate-400 ml-1 uppercase">Admin Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" 
                  name="email"
                  required 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full bg-[#090E17] border border-[#1E2D4A] text-slate-200 px-4 py-3.5 pl-11 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="admin@growpath.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-slate-400 ml-1 uppercase">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required 
                  value={formData.password} 
                  onChange={handleChange}
                  className="w-full bg-[#090E17] border border-[#1E2D4A] text-slate-200 px-4 py-3.5 pl-11 pr-12 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all mt-8 text-sm flex justify-center items-center gap-2 ${
                loading ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40'
              }`}
            >
              {loading ? 'Signing in...' : <>Sign in to Portal <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* AREA REGISTER ADMIN */}
          <div className="mt-8 pt-6 border-t border-[#1E2D4A] text-center">
            <p className="text-slate-400 text-xs font-medium">
              Belum memiliki akun admin?{' '}
              <Link to="/register/admin" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}