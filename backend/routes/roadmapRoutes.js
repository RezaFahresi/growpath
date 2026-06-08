const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware'); // Wajib Import

// 🌟 PERBAIKAN: Gunakan authMiddleware
router.get('/', authMiddleware, roadmapController.getRoadmaps);

// Menyediakan 2 rute untuk mencegah error typo dari frontend
router.post('/progress', authMiddleware, roadmapController.toggleProgress);
router.post('/toggle-progress', authMiddleware, roadmapController.toggleProgress);

module.exports = router;