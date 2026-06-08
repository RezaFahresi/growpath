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
  const [progress, setProgress] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('growpath_user');
      const savedUser = savedUserStr && savedUserStr !== "null" ? JSON.parse(savedUserStr) : null;
      
      if (savedUser) {
        const userId = savedUser.id || savedUser._id;
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

  // ==========================================
  // 🔥 PERBAIKAN UTAMA 1: REFRESH PROGRESS (JWT)
  // Tidak perlu lagi pakai parameter userId di URL!
  // ==========================================
  const refreshProgress = useCallback(async () => {
    try {
      // Backend akan otomatis membaca User ID dari Token JWT di Header
      const res = await API.get('/progress'); 
      
      setProgress(prev => {
        const dbCompleted = res.data.completedCourses || res.data.completed_courses || [];
        const formattedCompleted = dbCompleted.map(id => String(id));

        return {
          ...prev, 
          ...res.data, 
          activeCourses: res.data.activeCourses || prev.activeCourses,
          completedCourses: formattedCompleted.length > 0 ? formattedCompleted : prev.completedCourses
        };
      });
    } catch (err) {
      console.error("Gagal refresh progress dari DB:", err);
    }
  }, []);

  // ==========================================
  // 🔥 PERBAIKAN UTAMA 2: CHECK AUTH (JWT)
  // Cek token di LocalStorage dulu sebelum memanggil API
  // ==========================================
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      // Jika tidak ada token, langsung hentikan loading (jangan panggil API)
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/check-auth');
        if (response.data?.user) {
          const userData = response.data.user;
          setUser(userData);
          await refreshProgress(); // Panggil tanpa parameter
        } else {
          setUser(null);
          setProgress(defaultProgress); 
        }
      } catch (err) {
        // Jika token tidak valid / expired, hapus tokennya
        localStorage.removeItem('token');
        setUser(null);
        setProgress(defaultProgress); 
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

  // Simpan progress ke localStorage SPESIFIK UNTUK USER INI
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
      const targetId = String(courseId); 
      const currentCompleted = prev.completedCourses || []; 
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

  // Saat Login
  const login = async (userData) => {
    const userId = userData.id || userData._id;
    setUser(userData);
    
    const savedProgress = localStorage.getItem(`growpath_progress_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress)); 
    } else {
      setProgress(defaultProgress); 
    }

    await refreshProgress(); // Panggil tanpa parameter
  };

  // ==========================================
  // 🔥 PERBAIKAN UTAMA 3: LOGOUT (JWT)
  // Tidak perlu API post ke backend lagi!
  // ==========================================
  const logout = () => {
    localStorage.removeItem('token'); // Hapus JWT Token
    localStorage.removeItem('growpath_user');
    setUser(null);
    setProgress(defaultProgress); 
    
    // Opsional, tapi disarankan untuk membersihkan cache browser:
    window.location.href = '/login'; 
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