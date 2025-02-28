
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import RequestProject from "@/pages/RequestProject";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ProjectDetails from "@/pages/ProjectDetails";
import VerifyEmail from "@/pages/VerifyEmail";
import Settings from "@/pages/Settings";
import Logout from "@/pages/Logout";
import Support from "@/pages/dashboard/Support";
import Messages from "@/pages/dashboard/Messages";
import Projects from "@/pages/dashboard/Projects";

function App() {
  const location = useLocation();
  
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/request" element={<RequestProject />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          
          <Route path="/dashboard/settings" element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          } />
          
          <Route path="/dashboard/support" element={
            <RequireAuth>
              <Support />
            </RequireAuth>
          } />
          
          <Route path="/dashboard/messages" element={
            <RequireAuth>
              <Messages />
            </RequireAuth>
          } />
          
          <Route path="/dashboard/projects" element={
            <RequireAuth>
              <Projects />
            </RequireAuth>
          } />
          
          <Route path="/admin" element={
            <RequireAuth adminOnly={true}>
              <AdminDashboard />
            </RequireAuth>
          } />
          
          <Route path="/project/:id" element={
            <RequireAuth>
              <ProjectDetails />
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      
      <SonnerToaster position="bottom-right" />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
