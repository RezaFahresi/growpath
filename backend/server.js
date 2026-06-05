const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==========================================
// 1. PENGATURAN PROXY & CORS (SANGAT PENTING)
// ==========================================
// Wajib ditambahkan agar Express percaya pada load balancer Railway 
// sehingga cookie session (HTTPS) tidak diblokir oleh browser
app.set('trust proxy', 1);

// Ambil URL Frontend dari Environment Variable (di Railway nanti)
// Jika belum disetting, akan otomatis pakai localhost untuk testing di komputer
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: frontendURL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Wajib true agar session/cookie bisa dikirim antar domain (Vercel ke Railway)
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware manual untuk menangani Preflight Request (OPTIONS)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', frontendURL);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
});

// Tambahan: Header Keamanan (misal untuk pop-up Google OAuth)
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// ==========================================
// 2. MIDDLEWARE DASAR
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. KONFIGURASI SESSION
// ==========================================
app.use(session({
  name: 'growpath_sid', 
  secret: process.env.SESSION_SECRET || 'growpath-super-secret-key', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    // Di production (Railway) harus true (HTTPS), di lokal false (HTTP)
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    // Beda domain (Railway & Vercel) = 'none', localhost = 'lax'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000 // 24 Jam
  }
}));

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
app.get('/', (req, res) => {
  res.json({ 
    status: 'Running',
    message: 'GrowPath API Service is Active',
    frontend_allowed: frontendURL,
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
// 6. JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 GrowPath Backend Ready on port ${PORT}`);
  console.log(`📡 CORS Origin Allowed: ${frontendURL}`);
  console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
});