import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Pastikan ini sesuai dengan setup proxy/Vercel Anda
});

// 1. Interceptor Request: Menempelkan Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor Response: Menangani Token Expired dengan Lebih Pintar
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dapatkan URL API mana yang menyebabkan error 401
      const failedUrl = error.config.url;
      console.error(`🚨 DEBUG: Request ke ${failedUrl} mengembalikan 401 Unauthorized!`);
      
      // 🔥 HANYA hapus token dan log out jika yang gagal adalah check-auth
      if (failedUrl.includes('/auth/check-auth')) {
        console.warn("Sesi benar-benar tidak valid. Mengalihkan ke login...");
        localStorage.removeItem('token');
        localStorage.removeItem('growpath_user');
        
        if (window.location.pathname !== '/login' && window.location.pathname !== '/login-admin') {
          window.location.href = '/login-admin'; // Arahkan admin ke login-admin
        }
      } else {
        console.warn(`Token valid, tetapi Anda tidak memiliki akses ke ${failedUrl}`);
        // Jangan hapus token! Biarkan user tetap di dashboard.
      }
    }
    return Promise.reject(error);
  }
);

export default api;