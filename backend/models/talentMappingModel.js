const db = require('../config/db');

exports.getAllTalentMappings = async () => {
  // Sesuaikan dengan nama tabel di Supabase Anda
  const result = await db.query(`SELECT * FROM talent_mappings`);
  return result.rows;
};