
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserDetails } from './types';
import { useNavigate } from 'react-router-dom';

export function useAuthMethods(
  setLoading: (loading: boolean) => void,
  setUser: (user: UserDetails | null) => void
) {
  const navigate = useNavigate();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing in:', error);
        toast.error('Eroare la autentificare', {
          description: error.message
        });
        throw error;
      }

      toast.success('Autentificare reușită');
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        console.error('Error signing up:', error);
        toast.error('Eroare la înregistrare', {
          description: error.message
        });
        throw error;
      }
      
      toast.success('Înregistrare reușită', {
        description: 'Verifică-ți email-ul pentru a confirma contul'
      });
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out the user
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
      toast.success('Te-ai deconectat cu succes');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Eroare la deconectare');
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
}
