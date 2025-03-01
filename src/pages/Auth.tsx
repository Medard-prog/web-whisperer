
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import WavyBackground from '@/components/WavyBackground';
import { AtSign, Eye, EyeOff, Lock, User } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  email: z.string().email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, signUp, loading } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmitLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      console.log("Attempting login with:", values.email);
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onSubmitRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      console.log("Attempting registration with:", values.email);
      await signUp(values.email, values.password, values.name);
      toast.success('Cont creat cu succes!', {
        description: 'Te rugăm să verifici emailul pentru a confirma contul.',
      });
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  if (user && !loading) {
    console.log("User authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <WavyBackground className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/90 to-blue-50/80 backdrop-blur-sm" />
      </WavyBackground>
      
      <div className="max-w-md w-full mx-auto p-6 sm:p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-12 w-12 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold">W</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? 'Bine ai revenit!' : 'Creează un cont nou'}
          </h1>
          <p className="text-gray-500">
            {isLogin
              ? 'Intră în contul tău pentru a-ți gestiona proiectele.'
              : 'Completează detaliile pentru a crea un cont nou.'}
          </p>
        </div>

        <Tabs
          defaultValue="login"
          value={isLogin ? 'login' : 'register'}
          onValueChange={(value) => setIsLogin(value === 'login')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Autentificare</TabsTrigger>
            <TabsTrigger value="register">Înregistrare</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="exemplu@email.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parolă</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-9"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Ai uitat parola?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {loading ? 'Se procesează...' : 'Intră în cont'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onSubmitRegister)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Numele tău"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="exemplu@email.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parolă</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Parolă (minim 6 caractere)"
                            className="pl-9"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {loading ? 'Se procesează...' : 'Creează cont'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="text-center text-sm text-gray-500">
          <p>
            {isLogin ? 'Nu ai un cont?' : 'Ai deja un cont?'}{' '}
            <button
              type="button"
              className="text-purple-600 hover:text-purple-800 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Înregistrează-te' : 'Autentifică-te'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
