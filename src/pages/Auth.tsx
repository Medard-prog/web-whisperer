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
  
  const defaultTab = searchParams.get('tab') || 'login';

  // Handle automatic redirection when auth state changes
  useEffect(() => {
    if (user && !authLoading) {
      console.log('Valid session detected, redirecting...');
      const finalRedirectPath = redirectPath || from || '/dashboard';
      navigate(finalRedirectPath, { replace: true });
    }
  }, [user, authLoading, navigate, redirectPath, from]);

  // Handle initial session check timeout
  useEffect(() => {
    const checkTimeout = setTimeout(() => {
      setInitialCheck(false);
    }, 2000);
    
    return () => clearTimeout(checkTimeout);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Login started');
      setFormLoading(true);
      setError(null);
      
      await signIn(email, password);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'A apărut o eroare la autentificare');
    } finally {
      console.log('Login finalized');
      setFormLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, company: string, phone: string) => {
    try {
      setFormLoading(true);
      setError(null);
      
      await signUp(email, password, name);
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'A apărut o eroare la crearea contului');
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading && initialCheck) {
    return <LoadingScreen message="Verificare sesiune..." timeout={3000} />;
  }

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