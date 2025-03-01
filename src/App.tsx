
import { BrowserRouter } from 'react-router-dom';
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
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
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
              <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
              <Route path="/dashboard/projects" element={<div>Projects (Coming Soon)</div>} />
              <Route path="/dashboard/messages" element={<div>Messages (Coming Soon)</div>} />
              <Route path="/dashboard/support" element={<div>Support (Coming Soon)</div>} />
              <Route path="/project/:id" element={<div>Project Details (Coming Soon)</div>} />
              <Route path="/project/:id/chat" element={<div>Project Chat (Coming Soon)</div>} />
              <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<RequireAuth adminRequired={true} />}>
              <Route path="/admin" element={<div>Admin Dashboard (Coming Soon)</div>} />
              <Route path="/admin/projects" element={<div>Admin Projects (Coming Soon)</div>} />
              <Route path="/admin/project/:id" element={<div>Admin Project Details (Coming Soon)</div>} />
              <Route path="/admin/clients" element={<div>Admin Clients (Coming Soon)</div>} />
              <Route path="/admin/messages" element={<div>Admin Messages (Coming Soon)</div>} />
              <Route path="/admin/reports" element={<div>Admin Reports (Coming Soon)</div>} />
              <Route path="/admin/settings" element={<div>Admin Settings (Coming Soon)</div>} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
