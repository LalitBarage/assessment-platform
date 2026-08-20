import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RegisterUserPage from './pages/admin/RegisterUserPage';
import ManageStudentsPage from './pages/admin/ManageStudentsPage';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import ManageAssessmentsPage from './pages/trainer/ManageAssessmentsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import TodayQuizzesPage from './pages/student/TodayQuizzesPage';
import StudentSettingsPage from './pages/student/StudentSettingsPage';
import TakeQuizPage from './pages/student/TakeQuizPage';
import QuizResultPage from './pages/student/QuizResultPage';
import StudentResultsPage from './pages/student/StudentResultsPage';

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Redirect based on role
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'trainer') return <Navigate to="/trainer" replace />;
  if (user.role === 'student') return <Navigate to="/student" replace />;

  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirect based on role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="register-user" element={<RegisterUserPage />} />
        <Route path="students" element={<ManageStudentsPage />} />
        <Route path="assessments" element={<ManageAssessmentsPage />} />
      </Route>

      {/* Trainer Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={['trainer', 'admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="assessments" element={<ManageAssessmentsPage />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="quizzes/today" element={<TodayQuizzesPage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
        <Route path="results" element={<StudentResultsPage />} />
        <Route path="quizzes/:id/take" element={<TakeQuizPage />} />
        <Route path="quizzes/:id/result" element={<QuizResultPage />} />
      </Route>

      {/* Catch all unhandled routes */}
      <Route
        path="*"
        element={
          <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <p className="mt-2 text-gray-600">Page not found</p>
          </div>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
