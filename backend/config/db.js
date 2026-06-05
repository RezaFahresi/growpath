const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // HANYA gunakan connectionString ini, jangan ada host, user, atau password terpisah
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) console.error("🚨 Database Connection Error:", err.stack);
  else console.log("✅ Supabase Connected!");
});

module.exports = pool;