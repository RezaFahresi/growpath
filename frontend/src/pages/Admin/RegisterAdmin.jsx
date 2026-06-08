import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../../api/axios'; 

// IMPORT LOGO GAMBAR
import LogoGrowPath from '../../assets/logo-growpath.png'; 

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Menambahkan role: 'admin' agar backend tahu ini akun admin
      await API.post('/auth/register', { 
        ...formData, 
        role: 'admin' 
      });

      alert('Registrasi Administrator Berhasil! Silakan masuk.');
      navigate('/login-admin');
    } catch (err) {
      console.error('Register Error:', err);
      setError(err.response?.data?.message || 'Registrasi gagal, periksa koneksi atau coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#090E17]">
      
      {/* ========================================= */}
      {/* LEFT SIDE - FADING IMAGE ASSET */}
      {/* ========================================= */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          alt="Admin Portal Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-x-[-1]"
        />
        {/* EFEK FADING: Menyatu dengan background sebelah kanan */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090E17]/10 via-[#090E17]/60 to-[#090E17]"></div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE - FLOATING CARD FORM */}
      {/* ========================================= */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        
        <div className="w-full max-w-[420px] flex flex-col items-center my-auto py-10">

          {/* KARTU FORM */}
          <div className="w-full bg-[#131C2F] p-8 sm:p-10 rounded-3xl border border-[#1E2D4A] shadow-2xl relative mt-10">
            
            {/* LOGO DI TENGAH ATAS KARTU */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl overflow-hidden bg-[#090E17] border border-[#1E2D4A] shadow-lg flex items-center justify-center">
              <img src={LogoGrowPath} alt="GrowPath Logo" className="w-full h-full object-cover scale-110" />
            </div>
            
            <div className="text-center mb-8 mt-8">
              <p className="text-blue-500 font-bold text-sm mb-1 tracking-widest uppercase">GrowPath</p>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-400 text-xs font-medium">Register as a new platform administrator</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 ml-1 uppercase">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    name="name"
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full bg-[#090E17] border border-[#1E2D4A] text-slate-200 px-4 py-3.5 pl-11 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600 [color-scheme:dark]" 
                    placeholder="Admin Name" 
                  />
                </div>
              </div>
              
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 ml-1 uppercase">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    name="email"
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full bg-[#090E17] border border-[#1E2D4A] text-slate-200 px-4 py-3.5 pl-11 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600 [color-scheme:dark]" 
                    placeholder="admin@growpath.com" 
                  />
                </div>
              </div>
              
              {/* PASSWORD */}
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
                    className="w-full bg-[#090E17] border border-[#1E2D4A] text-slate-200 px-4 py-3.5 pl-11 pr-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600 [color-scheme:dark]" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-1">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition-all mt-8 text-sm flex justify-center items-center gap-2 ${
                  loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-0.5'
                }`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Daftar Akun <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-8 font-medium">
              Sudah memiliki akses? <Link to="/login-admin" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign In</Link>
            </p>
          </div>

          {/* FOOTER BAWAH */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-slate-500 font-medium">By registering, you agree to our policies.</p>
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}