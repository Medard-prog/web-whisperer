
import { useState } from 'react';
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
import { AtSign, ArrowLeft } from 'lucide-react';

// Reset password form schema
const resetPasswordSchema = z.object({
  email: z.string().email('Email invalid'),
});

export default function AuthResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Get the absolute URL for the reset password page
      const redirectUrl = `${window.location.origin}/auth/update-password`;
      console.log("Reset password redirect URL:", redirectUrl);
      
      // Call Supabase to send the reset password email with the correct redirectTo URL
      const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Password reset email sent successfully:", data);
      
      // Show success message and status
      setIsSuccess(true);
      toast.success('Email de resetare trimis!', {
        description: 'Verifică-ți căsuța de email pentru a reseta parola.',
      });
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Eroare la trimiterea emailului de resetare', {
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
            {isSuccess ? 'Verifică-ți emailul' : 'Resetează parola'}
          </h1>
          <p className="text-gray-500">
            {isSuccess 
              ? 'Ți-am trimis un link de resetare a parolei.' 
              : 'Introdu adresa de email asociată contului tău.'}
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
            </form>
          </Form>
        ) : (
          <div className="mb-6">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg mb-6">
              <p>Am trimis un email de resetare a parolei la adresa introdusă. Verifică-ți inbox-ul și urmează instrucțiunile pentru a-ți reseta parola.</p>
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
