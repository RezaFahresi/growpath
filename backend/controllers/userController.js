const UserModel = require('../models/userModel');
const axios = require('axios');
const db = require('../config/db'); 

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error saat mengambil data user' });
  }
};

// FUNGSI BARU: UPLOAD FOTO VIA IMGBB
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file gambar yang dipilih.' });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;

    // Convert buffer file dari multer menjadi base64 string
    const base64Image = req.file.buffer.toString('base64');

    // Siapkan data payload menggunakan URLSearchParams
    const params = new URLSearchParams();
    params.append('image', base64Image);

    // Kirim ke server ImgBB
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      params
    );

    // Ambil URL gambar permanen dari respon ImgBB
    const imageUrl = response.data.data.url;

    // Simpan URL gambar tersebut ke dalam database
    await UserModel.updateUserImage(userId, imageUrl);

    // Sinkronisasi dengan tabel talent_mappings jika kolom tersedia
    try {
      await db.query(
        `UPDATE talent_mappings SET image = $1 WHERE email = $2`,
        [imageUrl, userEmail]
      );
    } catch (talentErr) {
      console.log("Abaikan jika kolom image di talent_mappings tidak ada.");
    }

    res.json({ 
      message: 'Foto profil berhasil diperbarui', 
      imageUrl: imageUrl 
    });

  } catch (error) {
    console.error('ImgBB Upload Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Gagal mengunggah foto ke server pihak ketiga.' });
  }
};