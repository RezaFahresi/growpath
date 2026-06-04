const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const userModel = require('../models/userModel'); // Pastikan path file model ini benar

// Endpoint: GET /api/users
router.get('/', async (req, res) => {
    try {
        console.log(`\n📡 [REQUEST MASUK] Session ID: ${req.sessionID}`);
        console.log(`📦 Isi req.session.adminId:`, req.session.adminId);

        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ message: "Akses ditolak. Silakan login." });
        }

        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
        );

        res.json(result.rows); 

    } catch (error) {
        console.error("Database Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal mengambil data dari database." });
    }
});

// ==========================================
// KODE BARU: Endpoint EDIT (PUT) User
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        // Proteksi Session: Hanya Admin yang bisa edit
        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ message: "Akses ditolak. Sesi Anda telah berakhir." });
        }

        const userId = req.params.id;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Nama, Email, dan Role wajib diisi." });
        }

        // Panggil fungsi updateUser dari model
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

// ==========================================
// KODE BARU: Endpoint HAPUS (DELETE) User
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        // Proteksi Session: Hanya Admin yang bisa hapus
        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ message: "Akses ditolak. Sesi Anda telah berakhir." });
        }

        const userId = req.params.id;

        // Panggil fungsi deleteUser dari model
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