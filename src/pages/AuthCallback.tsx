
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  
  console.log("AuthCallback component rendering");

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Processing auth callback");
      try {
        // Process the OAuth callback or email confirmation
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Auth callback session result:", { 
          hasSession: !!data?.session, 
          error: error?.message 
        });
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          console.log("Session found, redirecting to dashboard");
          toast.success('Autentificare reușită');
          navigate('/dashboard');
        } else {
          console.log("No session found, redirecting to auth");
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        toast.error('Eroare la autentificare');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Se procesează autentificarea...</h2>
        <p className="mt-2 text-gray-600">Te vom redirecționa în câteva momente.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
