const db = require('../config/db');

exports.getAllTalentMappings = async () => {
  const result = await db.query(`
    SELECT *
    FROM talent_mappings
    ORDER BY id DESC
  `);

  return result.rows;
};

exports.getTalentMappingByEmail = async (email) => {
  const result = await db.query(
    `
    SELECT *
    FROM talent_mappings
    WHERE email = $1
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0];
};

exports.updateTalentMapping = async (id, data) => {
  const { name, role, department, performance, potential } = data;

  const result = await db.query(
    `
    UPDATE talent_mappings
    SET name = $1,
        role = $2,
        department = $3,
        performance = $4,
        potential = $5
    WHERE id = $6
    RETURNING *
    `,
    [name, role, department, performance, potential, id]
  );

  return result.rows[0];
};

exports.deleteTalentMapping = async (id) => {
  const result = await db.query(
    `
    DELETE FROM talent_mappings
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

// Menambahkan fungsi ini di bagian bawah file talentMappingModel.js
exports.createTalentMapping = async (data) => {
  // Berikan nilai default (kosong/0) untuk user baru
  const { 
    name, 
    email, 
    role = 'User Baru', 
    department = 'Belum Ditentukan', 
    performance = 0, 
    potential = 0 
  } = data;

  const result = await db.query(
    `
    INSERT INTO talent_mappings (name, email, role, department, performance, potential)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [name, email, role, department, performance, potential]
  );

  return result.rows[0];
};