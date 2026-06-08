import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
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

// 2. Interceptor Response: Menangani Token Expired
api.interceptors.response.use(
  (response) => response, // Jika sukses, biarkan lewat
  (error) => {
    // Jika backend membalas 401 (Unauthorized / Token Expired)
    if (error.response && error.response.status === 401) {
      console.warn("Sesi telah berakhir. Mengalihkan ke halaman login...");
      
      // Hapus data lokal agar bersih
      localStorage.removeItem('token');
      localStorage.removeItem('growpath_user');
      
      // Cegah infinite loop jika sudah berada di halaman login/register
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;