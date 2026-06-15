const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');
// IMPORT MIDDLEWARE BARU
const { requireSuperadmin } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roadmapController.getRoadmaps);

router.post('/progress', authMiddleware, roadmapController.toggleProgress);
router.post('/toggle-progress', authMiddleware, roadmapController.toggleProgress);

// ROUTE KHUSUS ADMIN (Create & Update boleh untuk Admin biasa)
router.post('/', authMiddleware, roadmapController.createRoadmap);
router.post('/:roadmapId/modules', authMiddleware, roadmapController.addModule);
router.put('/modules/:moduleId', authMiddleware, roadmapController.updateModule);

//  ROUTE HAPUS (Wajib Superadmin)
router.delete('/:id', authMiddleware, requireSuperadmin, roadmapController.deleteRoadmap);
router.delete('/modules/:moduleId', authMiddleware, requireSuperadmin, roadmapController.deleteModule);

module.exports = router;