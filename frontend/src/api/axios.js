import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  // withCredentials: true ADALAH KUNCI UTAMA AGAR BROWSER MENGIRIM COOKIE
  withCredentials: true, 
});

// Tidak perlu interceptor apa pun di sini!
// Browser akan otomatis mengirim Session Cookie ke rute /api

export default api;