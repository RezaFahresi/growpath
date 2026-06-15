const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware'); 
// IMPORT MIDDLEWARE SUPERADMIN
const { requireSuperadmin } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, courseController.getCourses);

// Admin biasa boleh membuat dan mengedit kelas
router.post('/', authMiddleware, courseController.createCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);

// HANYA SUPERADMIN yang boleh menghapus kelas
router.delete('/:id', authMiddleware, requireSuperadmin, courseController.deleteCourse);

// Rute progress user
router.post('/:id/complete', authMiddleware, courseController.completeCourse);

module.exports = router;