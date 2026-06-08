const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const axios = require('axios');
const jwt = require('jsonwebtoken'); // <-- TAMBAHAN WAJIB

// 1. REGISTER USER (Tetap sama)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Semua kolom wajib diisi.' });

    const userExists = await UserModel.findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'Email sudah terdaftar.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.createUser(name, email, hashedPassword);

    return res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. LOGIN USER BIASA (Diubah ke JWT)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmailAndRoleCondition(email, false);

    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan.' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // BIKIN TOKEN JWT
      const token = jwt.sign(
        { id: user.id, role: user.role, adminId: user.id }, // Sesuaikan payload dengan middleware Anda
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token hangus dalam 24 jam
      );

      return res.json({ 
        message: 'Login Berhasil', 
        token: token, // <--- Kirim token ke Frontend
        user: { id: user.id, name: user.name, role: user.role } 
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ==========================================
// FUNGSI BARU: GOOGLE AUTH (Diubah ke JWT)
// ==========================================
exports.googleLogin = async (req, res) => {
  const { access_token } = req.body;

  try {
    // 1. Verifikasi token ke Google
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const { email, name } = googleResponse.data;

    // 2. Cek apakah user sudah terdaftar
    let user = await UserModel.findUserByEmail(email);

    // 3. Jika belum terdaftar, buat akun baru
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      user = await UserModel.createUser(name, email, randomPassword);
    }

    // 4. BIKIN TOKEN JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, adminId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`🌍 [GOOGLE AUTH SUKSES] Email: ${user.email}`);
    return res.json({
      message: 'Login Google berhasil',
      token: token, // <--- Kirim token ke Frontend
      user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
};

// 3. LOGIN ADMIN (Diubah ke JWT)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await UserModel.findUserByEmailAndRoleCondition(email, true); // Asumsi true = role admin

    if (!admin) return res.status(404).json({ message: 'Akun admin tidak ditemukan.' });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      // BIKIN TOKEN JWT KHUSUS ADMIN
      const token = jwt.sign(
        { id: admin.id, role: admin.role, adminId: admin.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ 
        message: 'Login Admin Berhasil', 
        token: token, 
        admin: { id: admin.id, name: admin.name, role: admin.role } 
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Admin Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 4. CHECK AUTH (Disesuaikan untuk JWT)
exports.checkAuth = async (req, res) => {
  // Karena sekarang pakai JWT, Frontend akan mengirim token di Header Authorization.
  // Pastikan rute '/api/auth/check-auth' di file routes Anda SUDAH dipasangkan dengan authMiddleware!
  // Jika authMiddleware lolos, req.user akan berisi data user dari token.
  
  if (req.user) {
    return res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(401).json({ isAuthenticated: false, message: 'Tidak terautentikasi' });
  }
};

// 5. LOGOUT (Diubah ke JWT)
exports.logout = (req, res) => {
  // Karena JWT tersimpan di browser Frontend (LocalStorage), 
  // Backend tidak perlu menghapus sesi atau cookie apa pun.
  // Frontend yang bertugas melakukan: localStorage.removeItem('token')
  return res.json({ message: 'Logout berhasil. Silakan hapus token di Frontend.' });
};