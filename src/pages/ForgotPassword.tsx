import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { AtSign, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Reset password form schema
const resetPasswordSchema = z.object({
  email: z.string().email('Email invalid'),
});

export default function ForgotPassword() {
  console.log("ForgotPassword component rendering");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      console.log("Attempting to reset password for:", values.email);
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirmation`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }
      
      console.log("Password reset email sent successfully");
      setIsSuccess(true);
      toast.success('Email trimis cu succes!', {
        description: 'Verifică căsuța de email pentru instrucțiuni de resetare a parolei.',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Nu s-a putut trimite email-ul de resetare', {
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
            Ai uitat parola?
          </h1>
          <p className="text-gray-500">
            Introdu adresa de email și îți vom trimite un link pentru resetarea parolei.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 h-16 w-16 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Email trimis!</h2>
            <p className="text-gray-600 mb-6">
              Am trimis un email cu instrucțiuni pentru resetarea parolei.
              Verifică și folderul de Spam dacă nu găsești email-ul.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Link to="/auth">Înapoi la autentificare</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitResetPassword)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSubmitting ? 'Se procesează...' : 'Trimite link de resetare'}
              </Button>

              <div className="text-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Înapoi la autentificare
                </Link>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
