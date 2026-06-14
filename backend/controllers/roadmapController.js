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

// FUNGSI BARU UNTUK ADMIN
exports.createRoadmap = async (req, res) => {
  try {
    const newRoadmap = await RoadmapModel.createRoadmap(req.body);
    res.status(201).json({ message: 'Roadmap berhasil ditambahkan', data: newRoadmap });
  } catch (error) {
    console.error("Error createRoadmap:", error);
    res.status(500).json({ message: 'Gagal menambah roadmap' });
  }
};

exports.addModule = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const newModule = await RoadmapModel.addModule(roadmapId, req.body);
    res.status(201).json({ message: 'Modul berhasil ditambahkan', data: newModule });
  } catch (error) {
    console.error("Error addModule:", error);
    res.status(500).json({ message: 'Gagal menambah modul' });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    await RoadmapModel.deleteRoadmap(id);
    res.json({ message: 'Roadmap berhasil dihapus' });
  } catch (error) {
    console.error("Error deleteRoadmap:", error);
    res.status(500).json({ message: 'Gagal menghapus roadmap' });
  }
};

// FUNGSI BAWAAN USER PROGRESS (TIDAK DIUBAH)
exports.toggleProgress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu.' });
    }

    const userId = req.user.id;
    const { phaseId, taskId } = req.body;

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