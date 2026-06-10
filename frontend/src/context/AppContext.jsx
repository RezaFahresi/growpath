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
    const savedUserStr = localStorage.getItem('growpath_user');
    return savedUserStr && savedUserStr !== "null" ? JSON.parse(savedUserStr) : null;
  });

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(defaultProgress);
  const [courses, setCourses] = useState([]);
  const [availableAssessments, setAvailableAssessments] = useState([]);
  const [talentMappings, setTalentMappings] = useState([]);
  
  // 🌟 STATE BARU: Menyimpan data talent mapping khusus milik user yang sedang login
  const [userTalent, setUserTalent] = useState(null);

  // ==========================================
  // 1. FUNGSI REFRESH PROGRESS
  // ==========================================
  const refreshProgress = useCallback(async () => {
    try {
      const res = await API.get('/progress'); 
      setProgress(prev => ({
        ...prev, 
        ...res.data,
        completedCourses: (res.data.completedCourses || res.data.completed_courses || []).map(String)
      }));
    } catch (err) {
      console.error("Gagal refresh progress:", err);
    }
  }, []);

  // ==========================================
  // 2. CHECK AUTH DAN FETCH DATA
  // ==========================================
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 🌟 PERBAIKAN: Ikut sertakan endpoint /talent-mapping dalam Promise.all
        const [authRes, assessRes, courseRes, talentRes] = await Promise.all([
          API.get('/auth/check-auth'),
          API.get('/assessments'),
          API.get('/courses'),
          API.get('/talent-mapping').catch(() => ({ data: [] })) // Fallback jika route backend belum siap
        ]);

        if (authRes.data?.user) {
          const currentUser = authRes.data.user;
          setUser(currentUser);
          setAvailableAssessments(Array.isArray(assessRes.data) ? assessRes.data : (assessRes.data.assessments || []));
          setCourses(Array.isArray(courseRes.data) ? courseRes.data : (courseRes.data.courses || []));
          
          const mappings = Array.isArray(talentRes.data) ? talentRes.data : (talentRes.data.mappings || []);
          setTalentMappings(mappings);

          // 🌟 LOGIKA PATOKAN: Cari apakah email user ini punya data penilaian dari admin
          const myStats = mappings.find(t => t.email === currentUser.email);
          setUserTalent(myStats || null);

          await refreshProgress();
        }
      } catch (err) {
        console.error("DEBUG: check-auth atau fetch data gagal!", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('growpath_user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, [refreshProgress]);

  // ==========================================
  // 3. SINKRONISASI LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    if (user) {
      localStorage.setItem('growpath_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('growpath_user');
    }
  }, [user]);


  // ==========================================
  // 4. FUNGSI-FUNGSI MANIPULASI DATA
  // ==========================================
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
    setCourses(prev => prev.map(c => String(c.id || c._id) === targetId ? { ...c, ...updatedData } : c));
  };

  const deleteCourse = (id) => {
    const targetId = String(id);
    setCourses(prev => prev.filter(c => String(c.id || c._id) !== targetId));
  };

  const addAssessment = (assessment) => setAvailableAssessments(prev => [...prev, { ...assessment, id: assessment._id || assessment.id }]);
  const updateAssessment = (updatedData) => setAvailableAssessments(prev => prev.map(a => (String(a.id || a._id) === String(updatedData.id || updatedData._id)) ? { ...a, ...updatedData } : a));
  const deleteAssessment = (id) => setAvailableAssessments(prev => prev.filter(a => String(a.id || a._id) !== String(id)));

  const addTalentMapping = (data) => {
    const newTalent = data.talent || data.data || data;
    setTalentMappings(prev => [...prev, { ...newTalent, id: newTalent._id || newTalent.id }]);
  };

  const updateTalentMapping = (data) => {
    const updatedData = data.talent || data.data || data;
    const targetId = String(updatedData.id || updatedData._id);
    setTalentMappings(prev => prev.map(t => String(t.id || t._id) === targetId ? { ...t, ...updatedData } : t));
  };

  const deleteTalentMapping = (id) => {
    const targetId = String(id);
    setTalentMappings(prev => prev.filter(t => String(t.id || t._id) !== targetId));
  };

  // ==========================================
  // 5. AUTH & PROFILE FUNCTIONS
  // ==========================================
  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('growpath_user', JSON.stringify(userData));
    
    try {
      // 🌟 PERBAIKAN: Tarik data talent mapping juga saat user baru berhasil login
      const [assessRes, courseRes, talentRes] = await Promise.all([
        API.get('/assessments'),
        API.get('/courses'),
        API.get('/talent-mapping').catch(() => ({ data: [] }))
      ]);
      setAvailableAssessments(Array.isArray(assessRes.data) ? assessRes.data : (assessRes.data.assessments || []));
      setCourses(Array.isArray(courseRes.data) ? courseRes.data : (courseRes.data.courses || []));
      
      const mappings = Array.isArray(talentRes.data) ? talentRes.data : (talentRes.data.mappings || []);
      setTalentMappings(mappings);

      const myStats = mappings.find(t => t.email === userData.email);
      setUserTalent(myStats || null);
    } catch (err) {
      console.error("Gagal menarik data master saat login:", err);
    }

    await refreshProgress();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('growpath_user');
    setUser(null);
    setProgress(defaultProgress); 
    setCourses([]); 
    setAvailableAssessments([]); 
    setTalentMappings([]); // Clear state saat keluar
    setUserTalent(null);   // Clear patokan stat saat keluar
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
        talentMappings, addTalentMapping, updateTalentMapping, deleteTalentMapping,
        // 🌟 EXPOSE DATA PATOKAN: Sekarang bisa dipakai di Dashboard.jsx atau Roadmap.jsx
        userTalent 
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