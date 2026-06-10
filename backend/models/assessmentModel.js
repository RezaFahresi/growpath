const db = require('../config/db');

exports.getAllAssessments = async () => {
  const result = await db.query(`SELECT * FROM assessments ORDER BY id ASC`);
  return result.rows;
};

// 🔥 TAMBAHAN BARU: Mengambil detail 1 paket ujian beserta lembar soalnya
exports.getAssessmentById = async (id) => {
  // 1. Ambil data informasi utama kuis
  const assessmentResult = await db.query(`SELECT * FROM assessments WHERE id = $1`, [id]);
  if (assessmentResult.rows.length === 0) return null;

  const assessment = assessmentResult.rows[0];

  // 2. Ambil seluruh lembar soal yang terikat dengan kuis ini
  const questionsResult = await db.query(
    `SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer 
     FROM questions 
     WHERE assessment_id = $1 
     ORDER BY id ASC`,
    [id]
  );

  // 3. Gabungkan lembar soal ke dalam objek kuis
  assessment.questions = questionsResult.rows;
  return assessment;
};

// 🔥 PERBAIKAN: Mendukung penyimpanan judul kuis DAN array pertanyaan sekaligus
exports.createAssessment = async (title, category, duration, description, questions = []) => {
  await db.query('BEGIN'); // Mulai Transaksi Database
  try {
    // 1. Simpan bungkus kuisnya terlebih dahulu
    const assessmentResult = await db.query(
      `INSERT INTO assessments (title, category, duration, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, category, duration, description]
    );
    const newAssessment = assessmentResult.rows[0];
    const assessmentId = newAssessment.id;

    // 2. Jika ada soal yang dikirim, simpan semuanya satu per satu secara bergantian
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await db.query(
          `INSERT INTO questions (assessment_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            assessmentId,
            q.question_text,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.correct_answer || 'A'
          ]
        );
      }
    }

    await db.query('COMMIT'); // Simpan permanen jika semua proses sukses
    newAssessment.questions = questions;
    return newAssessment;
  } catch (error) {
    await db.query('ROLLBACK'); // Batalkan semua jika ada satu saja soal yang gagal insert
    throw error;
  }
};

// 🔥 PERBAIKAN: Mendukung edit informasi kuis dan update daftar pertanyaan
exports.updateAssessment = async (id, title, category, duration, description, questions = []) => {
  await db.query('BEGIN'); // Mulai Transaksi Database
  try {
    // 1. Update informasi utama kuis
    const assessmentResult = await db.query(
      `UPDATE assessments 
       SET title = $1, category = $2, duration = $3, description = $4 
       WHERE id = $5 RETURNING *`,
      [title, category, duration, description, id]
    );

    if (assessmentResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return null;
    }

    const updatedAssessment = assessmentResult.rows[0];

    // 2. Strategi update paling aman: Hapus semua soal lama, lalu pasang soal yang baru
    await db.query(`DELETE FROM questions WHERE assessment_id = $1`, [id]);

    // 3. Masukkan kembali daftar soal hasil edit dari admin
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await db.query(
          `INSERT INTO questions (assessment_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            id,
            q.question_text,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.correct_answer || 'A'
          ]
        );
      }
    }

    await db.query('COMMIT'); // Eksekusi perubahan ke database
    updatedAssessment.questions = questions;
    return updatedAssessment;
  } catch (error) {
    await db.query('ROLLBACK'); // Batalkan jika terjadi error tengah jalan
    throw error;
  }
};

exports.deleteAssessment = async (id) => {
  // Catatan: Karena di tabel questions sudah dipasang 'ON DELETE CASCADE', 
  // Menghapus kuis di sini otomatis akan menghapus seluruh soal terkait di database Supabase Anda.
  await db.query(`DELETE FROM assessments WHERE id = $1`, [id]);
};

// --- LOGIKA SUBMIT (DENGAN TRANSAKSI) ---
exports.submitAssessmentResult = async (userId, assessmentId, score, hours, skillCategory) => {
  await db.query('BEGIN'); // Start Transaction
  try {
    const result = await db.query(
      `INSERT INTO assessment_results (user_id, assessment_id, score, created_at) 
       VALUES($1, $2, $3, NOW()) RETURNING *`,
      [userId, assessmentId, score]
    );

    await db.query(
      `INSERT INTO user_activities (user_id, activity_date, hours_spent) 
       VALUES ($1, CURRENT_DATE, $2)`,
      [userId, hours]
    );

    const checkSkill = await db.query(
      `SELECT id, proficiency FROM user_skills WHERE user_id = $1 AND skill_name = $2`,
      [userId, skillCategory]
    );

    if (checkSkill.rows.length > 0) {
      await db.query(
        `UPDATE user_skills SET proficiency = GREATEST(proficiency, $3), updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND skill_name = $2`,
        [userId, skillCategory, score]
      );
    } else {
      await db.query(
        `INSERT INTO user_skills (user_id, skill_name, proficiency) VALUES ($1, $2, $3)`,
        [userId, skillCategory, score]
      );
    }

    await db.query('COMMIT'); // Save changes
    return result.rows[0];
  } catch (error) {
    await db.query('ROLLBACK'); // Cancel if error
    throw error;
  }
};

exports.getAssessmentCategory = async (assessmentId) => {
  const info = await db.query(`SELECT category FROM assessments WHERE id = $1`, [assessmentId]);
  return info.rows.length > 0 ? info.rows[0].category : 'General';
};

exports.getUserResultsHistory = async (userId) => {
  const result = await db.query(
    `SELECT ar.id, a.title, a.category, ar.score, ar.created_at
     FROM assessment_results ar
     JOIN assessments a ON a.id = ar.assessment_id
     WHERE ar.user_id = $1 ORDER BY ar.created_at DESC`,
    [userId]
  );
  return result.rows;
};

exports.getResultDetail = async (id, userId, adminId) => {
  let query, params;
  if (adminId) {
    query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.id = $1`;
    params = [id];
  } else {
    query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.id = $1 AND ar.user_id = $2`;
    params = [id, userId];
  }
  const result = await db.query(query, params);
  return result.rows;
};

exports.deleteResult = async (id) => {
  const result = await db.query(`DELETE FROM assessment_results WHERE id = $1 RETURNING *`, [id]);
  return result.rowCount;
};