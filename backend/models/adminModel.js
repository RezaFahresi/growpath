// Menghitung jumlah talenta berdasarkan kategori 9-Box (misalnya High Potential)
exports.getHighPotentialCount = async () => {
  const result = await db.query("SELECT COUNT(*) FROM talent_mappings WHERE potential = 'High'");
  return parseInt(result.rows[0].count) || 0;
};

// Mengambil 5 aktivitas terbaru dari hasil ujian
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

// Mengambil tren jalur karir (Roadmap) yang paling banyak diambil
exports.getTrendingRoadmaps = async () => {
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