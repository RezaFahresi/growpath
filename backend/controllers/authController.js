const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const axios = require('axios');
const jwt = require('jsonwebtoken'); 
const db = require('../config/db');

// 1. REGISTER USER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }

    const finalRole = role || 'user';

    const userExists = await UserModel.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.createUser(name, email, hashedPassword, finalRole);

    if (finalRole === 'user') {
      try {
        await db.query(
          `INSERT INTO talent_mappings (name, email, role, department, performance, potential, image) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [name, email, 'user', 'General', 'Medium', 'Medium', null]
        );
      } catch (mappingErr) {
        console.error("Warning: Gagal menambahkan ke talent_mappings", mappingErr);
      }
    }

    return res.status(201).json({ 
      message: 'Registrasi berhasil', 
      user: newUser 
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. LOGIN USER BIASA 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmailAndRoleCondition(email, false);

    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan.' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, role: user.role, adminId: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
      );

      return res.json({ 
        message: 'Login Berhasil', 
        token: token, 
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

// 3. GOOGLE AUTH 
exports.googleLogin = async (req, res) => {
  const { access_token } = req.body;

  try {
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const { email, name } = googleResponse.data;

    let user = await UserModel.findUserByEmail(email);

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      user = await UserModel.createUser(name, email, randomPassword);

      try {
        await db.query(
          `INSERT INTO talent_mappings (name, email, role, department, performance, potential, image) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [name, email, 'user', 'General', 'Medium', 'Medium', null]
        );
      } catch (mappingErr) {
        console.error("Warning: Gagal menambahkan Google User ke talent_mappings", mappingErr);
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, adminId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`[GOOGLE AUTH SUKSES] Email: ${user.email}`);
    return res.json({
      message: 'Login Google berhasil',
      token: token, 
      user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
};

// 4. LOGIN ADMIN 
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await UserModel.findUserByEmail(email); 

    if (!admin) {
      return res.status(404).json({ message: 'Akun tidak ditemukan.' });
    }

    const userRole = (admin.role || '').toLowerCase().trim();

    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Akses ditolak. Akun ini bukan Admin.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: admin.id, role: userRole, adminId: admin.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ 
        message: 'Login Admin Berhasil', 
        token: token, 
        user: { id: admin.id, name: admin.name, role: userRole } 
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Admin Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 5. CHECK AUTH 
exports.checkAuth = async (req, res) => {
  if (req.user) {
    return res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(401).json({ isAuthenticated: false, message: 'Tidak terautentikasi' });
  }
};

// 6. LOGOUT 
exports.logout = (req, res) => {
  return res.json({ message: 'Logout berhasil. Silakan hapus token di Frontend.' });
};