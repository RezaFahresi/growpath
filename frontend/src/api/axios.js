import axios from 'axios';

const api = axios.create({
  // Cukup gunakan '/api'. 
  // Di lokal akan diurus oleh Vite Proxy, di Production akan diurus oleh Vercel Rewrites.
  baseURL: '/api', 
  withCredentials: true, 
});

export default api;