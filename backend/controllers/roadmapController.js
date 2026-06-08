const RoadmapModel = require('../models/roadmapModel');

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapModel.getAllRoadmaps();
    res.json(roadmaps);
  } catch (error) {
    console.error("Error getRoadmaps:", error);
    res.status(500).json({ message: 'Failed to get roadmaps' });
  }
};

exports.toggleProgress = async (req, res) => {
  try {
    // 1. Pastikan user login via JWT
    if (!req.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu.' });
    }

    // 2. Ambil userId dari token JWT (req.user.id)
    const userId = req.user.id;
    const { phaseId, taskId } = req.body;

    // 3. Simpan progress
    const result = await RoadmapModel.toggleRoadmapProgress(userId, phaseId, taskId);
    
    if (result.status === 'removed') {
      return res.json({ message: 'Task berhasil di-uncheck dan jam belajar dikurangi', status: 'removed' });
    } else {
      return res.json({ message: 'Task berhasil di-check dan jam belajar ditambahkan', status: 'added' });
    }
  } catch (error) {
    console.error("Error toggle roadmap progress:", error);
    res.status(500).json({ message: 'Gagal menyimpan progress roadmap' });
  }
};