import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Menyesuaikan dengan proxy Vite Anda
});

// Interceptor otomatis untuk menempelkan Token JWT
api.interceptors.request.use(
  (config) => {
    // Ambil token dari Local Storage browser
    const token = localStorage.getItem('token'); 
    
    if (token) {
      // Sisipkan ke Header Authorization dengan format Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;