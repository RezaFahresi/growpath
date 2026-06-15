const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');

// Route GET untuk mengambil data
router.get('/', authMiddleware, roadmapController.getRoadmaps);

// Route POST bawaan user
router.post('/progress', authMiddleware, roadmapController.toggleProgress);
router.post('/toggle-progress', authMiddleware, roadmapController.toggleProgress);

// ROUTE BARU KHUSUS ADMIN
router.post('/', authMiddleware, roadmapController.createRoadmap); // Tambah Roadmap
router.post('/:roadmapId/modules', authMiddleware, roadmapController.addModule); // Tambah Modul ke Roadmap tertentu
router.delete('/:id', authMiddleware, roadmapController.deleteRoadmap); // Hapus Roadmap
// Tambahkan 2 rute ini di bawah rute modul sebelumnya
router.put('/modules/:moduleId', authMiddleware, roadmapController.updateModule);
router.delete('/modules/:moduleId', authMiddleware, roadmapController.deleteModule);

module.exports = router;