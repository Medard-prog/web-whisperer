
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import WavyBackground from '@/components/WavyBackground';
import { Mail, Lock, User, Building, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';

const Auth = () => {
  const { signIn, signUp, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadChecked, setInitialLoadChecked] = useState(false);
  
  // Get default tab from query params
  const defaultTab = searchParams.get('tab') || 'login';

  // Check for authenticated user and redirect if needed
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const checkTimeout = setTimeout(() => {
      setInitialLoadChecked(true);
    }, 2000);
    
    return () => clearTimeout(checkTimeout);
  }, []);
  
  // Redirect when user changes
  useEffect(() => {
    if (user) {
      console.log("Auth: User is logged in, redirecting to", redirectPath || '/dashboard');
      navigate(redirectPath || '/dashboard', { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      setError(null);
      
      await signIn(email, password, redirectPath || undefined);
      // Successful login will be handled by the auth state change in AuthContext
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'A apărut o eroare la autentificare');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      setError(null);
      
      await signUp(email, password, name, redirectPath || undefined);
      // Successful signup will be handled by the auth state change in AuthContext
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'A apărut o eroare la crearea contului');
    } finally {
      setFormLoading(false);
    }
  };

  // If still in initial loading state but haven't confirmed anything yet, show loading
  if (authLoading && !initialLoadChecked) {
    return <LoadingScreen message="Verificare sesiune..." timeout={3000} />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to={redirectPath || "/dashboard"} replace />;
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
          <Button
            variant="ghost"
            className="mb-4 p-0 text-primary hover:text-primary/80"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la pagina principală
          </Button>
          
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                WebCraft
              </CardTitle>
              <CardDescription className="text-center">
                Intră în cont sau creează un cont nou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue={defaultTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Autentificare</TabsTrigger>
                  <TabsTrigger value="register">Înregistrare</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="nume@exemplu.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={formLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Parolă</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-xs text-primary"
                          onClick={() => navigate('/reset-password')}
                          type="button"
                        >
                          Ai uitat parola?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={formLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={formLoading}
                    >
                      {formLoading ? 
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se procesează...</> : 
                        'Autentificare'
                      }
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nume</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Nume complet"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={formLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="nume@exemplu.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={formLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Parolă</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={formLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Companie (opțional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Numele companiei"
                          className="pl-10"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon (opțional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Număr de telefon"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={formLoading}
                    >
                      {formLoading ? 
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se procesează...</> : 
                        'Creează cont'
                      }
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-gray-500 text-center mt-2">
                Continuând, ești de acord cu 
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 mx-1">
                  Termenii și Condițiile
                </Link>
                și
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800 ml-1">
                  Politica de Confidențialitate
                </Link>
                .
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
