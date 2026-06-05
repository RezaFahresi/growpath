const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
  // WAJIB UNTUK RAILWAY: Aktifkan SSL jika berjalan di Production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Langsung test koneksi agar terlihat di log Railway
pool.connect()
  .then(() => console.log('✅ PostgreSQL Database Connected Successfully!'))
  .catch((err) => console.error('❌ PostgreSQL Connection Error:', err.message));

module.exports = pool;