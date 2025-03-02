
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
    // Define a clean-up flag to prevent navigation after component unmount
    let isSubscribed = true;

    const setupAuthSubscription = async () => {
      try {
        // Listen for auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!isSubscribed) return; // Skip if component unmounted
            
            console.log('Auth state changed:', event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (newSession?.user) {
                console.log("User signed in:", newSession.user.id);
                
                // Navigate to dashboard on successful login
                if (isSubscribed) navigate('/dashboard');
                
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
                
                if (profileData && isSubscribed) {
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
              if (isSubscribed) navigate('/auth');
            }
          }
        );
        
        // Cleanup subscription on unmount
        return () => {
          isSubscribed = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth subscription:", error);
        // Even if there's an error, we need to provide a cleanup function
        return () => {
          isSubscribed = false;
        };
      }
    };

    const cleanup = setupAuthSubscription();
    return () => {
      // Mark as unsubscribed immediately
      isSubscribed = false;
      // Then handle any other cleanup needed
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(fn => fn && fn());
      }
    };
  }, [navigate, setSession, updateUserWithProfile, fetchProfileData]);
}
