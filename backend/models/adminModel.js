// 🔥 Wajib ada di baris paling atas agar 'db' didefinisikan
const db = require('../config/db');

// 1. Mengambil total user
exports.getTotalUsers = async () => {
  const result = await db.query('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0].count) || 0;
};

// 2. Mengambil total ujian
exports.getTotalAssessments = async () => {
  const result = await db.query('SELECT COUNT(*) FROM assessments');
  return parseInt(result.rows[0].count) || 0;
};

// 3. Mengambil total talenta 'High Potential'
exports.getHighPotentialCount = async () => {
  const result = await db.query("SELECT COUNT(*) FROM talent_mappings WHERE potential = 'High'");
  return parseInt(result.rows[0].count) || 0;
};

// 4. Mengambil 5 aktivitas ujian terbaru
exports.getRecentActivities = async () => {
  const query = `
    SELECT u.name, a.title as assessment_name, ar.created_at 
    FROM assessment_results ar
    JOIN users u ON ar.user_id = u.id
    JOIN assessments a ON ar.assessment_id = a.id
    ORDER BY ar.created_at DESC
    LIMIT 5
  `;
  const result = await db.query(query);
  return result.rows;
};

// 5. Mengambil tren Roadmap
exports.getTrendingRoadmaps = async () => {
  // Catatan: Jika tabel user_roadmap_progress belum ada di Supabase,
  // query ini akan gagal, tetapi Controller akan menangkap errornya
  // sehingga aplikasi TIDAK akan crash.
  const query = `
    SELECT r.title, COUNT(urp.id) as completion_count
    FROM user_roadmap_progress urp
    JOIN roadmaps r ON urp.roadmap_id = r.id
    GROUP BY r.title
    ORDER BY completion_count DESC
    LIMIT 3
  `;
  const result = await db.query(query);
  return result.rows;
};