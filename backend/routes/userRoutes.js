const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 
const authMiddleware = require('../middleware/authMiddleware');
//IMPORT CONTROLLER & MULTER UNTUK UPLOAD FOTO
const userController = require('../controllers/userController');
const multer = require('multer');

// Konfigurasi multer menggunakan memori sementara (Aman untuk Vercel)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // Batas ukuran 2MB
});

// UTE BARU KHUSUS UPLOAD FOTO
router.post('/upload-photo', authMiddleware, upload.single('profile_image'), userController.uploadPhoto);


router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await userModel.getAllUsers();
        res.json(result); 
    } catch (error) {
        console.error("Database Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal mengambil data dari database." });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan Admin." });
        }
        const userId = req.params.id;
        const { name, email, role } = req.body;

        if (!name || !email || !role) return res.status(400).json({ message: "Nama, Email, dan Role wajib diisi." });

        const updatedUser = await userModel.updateUser(userId, name, email, role);
        if (!updatedUser) return res.status(404).json({ message: "Pengguna tidak ditemukan." });

        res.status(200).json({ message: "Data pengguna berhasil diperbarui", user: updatedUser });
    } catch (error) {
        console.error("Update Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal memperbarui data pengguna." });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan Admin." });
        }
        const userId = req.params.id;
        const deletedUser = await userModel.deleteUser(userId);

        if (!deletedUser) return res.status(404).json({ message: "Pengguna tidak ditemukan." });

        res.status(200).json({ message: "Pengguna berhasil dihapus." });
    } catch (error) {
        console.error("Delete Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal menghapus pengguna." });
    }
});

module.exports = router;