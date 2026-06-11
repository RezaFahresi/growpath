const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  getTalentMappings,
  getMyTalentMapping,
  updateTalent,
  deleteTalent
} = require('../controllers/talentMappingController');

router.get('/me', authMiddleware, getMyTalentMapping);
router.get('/', authMiddleware, getTalentMappings);
router.put('/:id', authMiddleware, updateTalent);
router.delete('/:id', authMiddleware, deleteTalent);

module.exports = router;