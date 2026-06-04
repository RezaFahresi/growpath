import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../api/axios'; 

const AppContext = createContext();

const defaultProgress = { 
  completedCourses: [], 
  activeCourses: [], 
  roadmapChecklist: {}, 
  assessments: [] 
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('growpath_user');
    return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  
  // PERBAIKAN LOGIKA 1: Ambil state awal dari localStorage BERDASARKAN ID USER
  // Ini mencegah user baru mewarisi progress user lama dari browser yang sama
  const [progress, setProgress] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('growpath_user');
      const savedUser = savedUserStr && savedUserStr !== "null" ? JSON.parse(savedUserStr) : null;
      
      if (savedUser) {
        const userId = savedUser.id || savedUser._id;
        // Gunakan key spesifik untuk tiap user
        const saved = localStorage.getItem(`growpath_progress_${userId}`);
        return saved ? JSON.parse(saved) : defaultProgress;
      }
      return defaultProgress;
    } catch (e) {
      return defaultProgress;
    }
  });

  const [courses, setCourses] = useState([]);
  const [availableAssessments, setAvailableAssessments] = useState([]);
  const [talentMappings, setTalentMappings] = useState(() => {
    const saved = localStorage.getItem('growpath_talent_mappings');
    return saved ? JSON.parse(saved) : [];
  });

  // Saat refresh dari DB, KITA MERGE data DB dengan data Lokal
  const refreshProgress = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await API.get(`/progress/user/${userId}`);
      
      setProgress(prev => {
        // Ekstrak data completed dari DB dengan aman
        const dbCompleted = res.data.completedCourses || res.data.completed_courses || [];
        const formattedCompleted = dbCompleted.map(id => String(id));

        return {
          ...prev, // Pertahankan roadmap/data lokal milik user ini
          ...res.data, // Timpa dengan data dari database (stats, dll)
          activeCourses: res.data.activeCourses || prev.activeCourses,
          completedCourses: formattedCompleted.length > 0 ? formattedCompleted : prev.completedCourses
        };
      });
    } catch (err) {
      console.error("Gagal refresh progress dari DB:", err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/check-auth');
        if (response.data?.user) {
          const userData = response.data.user;
          const userId = userData.id || userData._id;
          
          setUser(userData);
          await refreshProgress(userId);
        } else {
          setUser(null);
          setProgress(defaultProgress); // Kosongkan progress jika tidak valid
        }
      } catch (err) {
        setUser(null);
        setProgress(defaultProgress); // Kosongkan progress jika error auth
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [refreshProgress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [assessRes, courseRes] = await Promise.all([
          API.get('/assessments'),
          API.get('/courses')
        ]);
        setAvailableAssessments(Array.isArray(assessRes.data) ? assessRes.data : (assessRes.data.assessments || []));
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : (courseRes.data.courses || []));
      } catch (error) {
        console.error("Gagal mengambil data pendukung:", error);
      }
    };
    fetchData();
  }, [user]);

  // PERBAIKAN LOGIKA 2: Simpan progress ke localStorage SPESIFIK UNTUK USER INI
  useEffect(() => {
    if (user) {
      const userId = user.id || user._id;
      localStorage.setItem(`growpath_progress_${userId}`, JSON.stringify(progress));
    }
  }, [progress, user]);

  useEffect(() => {
    if (user) localStorage.setItem('growpath_user', JSON.stringify(user));
    else localStorage.removeItem('growpath_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('growpath_talent_mappings', JSON.stringify(talentMappings));
  }, [talentMappings]);


  // --- Definisi Fungsi ---
  const saveAssessment = (assessmentResult) => {
    const attemptId = assessmentResult.attemptId || Date.now().toString();
    const newAssessment = { ...assessmentResult, attemptId };
    setProgress(prev => ({ ...prev, assessments: [...(prev.assessments || []), newAssessment] }));
    return attemptId;
  };

  const deleteAssessmentHistory = (attemptId) => {
    setProgress(prev => ({ ...prev, assessments: (prev.assessments || []).filter(a => a.attemptId !== attemptId) }));
  };

  const markCourseCompleted = (courseId) => {
    setProgress(prev => {
      const targetId = String(courseId); // Paksa jadi string
      const currentCompleted = prev.completedCourses || []; // Cegah undefined
      const updatedCompleted = currentCompleted.includes(targetId) ? currentCompleted : [...currentCompleted, targetId];
      return { ...prev, completedCourses: updatedCompleted };
    });
  };

  const addCourse = (data) => {
    const newCourse = data.course || data.data || data; 
    setCourses(prev => [...prev, { ...newCourse, id: newCourse._id || newCourse.id }]);
  };

  const updateCourse = (data) => {
    const updatedData = data.course || data.data || data;
    const targetId = String(updatedData.id || updatedData._id);

    setCourses(prev => prev.map(c => {
      const currentId = String(c.id || c._id);
      return currentId === targetId ? { ...c, ...updatedData } : c;
    }));
  };

  const deleteCourse = (id) => {
    const targetId = String(id);
    setCourses(prev => prev.filter(c => String(c.id || c._id) !== targetId));
  };

  const addAssessment = (assessment) => setAvailableAssessments(prev => [...prev, { ...assessment, id: assessment._id || assessment.id }]);
  const updateAssessment = (updatedData) => setAvailableAssessments(prev => prev.map(a => (String(a.id || a._id) === String(updatedData.id || updatedData._id)) ? { ...a, ...updatedData } : a));
  const deleteAssessment = (id) => setAvailableAssessments(prev => prev.filter(a => String(a.id || a._id) !== String(id)));

  const addTalentMapping = (t) => setTalentMappings(prev => [...prev, { ...t, id: Date.now() }]);
  const updateTalentMapping = (id, data) => setTalentMappings(prev => prev.map(t => String(t.id) === String(id) ? { ...t, ...data } : t));
  const deleteTalentMapping = (id) => setTalentMappings(prev => prev.filter(t => String(t.id) !== String(id)));

  // PERBAIKAN LOGIKA 3: Saat Login, cek progress lokal milik spesifik user
  const login = async (userData) => {
    const userId = userData.id || userData._id;
    setUser(userData);
    
    // Cek apakah user ini punya progress lokal sebelumnya
    const savedProgress = localStorage.getItem(`growpath_progress_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress)); // Pulihkan progress lama
    } else {
      setProgress(defaultProgress); // KOSONGKAN UNTUK USER BARU
    }

    await refreshProgress(userId);
  };

  // PERBAIKAN LOGIKA 4: Hapus State di memory, tapi pertahankan di LocalStorage
  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      
      // Mengosongkan state di memory agar user yang login selanjutnya (jika device sama)
      // mulai dari 0, HINGGA mereka memanggil fungsi login() dan datanya diambil.
      setProgress(defaultProgress); 
      
      localStorage.removeItem('growpath_user');
      
      // CATATAN: Kita TIDAK MENGHAPUS `growpath_progress_${user.id}` di LocalStorage.
      // Dengan begini, gembok tidak tertutup lagi saat user yang sama login kembali.
      
      return true;
    } catch (error) {
      console.error("Logout gagal:", error);
      return false;
    }
  };

  const updateProfile = (data) => setUser(prev => ({ ...prev, ...data }));

  const toggleRoadmapItem = (phaseId, itemId) => {
    setProgress(prev => {
      const currentChecklist = prev.roadmapChecklist || {};
      const current = currentChecklist[phaseId] || [];
      const next = current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId];
      return { ...prev, roadmapChecklist: { ...currentChecklist, [phaseId]: next } };
    });
  };

  return (
    <AppContext.Provider
      value={{
        user, login, logout, updateProfile, loading,
        progress, setProgress, toggleRoadmapItem, saveAssessment, deleteAssessmentHistory, markCourseCompleted,
        courses, addCourse, updateCourse, deleteCourse,
        availableAssessments, addAssessment, updateAssessment, deleteAssessment,
        talentMappings, addTalentMapping, updateTalentMapping, deleteTalentMapping
      }}
    >
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};