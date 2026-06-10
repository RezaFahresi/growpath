const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  getAssessments,
  getAssessmentById, // 🔥 TAMBAHAN: Untuk mengambil detail 1 ujian + soalnya
  createAssessment,
  deleteAssessment,
  submitAssessment,
  getUserResults,
  getResultDetail,
  updateAssessment,
  deleteResult
} = require('../controllers/assessmentController');

router.get('/', authMiddleware, getAssessments);
router.get('/:id', authMiddleware, getAssessmentById); // 🔥 TAMBAHAN: Rute untuk frontend TakeAssessment
router.post('/', authMiddleware, createAssessment);
router.put('/:id', authMiddleware, updateAssessment);
router.delete('/:id', authMiddleware, deleteAssessment);

router.post('/submit', authMiddleware, submitAssessment);
router.get('/results', authMiddleware, getUserResults);
router.get('/results/:id', authMiddleware, getResultDetail);
router.delete('/results/:id', authMiddleware, deleteResult);

module.exports = router;