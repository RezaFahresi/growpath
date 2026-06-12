const db = require('../config/db');

exports.findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

exports.findUserByEmailAndRoleCondition = async (email, isForAdmin = false) => {
  const query = isForAdmin 
    ? "SELECT * FROM users WHERE email = $1 AND LOWER(role) IN ('admin', 'superadmin')"
    : "SELECT * FROM users WHERE email = $1 AND role = 'user'";
  
  const result = await db.query(query, [email]);
  return result.rows[0];
};

exports.findUserById = async (id) => {
  // UPDATE: Tambahkan kolom image
  const result = await db.query("SELECT id, name, email, role, image FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

exports.createUser = async (name, email, password, role = 'user') => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, image`,
    [name, email, password, role]
  );

  return result.rows[0];
};

exports.getAllUsers = async () => {
  //UPDATE: Tambahkan kolom image
  const result = await db.query("SELECT id, name, email, role, image FROM users ORDER BY id ASC");
  return result.rows;
};

// ==========================================
// KODE BARU: Fungsi untuk UPDATE dan DELETE
// ==========================================

exports.updateUser = async (id, name, email, role) => {
  const result = await db.query(
    "UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, image",
    [name, email, role, id]
  );
  return result.rows[0]; 
};

exports.deleteUser = async (id) => {
  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0]; 
};

// FUNGSI BARU KHUSUS UNTUK MENYIMPAN URL FOTO PROFIL
exports.updateUserImage = async (id, imageUrl) => {
  const result = await db.query(
    "UPDATE users SET image = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, image",
    [imageUrl, id]
  );
  return result.rows[0];
};