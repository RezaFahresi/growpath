const AssessmentModel = require('../models/assessmentModel');

// Helper untuk validasi role sederhana dari payload JWT
const isAdmin = (user) => user && (user.role === 'admin' || user.role === 'superadmin');

exports.getAssessments = async (req, res) => {
  try {
    const data = await AssessmentModel.getAllAssessments();
    res.json(data);
  } catch (error) {
    console.error("Error getAssessments:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssessment = async (req, res) => {
  try {
    // 1. Cek dari req.user (hasil dari authMiddleware)
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak. Hanya Admin.' });
    
    const { title, category, duration, description } = req.body;
    if (!title || !category || !duration) return res.status(400).json({ message: 'Semua field wajib diisi.' });

    const newAsm = await AssessmentModel.createAssessment(title, category, duration, description);
    res.status(201).json(newAsm);
  } catch (error) {
    console.error("Error createAssessment:", error);
    res.status(500).json({ message: 'Gagal membuat soal kuis.' });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak.' });
    
    const id = parseInt(req.params.id, 10);
    const { title, category, duration, description } = req.body;
    if (!title || !category || !duration) return res.status(400).json({ message: 'Field wajib diisi.' });

    const rows = await AssessmentModel.updateAssessment(id, title, category, duration, description);
    if (rows.length === 0) return res.status(404).json({ message: 'Assessment tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updateAssessment:", error);
    res.status(500).json({ message: 'Gagal mengedit soal kuis.' });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak.' });
    const id = parseInt(req.params.id, 10);
    await AssessmentModel.deleteAssessment(id);
    res.json({ message: 'Assessment template berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteAssessment:", error);
    res.status(500).json({ message: 'Gagal menghapus template.' });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    // Gunakan req.user.id (user biasa)
    if (!req.user) return res.status(401).json({ message: 'Silakan login.' });
    if (isAdmin(req.user)) return res.status(403).json({ message: 'Admin tidak boleh mengerjakan kuis.' });

    const userId = parseInt(req.user.id, 10);
    const { assessment_id, score, timeSpentHours } = req.body;
    const hours = timeSpentHours || 0.5;

    const skillCategory = await AssessmentModel.getAssessmentCategory(assessment_id);
    const result = await AssessmentModel.submitAssessmentResult(userId, assessment_id, score, hours, skillCategory);
    
    res.json({ message: 'Hasil berhasil disimpan!', data: result });
  } catch (error) {
    console.error("Error submitAssessment:", error);
    res.status(500).json({ message: 'Gagal menyimpan hasil.' });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Silakan login.' });
    if (isAdmin(req.user)) return res.json([]); 

    const data = await AssessmentModel.getUserResultsHistory(req.user.id);
    res.json(data);
  } catch (error) {
    console.error("Error getUserResults:", error);
    res.status(500).json({ message: 'Gagal mengambil riwayat.' });
  }
};

exports.getResultDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid.' });

    if (!req.user) return res.status(401).json({ message: 'Sesi tidak ditemukan.' });

    // Kita berikan userId atau adminId berdasarkan req.user
    const userId = isAdmin(req.user) ? null : req.user.id;
    const adminId = isAdmin(req.user) ? req.user.id : null;

    const rows = await AssessmentModel.getResultDetail(id, userId, adminId);
    if (rows.length === 0) return res.status(404).json({ message: 'Data tidak ditemukan.' });
    
    res.json(rows[0]);
  } catch (error) {
    console.error("🚨 Error Detail:", error.message);
    res.status(500).json({ message: 'Server error detail.' });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak!' });
    const id = parseInt(req.params.id, 10);
    
    const rowCount = await AssessmentModel.deleteResult(id);
    if (rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan.' });
    
    res.json({ message: 'Riwayat kuis berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteResult:", error);
    res.status(500).json({ message: 'Gagal menghapus data riwayat.' });
  }
};