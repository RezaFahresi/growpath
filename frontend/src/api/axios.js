import axios from 'axios';

const api = axios.create({
  // Kita tambahkan + '/api' di belakang URL Vercel
  // Dan kita gunakan '/api' untuk mode lokal agar ditangkap oleh proxy Vite
  baseURL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL + '/api' 
    : '/api', 
  withCredentials: true, 
});

export default api;