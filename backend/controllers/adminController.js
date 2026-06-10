// backend/controllers/adminController.js
const AdminModel = require('../models/adminModel');
const db = require('../config/db'); // Pastikan Anda memiliki akses ke db pool

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Ambil data asli dari Model/Database
    const totalUsers = await AdminModel.getTotalUsers();
    const activeAssessments = await AdminModel.getTotalAssessments();
    
    // 2. 🔥 DINAMIS: Ambil jumlah 'High Potential' dari tabel talent_mappings
    const talentResult = await db.query(
      "SELECT COUNT(*) FROM talent_mappings WHERE potential = 'High'"
    );
    const highPotentialCount = talentResult.rows[0].count;

    // 3. Aktivitas Terbaru (bisa diambil dari tabel user_activities jika ada)
    // Untuk sementara tetap gunakan format yang sama agar UI tidak rusak
    const recentActivity = [
      { name: 'Emma Stone', action: 'completed the "Tech Core" assessment', time: '2m ago' },
      { name: 'James Wilson', action: 'matched with "AI Product Manager"', time: '15m ago' }
    ];

    // 4. Trending Paths (bisa Anda ambil berdasarkan seringnya user masuk ke roadmap tertentu)
    const trending = [
      { title: 'AI Product Manager', match: '98%' },
      { title: 'Data Storyteller', match: '94%' },
      { title: 'Cloud Architect', match: '89%' }
    ];

    res.json({
      stats: { 
        totalUsers, 
        activeAssessments, 
        highPotential: highPotentialCount, // Menampilkan data asli
        progress: 92 
      },
      recentActivities: recentActivity,
      trendingPaths: trending
    });
  } catch (err) {
    console.error("Error Admin Dashboard:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};