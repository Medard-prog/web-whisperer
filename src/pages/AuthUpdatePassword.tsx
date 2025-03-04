
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import WavyBackground from '@/components/WavyBackground';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

// Update password form schema
const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
  confirmPassword: z.string().min(6, 'Parola trebuie să aibă minim 6 caractere'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parolele nu coincid",
  path: ["confirmPassword"],
});

export default function AuthUpdatePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if the URL has a valid password recovery token
  useEffect(() => {
    const checkResetToken = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If no user with recovery token, redirect to reset password
      if (!user) {
        toast.error('Link invalid sau expirat', {
          description: 'Te rugăm să soliciți un nou link de resetare a parolei.',
        });
        navigate('/auth/reset-password');
      }
    };
    
    checkResetToken();
  }, [navigate]);

  const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setIsSuccess(true);
      toast.success('Parola a fost actualizată cu succes!', {
        description: 'Te poți autentifica acum cu noua parolă.',
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error('Eroare la actualizarea parolei', {
        description: error.message || 'Încearcă din nou mai târziu',
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
            {isSuccess ? 'Parolă actualizată' : 'Setează o nouă parolă'}
          </h1>
          <p className="text-gray-500">
            {isSuccess 
              ? 'Parola ta a fost actualizată cu succes.' 
              : 'Creează o nouă parolă pentru contul tău.'}
          </p>
        </div>

        {!isSuccess ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
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
                          placeholder="Parolă nouă (minim 6 caractere)"
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
                          placeholder="Confirmă parola nouă"
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
                {isSubmitting ? 'Se procesează...' : 'Actualizează parola'}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="mb-6">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg mb-6">
              <p>Parola ta a fost actualizată cu succes. Vei fi redirecționat către pagina de autentificare.</p>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Înapoi la Autentificare
            </Button>
          </div>
        )}

        <Separator className="my-6" />

        <div className="text-center text-sm text-gray-500">
          <Link
            to="/auth"
            className="flex items-center justify-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la Autentificare
          </Link>
        </div>
      </div>
    </div>
  );
}
