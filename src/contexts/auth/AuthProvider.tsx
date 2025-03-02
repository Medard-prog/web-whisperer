
import React, { useEffect } from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthSubscription } from './useAuthSubscription';
import { useProfileManagement } from './useProfileManagement';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    updateUserWithProfile,
    fetchProfileData,
  } = useAuthState();
  
  // Set up auth subscription - pass setLoading to properly manage loading state
  useAuthSubscription(setSession, updateUserWithProfile, fetchProfileData, setLoading);
  
  // Set up auth methods
  const { signIn, signUp, signOut } = useAuthMethods(setLoading, setUser);
  
  // Set up profile management
  const { refreshUser, updateProfile } = useProfileManagement(user, session, setLoading, setUser);
  
  // Calculate derived properties
  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;
  
  // Debug logging for auth state
  useEffect(() => {
    console.log("Auth Provider State:", { 
      isAuthenticated, 
      isAdmin, 
      loading, 
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null
    });
  }, [isAuthenticated, isAdmin, loading, user]);
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAuthenticated,
      isAdmin,
      signIn,
      signUp,
      signOut, 
      updateProfile,
      refreshUser,
      resetPassword: async (email: string) => {
        // Implement password reset functionality or throw error
        throw new Error('Password reset not implemented yet');
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};
