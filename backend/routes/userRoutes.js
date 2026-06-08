const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 
const authMiddleware = require('../middleware/authMiddleware'); // Wajib impor ini

// 1. Endpoint: GET /api/users
// Kita pasang authMiddleware agar hanya user dengan token valid yang bisa akses
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Karena sekarang pakai JWT, kita tidak butuh session.
        // authMiddleware sudah memastikan token valid.
        
        const result = await userModel.getAllUsers();
        res.json(result); 

    } catch (error) {
        console.error("Database Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal mengambil data dari database." });
    }
});

// 2. Endpoint: PUT /api/users/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // authMiddleware sudah memverifikasi user, 
        // Anda bisa cek role di sini jika perlu (opsional)
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan Admin." });
        }

        const userId = req.params.id;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Nama, Email, dan Role wajib diisi." });
        }

        const updatedUser = await userModel.updateUser(userId, name, email, role);

        if (!updatedUser) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({ message: "Data pengguna berhasil diperbarui", user: updatedUser });

    } catch (error) {
        console.error("Update Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal memperbarui data pengguna." });
    }
});

// 3. Endpoint: DELETE /api/users/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Proteksi Role
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan Admin." });
        }

        const userId = req.params.id;
        const deletedUser = await userModel.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({ message: "Pengguna berhasil dihapus." });

    } catch (error) {
        console.error("Delete Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal menghapus pengguna." });
    }
});

module.exports = router;