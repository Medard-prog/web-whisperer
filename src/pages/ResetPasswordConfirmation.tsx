
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { toast } from 'sonner';
import WavyBackground from '@/components/WavyBackground';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Reset password form schema
const newPasswordSchema = z.object({
  password: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
  confirmPassword: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Parolele nu coincid",
  path: ["confirmPassword"],
});

export default function ResetPasswordConfirmation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if URL contains hash from Supabase
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      toast.error('Link invalid', {
        description: 'Link-ul de resetare a parolei este invalid sau a expirat.'
      });
      navigate('/auth');
    }
  }, [navigate]);
  
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitNewPassword = async (values: z.infer<typeof newPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Parolă resetată cu succes!', {
        description: 'Acum te poți autentifica cu noua parolă.',
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Nu s-a putut reseta parola', {
        description: error.message || 'Te rugăm să încerci din nou mai târziu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Resetează parola
          </h1>
          <p className="text-gray-500">
            Introdu noua parolă pentru a-ți actualiza contul.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitNewPassword)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parolă nouă</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minim 6 caractere"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmă parola</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Introdu din nou parola"
                        className="pl-9"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSubmitting ? 'Se procesează...' : 'Resetează parola'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Ți-ai amintit parola?{' '}
                <Link
                  to="/auth"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Autentifică-te
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
