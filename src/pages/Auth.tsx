
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';

const Auth = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (session && !loading) {
      navigate('/dashboard');
    }
  }, [session, loading, navigate]);
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bine ai venit înapoi
            </h1>
            <p className="mt-2 text-gray-600">
              Conectează-te sau creează un cont pentru a continua
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Autentificare</CardTitle>
              <CardDescription>
                Conectează-te cu email și parolă sau creează un cont nou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupabaseAuth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#8B5CF6', // Purple-500
                        brandAccent: '#7C3AED', // Purple-600
                      },
                    },
                  },
                  style: {
                    button: {
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.625rem 1rem',
                    },
                    input: {
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Adresa de email',
                      password_label: 'Parolă',
                      email_input_placeholder: 'exemplu@email.com',
                      password_input_placeholder: 'Parola ta',
                      button_label: 'Conectare',
                      loading_button_label: 'Se conectează...',
                      social_provider_text: 'Conectare cu {{provider}}',
                      link_text: 'Ai deja un cont? Conectează-te',
                    },
                    sign_up: {
                      email_label: 'Adresa de email',
                      password_label: 'Parolă',
                      email_input_placeholder: 'exemplu@email.com',
                      password_input_placeholder: 'Creează o parolă',
                      button_label: 'Creează cont',
                      loading_button_label: 'Se creează contul...',
                      social_provider_text: 'Creează cont cu {{provider}}',
                      link_text: 'Nu ai cont? Înregistrează-te',
                      confirmation_text: 'Verifică email-ul pentru link-ul de confirmare',
                    },
                    forgotten_password: {
                      email_label: 'Adresa de email',
                      password_label: 'Parolă',
                      email_input_placeholder: 'exemplu@email.com',
                      button_label: 'Resetează parola',
                      loading_button_label: 'Se trimite email-ul de resetare...',
                      link_text: 'Ai uitat parola?',
                      confirmation_text: 'Verifică email-ul pentru link-ul de resetare',
                    },
                  },
                }}
                providers={[]}
                redirectTo={`${window.location.origin}/auth/callback`}
                onError={(error) => {
                  console.error('Auth error:', error);
                  toast.error('Eroare de autentificare', {
                    description: error.message,
                  });
                }}
              />
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ai nevoie de ajutor? Contactează-ne la{' '}
              <a
                href="mailto:support@example.com"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
