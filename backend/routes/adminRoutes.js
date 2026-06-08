const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Rute Statistik Dashboard Admin
router.get('/stats', authMiddleware, (req, res, next) => {
    // Verifikasi ekstra: Pastikan yang akses benar-benar Admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Akses ditolak: Anda bukan admin." });
    }
    next();
}, adminController.getDashboardStats);

module.exports = router;