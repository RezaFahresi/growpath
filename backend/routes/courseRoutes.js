const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware'); // Wajib Import

// PERBAIKAN: Gunakan authMiddleware pada seluruh rute
router.get('/', authMiddleware, courseController.getCourses);
router.post('/', authMiddleware, courseController.createCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);

// Rute untuk menyimpan progress saat tombol "Selesai" diklik
router.post('/:id/complete', authMiddleware, courseController.completeCourse);

module.exports = router;