import axios from 'axios';
import { supabase } from '../lib/supabaseClient'; // Pastikan path ini sesuai dengan file yang baru Anda buat

const api = axios.create({
  // baseURL menyesuaikan dengan setup Vite Proxy atau Vercel Rewrites Anda
  baseURL: '/api', 
  withCredentials: true, 
});

// Menambahkan Interceptor Request untuk menyisipkan Token otomatis
api.interceptors.request.use(
  async (config) => {
    try {
      // 1. Ambil sesi/token yang sedang aktif langsung dari brankas Supabase di browser
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Kesalahan saat mengambil sesi Supabase:", error.message);
        return config;
      }

      // 2. Jika sesi valid dan ada token, sisipkan ke Headers sebagai bukti otorisasi
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error("Axios Interceptor Error:", err.message);
    }
    
    // 3. Lanjutkan request agar dikirim ke backend
    return config;
  },
  (error) => {
    // Tangani error jika request gagal dibuat sebelum dikirim
    return Promise.reject(error);
  }
);

export default api;