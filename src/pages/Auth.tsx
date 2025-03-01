
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, UserRound, Building, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form fields
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerCompany, setRegisterCompany] = useState('');
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (session && !loading) {
      navigate('/dashboard');
    }
  }, [session, loading, navigate]);
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Completați toate câmpurile obligatorii');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('Autentificare reușită');
        // Navigation will be handled by the auth state change listener
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Eroare la autentificare';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email sau parolă incorectă';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Adresa de email nu a fost confirmată';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName) {
      toast.error('Completați toate câmpurile obligatorii');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
            company: registerCompany || undefined,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('Cont creat cu succes', {
          description: 'Verificați email-ul pentru a confirma contul.'
        });
        setActiveTab('login');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      let errorMessage = 'Eroare la crearea contului';
      if (error.message.includes('already registered')) {
        errorMessage = 'Acest email este deja înregistrat';
      } else if (error.message.includes('password')) {
        errorMessage = 'Parola trebuie să aibă minim 6 caractere';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-16 w-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-2xl">W</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === 'login' ? 'Bine ai venit înapoi' : 'Creează un cont nou'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'login' 
                ? 'Conectează-te pentru a-ți gestiona proiectele' 
                : 'Completează detaliile pentru a crea un cont nou'}
            </p>
          </div>
          
          <Card className="border-none shadow-lg">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Conectare</TabsTrigger>
                <TabsTrigger value="register">Înregistrare</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="exemplu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password">Parolă</Label>
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-purple-600 hover:text-purple-800"
                        >
                          {showPassword ? 'Ascunde' : 'Arată'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Parola ta"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Se procesează...' : 'Conectare'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nume complet *</Label>
                      <div className="relative">
                        <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Numele tău complet"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="exemplu@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="register-password">Parolă *</Label>
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-purple-600 hover:text-purple-800"
                        >
                          {showPassword ? 'Ascunde' : 'Arată'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minim 6 caractere"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-company">Companie (opțional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-company"
                          type="text"
                          placeholder="Numele companiei"
                          value={registerCompany}
                          onChange={(e) => setRegisterCompany(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Se procesează...' : 'Creează cont'}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Prin crearea unui cont, ești de acord cu 
                      <a href="#" className="text-purple-600 hover:text-purple-800 mx-1">Termenii și Condițiile</a>
                      și
                      <a href="#" className="text-purple-600 hover:text-purple-800 ml-1">Politica de Confidențialitate</a>.
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
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
