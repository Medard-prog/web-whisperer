
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserDetails, ProfileData } from './types';
import { toast } from 'sonner';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to update user state with profile data
  const updateUserWithProfile = (
    userId: string, 
    email: string, 
    name: string | undefined, 
    isAdmin: boolean | undefined,
    profileData?: ProfileData
  ) => {
    setUser({
      id: userId,
      email: email || '',
      name: profileData?.name || name || email?.split('@')[0] || 'User',
      isAdmin: profileData?.is_admin || isAdmin || false,
      phone: profileData?.phone,
      company: profileData?.company,
    });
  };

  // Fetch profile data from the database
  const fetchProfileData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return null;
      }
        
      return profileData;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          console.log("Session found, user is logged in:", session.user.id);
          
          // Basic user info from session
          const name = session.user.user_metadata?.name;
          const isAdmin = session.user.user_metadata?.isAdmin;
          
          // Set basic user info first
          updateUserWithProfile(
            session.user.id,
            session.user.email || '',
            name,
            isAdmin
          );
          
          // Try to fetch additional profile data
          const profileData = await fetchProfileData(session.user.id);
          
          if (profileData) {
            console.log("Profile data found:", profileData);
            updateUserWithProfile(
              session.user.id,
              session.user.email || '',
              name,
              isAdmin,
              profileData
            );
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    updateUserWithProfile,
    fetchProfileData,
  };
}
