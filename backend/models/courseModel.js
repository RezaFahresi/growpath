const db = require('../config/db');

exports.getAllCourses = async () => {
  const result = await db.query('SELECT * FROM courses ORDER BY id ASC');
  return result.rows;
};

// TAMBAHAN: Fungsi untuk mengambil 1 kelas spesifik
exports.getCourseById = async (id) => {
  const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0];
};

//PERBAIKAN: Menambahkan parameter video_id
exports.createCourse = async (title, description, image, category, duration, lessons, video_id) => {
  const result = await db.query(
    `INSERT INTO courses (title, description, image, category, duration, lessons, video_id, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
    [title, description, image, category || 'General', duration || 'Self-paced', lessons || 0, video_id || null]
  );
  return result.rows[0];
};

//PERBAIKAN: Menambahkan parameter video_id
exports.updateCourse = async (id, title, description, image, category, duration, lessons, video_id) => {
  const result = await db.query(
    `UPDATE courses 
     SET title = $1, description = $2, image = $3, category = $4, duration = $5, lessons = $6, video_id = $7 
     WHERE id = $8 RETURNING *`,
    [title, description, image, category, duration, lessons, video_id, id]
  );
  return result.rows;
};

exports.deleteCourse = async (id) => {
  const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
  return result.rowCount;
};

// --- LOGIKA PROGRESS ---
exports.checkProgressExists = async (userId, courseId) => {
  const checkProgress = await db.query(
    `SELECT id FROM user_course_progress WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  return checkProgress.rows.length > 0;
};

exports.updateProgressCompleted = async (userId, courseId) => {
  await db.query(
    `UPDATE user_course_progress 
     SET is_completed = TRUE, progress_percentage = 100, last_accessed = CURRENT_TIMESTAMP 
     WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
};

exports.insertProgressCompleted = async (userId, courseId) => {
  await db.query(
    `INSERT INTO user_course_progress (user_id, course_id, is_completed, progress_percentage) 
     VALUES ($1, $2, TRUE, 100)`,
    [userId, courseId]
  );
};

exports.addActivityHours = async (userId, hours) => {
  await db.query(
    `INSERT INTO user_activities (user_id, activity_date, hours_spent) 
     VALUES ($1, CURRENT_DATE, $2)`,
    [userId, hours]
  );
};