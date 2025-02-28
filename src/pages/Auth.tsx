
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WavyBackground from '@/components/WavyBackground';
import LoadingScreen from '@/components/LoadingScreen';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthCard from '@/components/auth/AuthCard';

const Auth = () => {
  const { signIn, signUp, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const from = searchParams.get('from') ? decodeURIComponent(searchParams.get('from') || '') : '';
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCheck, setInitialCheck] = useState(true);
  
  // Get default tab from query params
  const defaultTab = searchParams.get('tab') || 'login';

  // Check for authenticated user and redirect if needed
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const checkTimeout = setTimeout(() => {
      setInitialCheck(false);
    }, 2000);
    
    return () => clearTimeout(checkTimeout);
  }, []);
  
  // Redirect when user changes
  useEffect(() => {
    if (user) {
      const finalRedirectPath = redirectPath || from || '/dashboard';
      console.log("Auth: User is logged in, redirecting to", finalRedirectPath);
      navigate(finalRedirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath, from]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setFormLoading(true);
      setError(null);
      
      await signIn(email, password, redirectPath || from || undefined);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'A apărut o eroare la autentificare');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, company: string, phone: string) => {
    try {
      setFormLoading(true);
      setError(null);
      
      await signUp(email, password, name, redirectPath || from || undefined);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'A apărut o eroare la crearea contului');
    } finally {
      setFormLoading(false);
    }
  };

  // If still in initial loading state but haven't confirmed anything yet, show loading
  if (authLoading && initialCheck) {
    return <LoadingScreen message="Verificare sesiune..." timeout={3000} />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to={redirectPath || from || "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <WavyBackground className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-indigo-500/20" />
      </WavyBackground>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AuthCard 
            defaultTab={defaultTab}
            loginForm={
              <LoginForm 
                onSubmit={handleLogin}
                error={error}
                loading={formLoading}
              />
            }
            registerForm={
              <RegisterForm 
                onSubmit={handleSignup}
                error={error}
                loading={formLoading}
              />
            }
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
