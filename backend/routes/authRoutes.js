const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
const db = require('../config/db'); 

// IMPORT BARU UNTUK GOOGLE ONE TAP
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Import authMiddleware (Pastikan path folder ini sesuai dengan proyek Anda)
const authMiddleware = require('../middleware/authMiddleware');

// 1. ENDPOINT REGISTRASI (/register)
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

// 2. ENDPOINT KHUSUS USER BIASA (/login-user)
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

    const token = jwt.sign(
      { id: user.id, role: safeRole, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`\n👨‍🎓 [USER LOGIN SUKSES] Email: ${user.email}`);

    res.json({ 
      message: 'Login berhasil', 
      token: token, 
      user: { id: user.id, name: user.name, email: user.email, role: safeRole, image: user.image }
    });

  } catch (error) {
    console.error("Login User Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// ==========================================
// 3. ENDPOINT BARU: GOOGLE AUTH (/google) - MENGGUNAKAN ONE TAP
// ==========================================
router.post('/google', async (req, res) => {
  const { access_token } = req.body; // Ini sekarang adalah ID Token JWT dari frontend

  try {
    //Verifikasi token langsung ke Google menggunakan Google Auth Library
    const ticket = await googleClient.verifyIdToken({
      idToken: access_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // Mengekstrak payload dari token yang sudah diverifikasi
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);
      
      const insertResult = await db.query(
        "INSERT INTO users (name, email, password, role, image, created_at) VALUES ($1, $2, $3, 'user', $4, NOW()) RETURNING *",
        [name, email, randomPassword, picture || null]
      );
      user = insertResult.rows[0];
    } else if (picture && !user.image) {
      // Update foto profil jika user login dengan Google dan belum punya foto
      await db.query('UPDATE users SET image = $1 WHERE email = $2', [picture, email]);
      user.image = picture;
    }

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    const token = jwt.sign(
      { id: user.id, role: safeRole, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`\n🌍 [GOOGLE AUTH SUKSES] Email: ${user.email}`);

    res.json({ 
      message: 'Login Google berhasil', 
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: safeRole, image: user.image }
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
});

// 4. ENDPOINT KHUSUS ADMIN (/login-admin)
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

    const token = jwt.sign(
      { id: user.id, role: safeRole, adminId: user.id, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`\n🛡️ [ADMIN LOGIN SUKSES] Admin: ${user.email}`);

    res.json({ 
      message: 'Login Admin berhasil', 
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: safeRole, image: user.image }
    });

  } catch (error) {
    console.error("Login Admin Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// 5. ENDPOINT LOGOUT
router.post('/logout', (req, res) => {
  console.log(`\n🚪 [LOGOUT BERHASIL] Frontend akan menghapus token.`);
  res.json({ message: 'Logout berhasil, silakan hapus token di Frontend' });
});

// 6. ENDPOINT CEK STATUS AUTH
router.get('/check-auth', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, name, email, role, image FROM users WHERE id = $1', 
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
// 7. ENDPOINT FORGOT PASSWORD (Kirim Email)
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
// 8. ENDPOINT RESET PASSWORD (Simpan Sandi)
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