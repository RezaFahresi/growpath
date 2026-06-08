const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const axios = require('axios'); 
const jwt = require('jsonwebtoken'); // <-- TAMBAHAN WAJIB
const db = require('../config/db'); 

// Import authMiddleware (Pastikan path folder ini sesuai dengan proyek Anda)
const authMiddleware = require('../middleware/authMiddleware');

// 1. ENDPOINT REGISTRASI (/register) - TETAP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }

    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// 2. ENDPOINT KHUSUS USER BIASA (/login-user) - DIUBAH KE JWT
router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email tidak terdaftar.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah.' });
    }

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    if (safeRole === 'admin' || safeRole === 'superadmin') {
      return res.status(403).json({ 
        message: 'Akun ini adalah akun Admin. Silakan login melalui portal Admin Panel.' 
      });
    }

    // 🔥 BUAT TOKEN JWT
    const token = jwt.sign(
      { id: user.id, role: safeRole, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Berlaku 1 Hari
    );

    console.log(`\n👨‍🎓 [USER LOGIN SUKSES] Email: ${user.email}`);

    res.json({ 
      message: 'Login berhasil', 
      token: token, // <-- Kirim token ke React
      user: { id: user.id, name: user.name, email: user.email, role: safeRole }
    });

  } catch (error) {
    console.error("Login User Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// ==========================================
// ENDPOINT BARU: GOOGLE AUTH (/google) - DIUBAH KE JWT
// ==========================================
router.post('/google', async (req, res) => {
  const { access_token } = req.body;

  try {
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const { email, name } = googleResponse.data;

    let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);
      
      const insertResult = await db.query(
        "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
        [name, email, randomPassword]
      );
      user = insertResult.rows[0];
    }

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    // 🔥 BUAT TOKEN JWT
    const token = jwt.sign(
      { id: user.id, role: safeRole, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`\n🌍 [GOOGLE AUTH SUKSES] Email: ${user.email}`);

    res.json({ 
      message: 'Login Google berhasil', 
      token: token, // <-- Kirim token ke React
      user: { id: user.id, name: user.name, email: user.email, role: safeRole }
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
});

// 3. ENDPOINT KHUSUS ADMIN (/login-admin) - DIUBAH KE JWT
router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email tidak terdaftar.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah.' });
    }

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    if (safeRole !== 'admin' && safeRole !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Akses Ditolak. Anda bukan Admin.' 
      });
    }

    // 🔥 BUAT TOKEN JWT KHUSUS ADMIN
    const token = jwt.sign(
      { id: user.id, role: safeRole, adminId: user.id, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`\n🛡️ [ADMIN LOGIN SUKSES] Admin: ${user.email}`);

    res.json({ 
      message: 'Login Admin berhasil', 
      token: token, // <-- Kirim token ke React
      user: { id: user.id, name: user.name, email: user.email, role: safeRole }
    });

  } catch (error) {
    console.error("Login Admin Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// 4. ENDPOINT LOGOUT - DIUBAH KE JWT (LEBIH SEDERHANA)
router.post('/logout', (req, res) => {
  // Dengan JWT, backend tidak perlu menghapus memori apa-apa.
  console.log(`\n🚪 [LOGOUT BERHASIL] Frontend akan menghapus token.`);
  res.json({ message: 'Logout berhasil, silakan hapus token di Frontend' });
});

// 5. ENDPOINT CEK STATUS AUTH - DIUBAH KE JWT
// 🔥 PERHATIKAN: Route ini disisipkan authMiddleware!
router.get('/check-auth', authMiddleware, async (req, res) => {
  try {
    // Jika lolos authMiddleware, artinya token valid dan datanya ada di req.user
    const userId = req.user.id;

    // Opsional: Cek ke database untuk memastikan akun belum dihapus
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', 
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        authenticated: false, 
        user: null, 
        message: 'Akun tidak ditemukan.' 
      });
    }

    res.status(200).json({ 
      authenticated: true, 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error("Check Auth Error:", error.message);
    res.status(500).json({ authenticated: false, message: 'Server error saat verifikasi sesi.' });
  }
});

// ==========================================
// 6. ENDPOINT FORGOT PASSWORD (Kirim Email)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Email tidak terdaftar di sistem kami." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 3600000; // 1 Jam

    await db.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetToken, tokenExpiry, email]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Sesuaikan link ini dengan URL Vercel Frontend Anda jika sudah di-deploy
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendURL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password Akun GrowPath',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Reset Password</h2>
          <p>Halo,</p>
          <p>Kami menerima permintaan untuk mereset password akun GrowPath Anda. Silakan klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Buat Password Baru</a>
          <p>Link ini hanya berlaku selama <strong>1 jam</strong>.</p>
          <p>Jika Anda tidak merasa meminta reset password, abaikan saja email ini. Akun Anda tetap aman.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`\n📧 [EMAIL TERKIRIM] Link reset password dikirim ke: ${email}`);
    res.status(200).json({ message: 'Email reset password telah dikirim!' });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// ==========================================
// 7. ENDPOINT RESET PASSWORD (Simpan Sandi)
// ==========================================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const userResult = await db.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, Date.now()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }

    const userEmail = userResult.rows[0].email;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2',
      [hashedPassword, userEmail]
    );

    console.log(`\n🔑 [PASSWORD DIUBAH] User ${userEmail} berhasil mereset password.`);
    res.status(200).json({ message: 'Password berhasil diperbarui!' });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;