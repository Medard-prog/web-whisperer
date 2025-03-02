
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { lazy, Suspense, Component, ReactNode } from "react";
import LoadingScreen from "@/components/LoadingScreen";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're sorry, but an error occurred while rendering the application.</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
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
      </Router>
    </ErrorBoundary>
  );
};

export default App;
