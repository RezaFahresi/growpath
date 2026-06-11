import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts & Protections
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import UserRoute from './routes/UserRoute';
import AdminRoute from './routes/AdminRoute';

// LAZY LOADING
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TestOverview = lazy(() => import('./pages/Assessments/TestOverview'));
const AssessmentList = lazy(() => import('./pages/Assessments/AssessmentList'));
const TakeAssessment = lazy(() => import('./pages/Assessments/TakeAssessment'));
const AssessmentResult = lazy(() => import('./pages/Assessments/AssessmentResult'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const CourseList = lazy(() => import('./pages/Courses/CourseList'));
const CourseDetail = lazy(() => import('./pages/Courses/CourseDetail'));
const Progress = lazy(() => import('./pages/Progress'));
const ProfileView = lazy(() => import('./pages/Profile/ProfileView'));
const EditProfile = lazy(() => import('./pages/Profile/EditProfile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const LoginAdmin = lazy(() => import('./pages/Admin/LoginAdmin'));
const RegisterAdmin = lazy(() => import('./pages/Admin/RegisterAdmin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const ManageCourses = lazy(() => import('./pages/Admin/ManageCourses'));
const ManageAssessments = lazy(() => import('./pages/Admin/ManageAssessments'));
const UserInsights = lazy(() => import('./pages/Admin/UserInsights'));
const ManageTalentMapping = lazy(() => import('./pages/Admin/ManageTalentMapping'));
const Reports = lazy(() => import('./pages/Admin/Reports'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<UserRoute><Layout /></UserRoute>}>
              <Route index element={<Dashboard />} />
              
              {/* RUTE ASSESSMENTS (Sudah Diperbaiki) */}
              <Route path="assessments" element={<AssessmentList />} />
              <Route path="assessments/:id" element={<TestOverview />} />
              <Route path="assessments/take/:id" element={<TakeAssessment />} />
              <Route path="assessments/result/:id" element={<AssessmentResult />} />
              
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="roadmap/:id" element={<RoadmapDetail />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="progress" element={<Progress />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="profile/edit" element={<EditProfile />} />
              
              <Route path="settings" element={<Navigate to="/dashboard/profile/edit" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="assessments" element={<ManageAssessments />} />
              <Route path="users" element={<UserInsights />} />
              <Route path="talent-mapping" element={<ManageTalentMapping />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}