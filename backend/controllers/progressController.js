const ProgressModel = require('../models/progressModel');

exports.getUserProgress = async (req, res) => {
  // 🔥 AMBIL USER ID LANGSUNG DARI TOKEN JWT
  // Dengan ini, aplikasi lebih aman karena user tidak bisa mengakses data orang lain
  const userId = req.user.id; 

  try {
    // 1. AMBIL SEMUA DATA SECARA PARALEL
    const [
      activitiesRows, 
      skillsRows, 
      badgesRows, 
      statsRow, 
      datesRows, 
      courseRows,
      roadmapRows 
    ] = await Promise.all([
      ProgressModel.getWeeklyActivities(userId),
      ProgressModel.getUserSkills(userId),
      ProgressModel.getUserBadges(userId),
      ProgressModel.getUserStats(userId),
      ProgressModel.getActivityDates(userId),
      ProgressModel.getUserCourseProgress(userId),
      ProgressModel.getUserRoadmapProgress(userId)
    ]);

    // 2. FORMAT AKTIVITAS MINGGUAN
    const formattedActivities = activitiesRows.map(row => ({
      name: row.name,
      hours: parseFloat(row.hours)
    }));

    // 3. STATISTIK RINGKASAN (Ditambahkan perlindungan jika statsRow null)
    const currentStats = statsRow || { total_hours: 0, completed_courses: 0 };
    const totalHours = parseFloat(currentStats.total_hours) || 0;
    const completedCourses = parseInt(currentStats.completed_courses, 10) || 0;
    
    let userBadges = badgesRows ? [...badgesRows] : []; 

    // 4. LOGIKA CURRENT STREAK
    const activityDates = datesRows ? datesRows.map(row => {
      const d = new Date(row.act_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }) : [];

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateToCheck = null;
    if (activityDates.includes(today.getTime())) {
      dateToCheck = today;
    } else if (activityDates.includes(yesterday.getTime())) {
      dateToCheck = yesterday;
    }

    if (dateToCheck) {
      while (activityDates.includes(dateToCheck.getTime())) {
        currentStreak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
      }
    }

    // 5. LOGIKA BADGE DINAMIS
    if (currentStreak >= 7) userBadges.push({ title: '7-Day Streak', icon_name: 'Zap' });
    if (totalHours >= 50) userBadges.push({ title: 'Dedicated Coder', icon_name: 'Star' });
    if (completedCourses >= 5) userBadges.push({ title: 'Web Dev Master', icon_name: 'Award' });
    if (skillsRows && skillsRows.some(s => parseFloat(s.A) >= 90)) {
      userBadges.push({ title: 'High Proficiency', icon_name: 'Target' });
    }

    // 6. FORMAT DATA KURSUS
    const activeCourses = courseRows ? courseRows.map(row => ({
      courseId: row.course_id,
      percentage: row.progress_percentage,
      isCompleted: row.is_completed
    })) : [];

    // 7. FORMAT DATA ROADMAP CHECKLIST
    const roadmapChecklist = {};
    if (roadmapRows && roadmapRows.length > 0) {
      roadmapRows.forEach(row => {
        if (!roadmapChecklist[row.phase_id]) {
          roadmapChecklist[row.phase_id] = [];
        }
        roadmapChecklist[row.phase_id].push(row.task_id);
      });
    }

    // 8. KIRIM RESPONSE
    res.json({
      stats: {
        totalHours: totalHours,
        streak: currentStreak,
        completed: completedCourses,
        achievements: userBadges.length
      },
      activityData: formattedActivities,
      skillData: skillsRows ? skillsRows.map(s => ({ ...s, A: parseFloat(s.A), fullMark: 100 })) : [],
      badges: userBadges,
      activeCourses: activeCourses,
      roadmapChecklist: roadmapChecklist
    });

  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data progress." });
  }
};