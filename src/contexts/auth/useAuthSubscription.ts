
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthSubscription(
  setSession: (session: any) => void,
  updateUserWithProfile: any,
  fetchProfileData: any,
  setLoading: (loading: boolean) => void
) {
  const navigate = useNavigate();

  useEffect(() => {
    // Define a clean-up flag to prevent navigation after component unmount
    let isSubscribed = true;

    const setupAuthSubscription = async () => {
      try {
        // Mark loading as true initially
        setLoading(true);
        
        // First check for existing session
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting existing session:", sessionError);
          if (isSubscribed) setLoading(false);
          return;
        }
        
        // Update session with existing session
        if (existingSession) {
          console.log("Found existing session for user:", existingSession.user.id);
          if (isSubscribed) {
            setSession(existingSession);
            
            // Basic user info from session
            const name = existingSession.user.user_metadata?.name;
            const isAdmin = existingSession.user.user_metadata?.isAdmin;
            
            // Set basic user info first
            updateUserWithProfile(
              existingSession.user.id,
              existingSession.user.email || '',
              name,
              isAdmin
            );
            
            // Try to fetch profile data
            try {
              const profileData = await fetchProfileData(existingSession.user.id);
              
              if (profileData && isSubscribed) {
                console.log("Profile data found for existing session:", profileData);
                updateUserWithProfile(
                  existingSession.user.id,
                  existingSession.user.email || '',
                  name,
                  isAdmin,
                  profileData
                );
              }
            } catch (profileError) {
              console.error("Error fetching profile for existing session:", profileError);
            }
          }
        } else {
          console.log("No existing session found");
        }
        
        // Set loading to false after processing existing session
        if (isSubscribed) setLoading(false);
        
        // Listen for auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!isSubscribed) return; // Skip if component unmounted
            
            console.log('Auth state changed:', event);
            
            // Set loading true when auth state changes
            if (isSubscribed) setLoading(true);
            
            // Update session state
            if (isSubscribed) setSession(newSession);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (newSession?.user) {
                console.log("User signed in:", newSession.user.id);
                
                // Navigate to dashboard on successful login
                // Only navigate if component is still mounted
                if (isSubscribed) {
                  // Wrap in timeout to ensure it happens after state updates
                  setTimeout(() => {
                    if (isSubscribed) navigate('/dashboard');
                  }, 100);
                }
                
                // Basic user info from session
                const name = newSession.user.user_metadata?.name;
                const isAdmin = newSession.user.user_metadata?.isAdmin;
                
                // Set basic user info first
                if (isSubscribed) {
                  updateUserWithProfile(
                    newSession.user.id,
                    newSession.user.email || '',
                    name,
                    isAdmin
                  );
                }
                
                // Try to fetch profile data
                try {
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
                } catch (profileError) {
                  console.error("Error fetching profile on sign in:", profileError);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              // Only navigate if component is still mounted
              if (isSubscribed) {
                // Navigate immediately to prevent auth loops
                navigate('/auth');
              }
            }
            
            // Set loading to false after processing auth change
            if (isSubscribed) setLoading(false);
          }
        );
        
        // Cleanup subscription on unmount
        return () => {
          console.log("Cleaning up auth subscription");
          isSubscribed = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth subscription:", error);
        // Make sure loading is set to false on error
        if (isSubscribed) setLoading(false);
        
        // Show error toast
        toast.error("Eroare de autentificare", { 
          description: "S-a produs o eroare la inițializarea autentificării" 
        });
        
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
  }, [navigate, setSession, updateUserWithProfile, fetchProfileData, setLoading]);
}
