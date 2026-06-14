const db = require('../config/db');

exports.getAllRoadmaps = async () => {
  // Ambil roadmaps utama
  const roadmaps = await db.query('SELECT * FROM roadmaps ORDER BY id ASC');
  // Ambil daftar modul di dalamnya
  const modules = await db.query('SELECT * FROM roadmap_modules ORDER BY step_order ASC');

  // Gabungkan roadmap dengan modulnya masing-masing
  return roadmaps.rows.map(roadmap => {
    return {
      ...roadmap,
      items: modules.rows.filter(m => m.roadmap_id === roadmap.id)
    };
  });
};

// FUNGSI BARU UNTUK ADMIN
exports.createRoadmap = async (data) => {
  const { title, category, description, est_time, icon_name, theme, border_color, level } = data;
  const result = await db.query(
    `INSERT INTO roadmaps (title, category, description, est_time, icon_name, theme, border_color, level) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [title, category, description, est_time, icon_name, theme, border_color, level]
  );
  return result.rows[0];
};

exports.addModule = async (roadmapId, data) => {
  const { title, subtitle, video_link, step_order } = data;
  const result = await db.query(
    `INSERT INTO roadmap_modules (roadmap_id, title, subtitle, video_link, step_order) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [roadmapId, title, subtitle, video_link, step_order]
  );
  return result.rows[0];
};

exports.deleteRoadmap = async (id) => {
  await db.query('DELETE FROM roadmaps WHERE id = $1', [id]);
};

// FUNGSI BAWAAN USER PROGRESS (TIDAK DIUBAH)
exports.toggleRoadmapProgress = async (userId, phaseId, taskId) => {
  await db.query('BEGIN');
  try {
    const checkExist = await db.query(
      `SELECT id FROM user_roadmap_progress WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
      [userId, phaseId, taskId]
    );

    if (checkExist.rows.length > 0) {
      await db.query(
        `DELETE FROM user_roadmap_progress WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
        [userId, phaseId, taskId]
      );
      await db.query(
        `DELETE FROM user_activities WHERE id IN (SELECT id FROM user_activities WHERE user_id = $1 AND activity_date = CURRENT_DATE AND hours_spent = 0.17 LIMIT 1)`,
        [userId]
      );
      await db.query('COMMIT');
      return { status: 'removed' };
    } else {
      await db.query(
        `INSERT INTO user_roadmap_progress (user_id, phase_id, task_id, created_at) VALUES ($1, $2, $3, NOW())`,
        [userId, phaseId, taskId]
      );
      await db.query(
        `INSERT INTO user_activities (user_id, activity_date, hours_spent) VALUES ($1, CURRENT_DATE, 0.17)`,
        [userId]
      );
      await db.query('COMMIT');
      return { status: 'added' };
    }
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};