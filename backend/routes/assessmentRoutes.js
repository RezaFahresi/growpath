const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

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
  checkHistory // FUNGSI BARU DI-IMPORT
} = require('../controllers/assessmentController');

//PENTING: Rute history harus DI ATAS /:id agar parameter :id tidak membajak kata "history"
router.get('/history/:id', authMiddleware, checkHistory); 

router.get('/', authMiddleware, getAssessments);
router.get('/:id', authMiddleware, getAssessmentById); 
router.post('/', authMiddleware, createAssessment);
router.put('/:id', authMiddleware, updateAssessment);
router.delete('/:id', authMiddleware, deleteAssessment);

router.post('/submit', authMiddleware, submitAssessment);
router.get('/results', authMiddleware, getUserResults);
router.get('/results/:id', authMiddleware, getResultDetail);
router.delete('/results/:id', authMiddleware, deleteResult);

module.exports = router;