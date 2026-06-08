const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware'); // Wajib Import

// 🌟 PERBAIKAN: Hapus /user/:userId dan gunakan authMiddleware
router.get('/', authMiddleware, progressController.getUserProgress);

module.exports = router;