
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useAuthSubscription(
  setSession: (session: any) => void,
  updateUserWithProfile: any,
  fetchProfileData: any
) {
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuthSubscription = async () => {
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event);
          setSession(newSession);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (newSession?.user) {
              console.log("User signed in:", newSession.user.id);
              
              // Navigate to dashboard on successful login
              navigate('/dashboard');
              
              // Basic user info from session
              const name = newSession.user.user_metadata?.name;
              const isAdmin = newSession.user.user_metadata?.isAdmin;
              
              // Set basic user info first
              updateUserWithProfile(
                newSession.user.id,
                newSession.user.email || '',
                name,
                isAdmin
              );
              
              // Try to fetch profile data
              const profileData = await fetchProfileData(newSession.user.id);
              
              if (profileData) {
                console.log("Profile data found on sign in:", profileData);
                updateUserWithProfile(
                  newSession.user.id,
                  newSession.user.email || '',
                  name,
                  isAdmin,
                  profileData
                );
              }
            }
          } else if (event === 'SIGNED_OUT') {
            console.log("User signed out");
            navigate('/auth');
          }
        }
      );
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuthSubscription();
  }, [navigate, setSession, updateUserWithProfile, fetchProfileData]);
}
