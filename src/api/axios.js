import axios from 'axios';

// Gunakan URL Railway jika di Vercel (production), 
// atau biarkan kosong (agar pakai proxy Vite) jika di komputer lokal (development)
const baseURL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL 
  : '';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // WAJIB TRUE agar cookie session dari backend tersimpan di browser
});

export default api;