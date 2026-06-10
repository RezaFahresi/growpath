// backend/routes/talentMappingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTalentMappings, updateTalent, deleteTalent } = require('../controllers/talentMappingController');

router.get('/', authMiddleware, getTalentMappings);
//TAMBAHAN: Rute untuk Edit dan Hapus
router.put('/:id', authMiddleware, updateTalent);
router.delete('/:id', authMiddleware, deleteTalent);

module.exports = router;