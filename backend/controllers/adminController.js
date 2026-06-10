const AdminModel = require('../models/adminModel');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Ambil data dasar (Gunakan let agar aman jika gagal)
    let totalUsers = 0;
    let activeAssessments = 0;
    let highPotentialCount = 0;

    try {
      totalUsers = await AdminModel.getTotalUsers();
      activeAssessments = await AdminModel.getTotalAssessments();
      highPotentialCount = await AdminModel.getHighPotentialCount(); // Memanggil fungsi dari Model
    } catch (e) {
      console.warn("Peringatan: Gagal mengambil statistik dasar:", e.message);
    }

    // 2. Ambil Aktivitas Terbaru secara Dinamis
    let recentActivity = [];
    try {
      recentActivity = await AdminModel.getRecentActivities();
    } catch (e) {
      console.warn("Peringatan: Tabel assessment_results mungkin belum ada.", e.message);
      // Fallback jika tabel belum ada agar tidak Error 500
      recentActivity = []; 
    }

    // 3. Ambil Tren Roadmap secara Dinamis
    let trending = [];
    try {
      trending = await AdminModel.getTrendingRoadmaps();
    } catch (e) {
      console.warn("Peringatan: Tabel user_roadmap_progress mungkin belum ada.", e.message);
      // Fallback jika tabel belum ada agar tidak Error 500
      trending = []; 
    }

    // 4. Kirim semua data asli ke Frontend
    res.json({
      stats: { 
        totalUsers, 
        activeAssessments, 
        highPotential: highPotentialCount,
        progress: 92 // (Opsional: bisa dibuat dinamis nanti)
      },
      recentActivities: recentActivity,
      trendingPaths: trending
    });
    
  } catch (err) {
    console.error("🚨 Error Fatal Admin Dashboard:", err);
    res.status(500).json({ 
      message: 'Server Error pada Admin Dashboard',
      detail: err.message
    });
  }
};