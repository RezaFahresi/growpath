// backend/models/talentMappingModel.js
const db = require('../config/db');

exports.getAllTalentMappings = async () => {
  const result = await db.query(`SELECT * FROM talent_mappings ORDER BY id DESC`);
  return result.rows;
};

// 🔥 TAMBAHAN: Fungsi Update
exports.updateTalentMapping = async (id, data) => {
  const { name, role, department, performance, potential } = data;
  const result = await db.query(
    `UPDATE talent_mappings 
     SET name = $1, role = $2, department = $3, performance = $4, potential = $5
     WHERE id = $6 RETURNING *`,
    [name, role, department, performance, potential, id]
  );
  return result.rows[0];
};

// 🔥 TAMBAHAN: Fungsi Hapus
exports.deleteTalentMapping = async (id) => {
  const result = await db.query(`DELETE FROM talent_mappings WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
};