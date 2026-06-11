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
  const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

exports.createUser = async (name, email, password, role = 'user') => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, password, role]
  );

  return result.rows[0];
};

exports.getAllUsers = async () => {
  const result = await db.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
  return result.rows;
};

// ==========================================
// KODE BARU: Fungsi untuk UPDATE dan DELETE
// ==========================================

exports.updateUser = async (id, name, email, role) => {
  const result = await db.query(
    "UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role",
    [name, email, role, id]
  );
  return result.rows[0]; // Mengembalikan data user yang baru di-update
};

exports.deleteUser = async (id) => {
  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0]; // Jika undefined, berarti user tidak ditemukan
};