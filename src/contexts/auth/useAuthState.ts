
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
    console.log("Updating user with profile:", { userId, email, name, isAdmin, profileData });
    
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
      console.log("Fetching profile data for user:", userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        // If profile doesn't exist (PGRST116), that's OK
        if (profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else {
          console.log("Profile not found for user:", userId);
        }
        return null;
      }
      
      console.log("Profile fetched successfully:", profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
  };

  // Initialize auth state - no longer needed as useAuthSubscription handles this
  // This will just provide the interface but not actually fetch anything
  useEffect(() => {
    // Don't do the initialization here, let useAuthSubscription handle it
    console.log("useAuthState initial setup");
    
    // Still set a timeout to force loading to false after a maximum time
    // This helps prevent infinite loading issues
    const forceTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Force stopping loading state after timeout");
        setLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(forceTimeout);
  }, [loading]);

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
