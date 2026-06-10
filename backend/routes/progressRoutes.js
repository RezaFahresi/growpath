const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware'); // Wajib Import

// PERBAIKAN: Hapus /user/:userId dan gunakan authMiddleware
router.get('/', authMiddleware, progressController.getUserProgress);

// TAMBAHAN: Rute untuk mengecek progress course saat halaman baru dibuka
router.get('/courses/:id', authMiddleware, progressController.checkCourseStatus);

module.exports = router;