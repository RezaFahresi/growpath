const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ==========================================
// 1. PANGGIL KONEKSI DATABASE
// ==========================================
require('./config/db.js'); 

const app = express();

// ==========================================
// 2. PENGATURAN PROXY & CORS (VERCEL DYNAMIC)
// ==========================================
app.set('trust proxy', 1);

// 🔥 PERBAIKAN: Konfigurasi CORS yang lebih spesifik dan aman
const corsOptions = {
  // Izinkan localhost untuk testing, dan domain Vercel untuk live
  origin: ['http://localhost:5173', 'https://growpath-delta.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
  optionsSuccessStatus: 200 // Membantu menghindari masalah di beberapa browser lama
};

app.use(cors(corsOptions));

// 🔥 PERBAIKAN: Tangkap semua Preflight (OPTIONS) menggunakan package cors bawaan
// JANGAN gunakan middleware manual "if (req.method === 'OPTIONS')" lagi!
app.options(/(.*)/, cors(corsOptions));

// Tambahan: Header Keamanan
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// ==========================================
// 3. MIDDLEWARE DASAR
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// 4. ROUTES
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route untuk cek status server
app.get('/api', (req, res) => {
  res.json({ 
    status: 'Running',
    message: 'GrowPath API Service is Active on Vercel (Secured with JWT)',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("🚨 BACKEND ERROR LOG:", err.stack);
  res.status(500).json({ 
    message: 'Terjadi kesalahan internal pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================
// 6. EXPORT UNTUK VERCEL SERVERLESS
// ==========================================
module.exports = app;