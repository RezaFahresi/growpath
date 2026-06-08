const CourseModel = require('../models/courseModel');

// Helper untuk validasi admin
const isAdmin = (user) => user && (user.role === 'admin' || user.role === 'superadmin');

exports.getCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error getCourses:", error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    // Gunakan req.user dari authMiddleware
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak. Hanya Admin.' });
    
    const { title, description, image, category, duration, lessons } = req.body;
    if (!title) return res.status(400).json({ message: 'Course Title wajib diisi.' });

    const newCourse = await CourseModel.createCourse(title, description, image, category, duration, lessons);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error createCourse:", error);
    res.status(500).json({ message: 'Gagal membuat course baru.' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak.' });
    
    const id = parseInt(req.params.id, 10);
    const { title, description, image, category, duration, lessons } = req.body;

    const rows = await CourseModel.updateCourse(id, title, description, image, category, duration, lessons);
    if (rows.length === 0) return res.status(404).json({ message: 'Course tidak ditemukan.' });
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updateCourse:", error);
    res.status(500).json({ message: 'Gagal merubah data course.' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'Akses ditolak.' });
    
    const id = parseInt(req.params.id, 10);
    const rowCount = await CourseModel.deleteCourse(id);
    
    if (rowCount === 0) return res.status(404).json({ message: 'Course tidak ditemukan.' });
    res.json({ message: 'Course berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteCourse:", error);
    res.status(500).json({ message: 'Gagal menghapus data course.' });
  }
};

exports.completeCourse = async (req, res) => {
  try {
    // Pastikan user sudah login lewat token
    if (!req.user) return res.status(401).json({ message: 'Silakan login.' });
    
    const userId = parseInt(req.user.id, 10);
    const courseId = parseInt(req.params.id, 10);

    const exists = await CourseModel.checkProgressExists(userId, courseId);
    if (exists) {
      await CourseModel.updateProgressCompleted(userId, courseId);
    } else {
      await CourseModel.insertProgressCompleted(userId, courseId);
    }

    await CourseModel.addActivityHours(userId, 2.0);
    res.json({ message: 'Selamat! Kursus berhasil diselesaikan.' });
  } catch (error) {
    console.error("Error completeCourse:", error);
    res.status(500).json({ message: 'Gagal menyelesaikan kursus.' });
  }
};