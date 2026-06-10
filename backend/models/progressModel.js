const db = require('../config/db');

exports.getWeeklyActivities = async (userId) => {
  const activitiesQuery = `
    WITH dates AS (
      SELECT generate_series(CURRENT_DATE - 6, CURRENT_DATE, '1 day'::interval)::date AS d
    )
    SELECT TO_CHAR(dates.d, 'Dy') as name, COALESCE(SUM(ua.hours_spent), 0) as hours 
    FROM dates
    LEFT JOIN user_activities ua ON dates.d = ua.activity_date AND ua.user_id = $1
    GROUP BY dates.d
    ORDER BY dates.d ASC;
  `;
  const result = await db.query(activitiesQuery, [userId]);
  return result.rows;
};

exports.getUserSkills = async (userId) => {
  const skillsQuery = `SELECT skill_name as subject, proficiency as A FROM user_skills WHERE user_id = $1;`;
  const result = await db.query(skillsQuery, [userId]);
  return result.rows;
};

exports.getUserBadges = async (userId) => {
  const badgesQuery = `SELECT badge_title as title, icon_name FROM user_achievements WHERE user_id = $1;`;
  const result = await db.query(badgesQuery, [userId]);
  return result.rows;
};

exports.getUserStats = async (userId) => {
  const statsQuery = `
    SELECT 
      (SELECT COALESCE(SUM(hours_spent), 0) FROM user_activities WHERE user_id = $1) as total_hours,
      (SELECT COUNT(*) FROM user_course_progress WHERE user_id = $1 AND is_completed = TRUE) as completed_courses;
  `;
  const result = await db.query(statsQuery, [userId]);
  return result.rows[0];
};

exports.getActivityDates = async (userId) => {
  const datesQuery = `SELECT DISTINCT activity_date::DATE as act_date FROM user_activities WHERE user_id = $1 AND hours_spent > 0 ORDER BY act_date DESC;`;
  const result = await db.query(datesQuery, [userId]);
  return result.rows;
};

exports.getUserCourseProgress = async (userId) => {
  const query = `
    SELECT course_id, progress_percentage, is_completed 
    FROM user_course_progress 
    WHERE user_id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

exports.getUserRoadmapProgress = async (userId) => {
  const query = `
    SELECT phase_id, task_id 
    FROM user_roadmap_progress 
    WHERE user_id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

// TAMBAHAN: Mengecek apakah user sudah pernah menyelesaikan course
exports.checkCourseProgress = async (userId, courseId) => {
  const result = await db.query(
    'SELECT id FROM user_course_progress WHERE user_id = $1 AND course_id = $2 LIMIT 1',
    [userId, courseId]
  );
  return result.rows[0];
};

// TAMBAHAN: Menyimpan data bahwa user telah menyelesaikan course
exports.markCourseCompleted = async (userId, courseId) => {
  const check = await this.checkCourseProgress(userId, courseId);
  if (check) return check;

  const result = await db.query(
    'INSERT INTO user_course_progress (user_id, course_id, is_completed, progress_percentage) VALUES ($1, $2, TRUE, 100) RETURNING *',
    [userId, courseId]
  );
  return result.rows[0];
};