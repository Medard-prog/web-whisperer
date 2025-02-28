
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  useEffect(() => {
    // Check if we have a token in the URL (email verification link clicked)
    const token = searchParams.get('token') || '';
    const type = searchParams.get('type') || '';
    const email = searchParams.get('email') || '';
    
    if (email) {
      setEmail(email);
    }

    // If we have a token, attempt to verify the email
    if (token && type === 'email_confirmation') {
      handleEmailVerification(token);
    }
  }, [searchParams]);
  
  const handleEmailVerification = async (token: string) => {
    try {
      setVerifying(true);
      
      // This is now handled by the auth-ui-react library's redirects
      // Just redirect to the appropriate page based on the verification result
      navigate('/auth');
      toast.success('Email verificat cu succes! Te poți autentifica acum.');
      
    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error('A apărut o eroare la verificarea emailului');
    } finally {
      setVerifying(false);
    }
  };
  
  const handleResendVerification = async () => {
    try {
      if (!email) {
        toast.error('Adresa de email lipsește');
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Email de verificare retrimis cu succes');
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Eroare la retrimiterea emailului de verificare');
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Verifică-ți emailul
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            {email ? (
              <>
                Am trimis un email de verificare la <span className="font-semibold">{email}</span>. 
                Te rugăm să verifici căsuța de email și să urmezi instrucțiunile pentru a finaliza înregistrarea.
              </>
            ) : (
              <>
                Te rugăm să verifici căsuța de email și să urmezi instrucțiunile pentru a finaliza înregistrarea.
              </>
            )}
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleResendVerification} 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={verifying}
            >
              Retrimite emailul de verificare
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Înapoi la autentificare
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Nu ai primit emailul? Verifică și folderul de spam sau contactează-ne la{' '}
              <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-500">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyEmail;
