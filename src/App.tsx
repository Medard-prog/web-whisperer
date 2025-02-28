
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import RequireAuth from "@/components/RequireAuth";
import PageTransition from "@/components/PageTransition";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import RequestProject from "@/pages/RequestProject";
import VerifyEmail from "@/pages/VerifyEmail";
import DashboardProjects from "@/pages/DashboardProjects";
import ProjectDetails from "@/pages/ProjectDetails";
import AdminProjects from "@/pages/AdminProjects";
import AdminClients from "@/pages/AdminClients";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/request-project" element={<RequestProject />} />

          {/* User Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/dashboard/projects" 
            element={
              <RequireAuth>
                <DashboardProjects />
              </RequireAuth>
            } 
          />
          <Route 
            path="/dashboard/projects/:id" 
            element={
              <RequireAuth>
                <ProjectDetails />
              </RequireAuth>
            } 
          />

          {/* Admin Dashboard Routes */}
          <Route 
            path="/admin" 
            element={
              <RequireAuth requireAdmin={true}>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <RequireAuth requireAdmin={true}>
                <AdminProjects />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/clients" 
            element={
              <RequireAuth requireAdmin={true}>
                <AdminClients />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/projects/:id" 
            element={
              <RequireAuth requireAdmin={true}>
                <ProjectDetails isAdmin={true} />
              </RequireAuth>
            } 
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
