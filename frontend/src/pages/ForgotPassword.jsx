import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // 1. IMPORT INSTANCE AXIOS PUSAT

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 2. GUNAKAN AXIOS (Tidak perlu headers, method, atau JSON.stringify lagi!)
      await API.post('/auth/forgot-password', { email });

      // Jika sukses, ubah tampilan ke layar sukses
      setIsSubmitted(true);
    } catch (err) {
      // 3. MENANGKAP ERROR KHUSUS DARI AXIOS
      // err.response.data.message mengambil pesan kiriman dari backend res.status().json()
      setError(err.response?.data?.message || 'Gagal mengirim email reset password. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Login
        </button>

        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
            <p className="text-slate-500 text-sm mb-6">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {/* Menampilkan Pesan Error Jika Gagal */}
            {error && (
              <div className="p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm">
              We have sent a password reset link to <span className="font-bold text-slate-700">{email}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}