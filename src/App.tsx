import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/auth";
import RequireAuth from "@/components/RequireAuth";
import VerifyEmail from "@/pages/VerifyEmail";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import RequestProject from "@/pages/RequestProject";
import ProjectDetails from "@/pages/ProjectDetails";
import Projects from "@/pages/dashboard/Projects";
import Settings from "@/pages/Settings";
import Messages from "@/pages/dashboard/Messages";
import Support from "@/pages/dashboard/Support";
import ProjectChat from "@/pages/dashboard/ProjectChat";
import AdminProjects from "@/pages/admin/Projects";
import AdminClients from "@/pages/admin/Clients";
import AdminMessages from "@/pages/admin/Messages";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";
import AdminProjectDetails from "@/pages/admin/ProjectDetails";
import AdminProjectChat from "@/pages/admin/ProjectChat";
import { lazy, Suspense, useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const App = () => {
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Caught error:", event.error);
      setError(event.error);
      event.preventDefault();
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (error) {
    return (
      <div role="alert" className="p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error: {error.message}</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/request" element={<RequestProject />} />
          
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/dashboard/projects" element={<RequireAuth><Projects /></RequireAuth>} />
          <Route path="/dashboard/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/dashboard/project/:id/chat" element={<RequireAuth><ProjectChat /></RequireAuth>} />
          <Route path="/dashboard/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/dashboard/help" element={<RequireAuth><Support /></RequireAuth>} />
          <Route path="/project/:id" element={<RequireAuth><ProjectDetails /></RequireAuth>} />
          <Route path="/project/:id/chat" element={<RequireAuth><ProjectChat /></RequireAuth>} />
          
          <Route path="/admin" element={<RequireAuth adminOnly={true}><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/projects" element={<RequireAuth adminOnly={true}><AdminProjects /></RequireAuth>} />
          <Route path="/admin/clients" element={<RequireAuth adminOnly={true}><AdminClients /></RequireAuth>} />
          <Route path="/admin/messages" element={<RequireAuth adminOnly={true}><AdminMessages /></RequireAuth>} />
          <Route path="/admin/reports" element={<RequireAuth adminOnly={true}><AdminReports /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth adminOnly={true}><AdminSettings /></RequireAuth>} />
          <Route path="/admin/project/:id" element={<RequireAuth adminOnly={true}><AdminProjectDetails /></RequireAuth>} />
          <Route path="/admin/project/:id/chat" element={<RequireAuth adminOnly={true}><AdminProjectChat /></RequireAuth>} />
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        <Toaster />
        <SonnerToaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "0.5rem"
            }
          }}
        />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
