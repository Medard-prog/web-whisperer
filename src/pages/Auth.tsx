
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-16 w-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-2xl">W</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bine ai venit înapoi
            </h1>
            <p className="text-gray-600">
              Conectează-te sau creează un cont pentru a continua
            </p>
          </div>
          
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Autentificare</CardTitle>
              <CardDescription>
                Folosește email-ul și parola pentru a te conecta
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
                        inputBackground: 'white',
                        inputBorder: 'lightgray',
                        inputText: 'black',
                        inputLabelText: 'gray',
                      },
                      borderWidths: {
                        buttonBorderWidth: '1px',
                        inputBorderWidth: '1px',
                      },
                      radii: {
                        borderRadiusButton: '0.375rem',
                        buttonBorderRadius: '0.375rem',
                        inputBorderRadius: '0.375rem',
                      },
                    },
                  },
                  style: {
                    button: {
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.75rem 1rem',
                      border: '1px solid transparent',
                      background: 'linear-gradient(to right, #8B5CF6, #6366F1)',
                      color: 'white',
                      fontWeight: '500',
                      textTransform: 'none',
                    },
                    input: {
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.625rem 0.75rem',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    },
                    label: {
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#4B5563',
                    },
                    anchor: {
                      color: '#8B5CF6',
                      fontSize: '0.875rem',
                    },
                    message: {
                      fontSize: '0.875rem',
                      color: '#EF4444',
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
              />
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-purple-700"
                >
                  <ArrowRight size={14} className="mr-1" />
                  Înapoi la pagina principală
                </button>
              </div>
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
