const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// IMPORT MIDDLEWARE SUPERADMIN
const { requireSuperadmin } = require('../middleware/roleMiddleware');

const {
  getAssessments,
  getAssessmentById, 
  createAssessment,
  deleteAssessment,
  submitAssessment,
  getUserResults,
  getResultDetail,
  updateAssessment,
  deleteResult,
  checkHistory
} = require('../controllers/assessmentController');

router.get('/history/:id', authMiddleware, checkHistory); 

router.get('/', authMiddleware, getAssessments);
router.get('/:id', authMiddleware, getAssessmentById); 

// Admin biasa boleh membuat dan mengedit soal
router.post('/', authMiddleware, createAssessment);
router.put('/:id', authMiddleware, updateAssessment);

// HANYA SUPERADMIN yang boleh menghapus Soal Assessment
router.delete('/:id', authMiddleware, requireSuperadmin, deleteAssessment);

router.post('/submit', authMiddleware, submitAssessment);
router.get('/results', authMiddleware, getUserResults);
router.get('/results/:id', authMiddleware, getResultDetail);

// HANYA SUPERADMIN yang boleh menghapus Hasil (History) Assessment
router.delete('/results/:id', authMiddleware, requireSuperadmin, deleteResult);

module.exports = router;