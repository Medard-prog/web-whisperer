
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserDetails } from './types';

export function useProfileManagement(
  user: UserDetails | null,
  session: any,
  setLoading: (loading: boolean) => void,
  setUser: (user: UserDetails | null) => void
) {
  // Refresh the user's profile data
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error refreshing user data:', error);
          toast.error('Nu s-a putut actualiza profilul');
          return;
        }
          
        if (data) {
          console.log("Profile data refreshed:", data);
          if (user) {
            setUser({
              ...user,
              name: data.name || user.name,
              isAdmin: data.is_admin || user.isAdmin,
              phone: data.phone,
              company: data.company,
            });
          }
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        toast.error('Nu s-a putut actualiza profilul');
      }
    }
  };
  
  // Update the user's profile
  const updateProfile = async (userData: Partial<UserDetails>) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userData.name,
          phone: userData.phone,
          company: userData.company,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        console.error('Error updating profile in database:', error);
        throw error;
      }
      
      // Update local user state
      setUser({ ...user, ...userData });
      toast.success('Profilul a fost actualizat');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Nu s-a putut actualiza profilul');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    refreshUser,
    updateProfile
  };
}
