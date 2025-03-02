
import React from 'react';
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
  
  // Set up auth subscription
  useAuthSubscription(setSession, updateUserWithProfile, fetchProfileData);
  
  // Set up auth methods
  const { signIn, signUp, signOut } = useAuthMethods(setLoading, setUser);
  
  // Set up profile management
  const { refreshUser, updateProfile } = useProfileManagement(user, session, setLoading, setUser);
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn,
      signUp,
      signOut, 
      updateProfile,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
