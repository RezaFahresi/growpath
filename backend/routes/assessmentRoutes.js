const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Wajib Import

const {
  getAssessments,
  createAssessment,
  deleteAssessment,
  submitAssessment,
  getUserResults,
  getResultDetail,
  updateAssessment,
  deleteResult
} = require('../controllers/assessmentController');

// 🌟 PERBAIKAN: Semua rute disisipkan authMiddleware

router.get('/', authMiddleware, getAssessments);
router.post('/', authMiddleware, createAssessment);
router.put('/:id', authMiddleware, updateAssessment);
router.delete('/:id', authMiddleware, deleteAssessment);

router.post('/submit', authMiddleware, submitAssessment);
router.get('/results', authMiddleware, getUserResults);
router.get('/results/:id', authMiddleware, getResultDetail);
router.delete('/results/:id', authMiddleware, deleteResult);

module.exports = router;