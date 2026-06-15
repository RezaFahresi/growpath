const requireSuperadmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Akses ditolak.' });
  }

  // Asumsi role disimpan di req.user.role (dari token JWT)
  const userRole = req.user.role ? req.user.role.toLowerCase() : '';

  if (userRole === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses dibatasi. Hanya Superadmin yang diizinkan untuk menghapus data.' });
  }
};

module.exports = { requireSuperadmin };