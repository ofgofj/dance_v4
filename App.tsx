import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts & Pages
import Layout from './components/Layout';
import ParentLayout from './components/ParentLayout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import ClassesPage from './pages/ClassesPage';
import AttendancePage from './pages/AttendancePage';
import PaymentsPage from './pages/PaymentsPage';
import LoginPage from './pages/LoginPage';
import ParentsPage from './pages/admin/ParentsPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/parent/ChangePasswordPage';

const HomeRedirect: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return currentUser.role === 'admin' ? <Navigate to="/dashboard" replace /> : <Navigate to="/parent/dashboard" replace />;
};

const ProtectedRoute: React.FC<{ role: 'admin' | 'parent' }> = ({ role }) => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/login" replace />;
  }
  
  const AppLayout = role === 'admin' ? Layout : ParentLayout;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FA]">
        <div className="text-pink-500 animate-spin text-4xl">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomeRedirect />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/parents" element={<ParentsPage />} />
          <Route path="/admin-settings" element={<AdminManagementPage />} />
        </Route>

        {/* Parent Routes */}
        <Route element={<ProtectedRoute role="parent" />}>
            <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
            <Route path="/parent/change-password" element={<ChangePasswordPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;