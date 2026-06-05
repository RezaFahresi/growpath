const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// ==========================================
// 1. PANGGIL KONEKSI DATABASE
// ==========================================
require('./config/db.js'); 

// Inisialisasi Express (Hanya boleh dipanggil SATU KALI)
const app = express();

// ==========================================
// 2. PENGATURAN PROXY & CORS (VERCEL DYNAMIC)
// ==========================================
// Wajib ditambahkan agar Express percaya pada proxy Vercel
app.set('trust proxy', 1);

const corsOptions = {
  // Izinkan otomatis dari URL Preview Vercel manapun
  origin: function (origin, callback) {
    callback(null, origin || '*');
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Wajib true untuk session/cookie
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware manual untuk menangani Preflight Request (OPTIONS)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
});

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
// 4. KONFIGURASI SESSION
// ==========================================
app.use(session({
  name: 'growpath_sid', 
  secret: process.env.SESSION_SECRET || 'growpath-super-secret-key', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    // Di Vercel (production) harus true agar cookie HTTPS berjalan
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000 // 24 Jam
  }
}));

// ==========================================
// 5. ROUTES
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
    message: 'GrowPath API Service is Active on Vercel',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 6. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("🚨 BACKEND ERROR LOG:", err.stack);
  res.status(500).json({ 
    message: 'Terjadi kesalahan internal pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================
// 7. EXPORT UNTUK VERCEL SERVERLESS
// ==========================================
// HAPUS app.listen(), kita ganti dengan module.exports agar Vercel bisa membacanya
module.exports = app;