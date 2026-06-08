const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("--- Pengecekan JWT Token ---");
  
  // 1. Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  // 2. Pastikan header ada dan formatnya benar ("Bearer <token>")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ Akses Ditolak: Token tidak ditemukan atau format salah.");
    return res.status(401).json({ 
      message: 'Akses Ditolak: Sesi Anda telah berakhir atau Anda belum login.' 
    });
  }

  // 3. Pisahkan kata "Bearer" untuk mendapatkan token murni
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verifikasi token menggunakan JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ Token Valid! Data Identitas:", decoded);

    // 5. Simpan data hasil decode ke req.user
    // Jika di controller sebelumnya Anda memanggil req.session.adminId, 
    // sekarang Anda harus memanggil req.user.id atau req.user.adminId (tergantung isi token saat dicetak)
    req.user = decoded; 
    
    // Lanjut ke proses (controller) berikutnya
    next();
    
  } catch (error) {
    console.error("🚨 Error Verifikasi Token:", error.message);
    
    // Memberikan pesan spesifik jika token sudah lewat masa berlakunya
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Akses Ditolak: Sesi Anda telah berakhir. Silakan login ulang.' });
    }
    
    // Jika token palsu/rusak
    return res.status(401).json({ message: 'Akses Ditolak: Token tidak valid.' });
  }
};