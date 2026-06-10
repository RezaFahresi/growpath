const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTalentMappings } = require('../controllers/talentMappingController');

router.get('/', authMiddleware, getTalentMappings);

module.exports = router;