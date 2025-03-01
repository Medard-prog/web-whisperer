
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from '@/pages/Index';
import RequestProject from '@/pages/RequestProject';
import Auth from '@/pages/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPasswordConfirmation from '@/pages/ResetPasswordConfirmation';
import AuthCallback from '@/pages/AuthCallback';
import VerifyEmail from '@/pages/VerifyEmail';
import Logout from '@/pages/Logout';
import RequireAuth from '@/components/RequireAuth';
import Dashboard from '@/pages/dashboard/Dashboard';
import ProjectsPage from '@/pages/dashboard/ProjectsPage';
import MessagesPage from '@/pages/dashboard/MessagesPage';
import SupportPage from '@/pages/dashboard/SupportPage';
import ProjectDetails from '@/pages/dashboard/ProjectDetails';
import ProjectChat from '@/pages/dashboard/ProjectChat';
import Settings from '@/pages/dashboard/Settings';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminProjectDetails from '@/pages/admin/AdminProjectDetails';
import AdminClients from '@/pages/admin/AdminClients';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSettings from '@/pages/admin/AdminSettings';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/request-project" element={<RequestProject />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password-confirmation" element={<ResetPasswordConfirmation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/messages" element={<MessagesPage />} />
            <Route path="/dashboard/support" element={<SupportPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/project/:id/chat" element={<ProjectChat />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Admin routes */}
          <Route element={<RequireAuth adminRequired={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/project/:id" element={<AdminProjectDetails />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
