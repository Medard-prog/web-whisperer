
import { useContext } from 'react';
import AuthContext from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Make the error more informative and add a fallback
  if (context === undefined) {
    // In development, show a helpful error message
    if (process.env.NODE_ENV !== 'production') {
      console.error('useAuth must be used within an AuthProvider');
    }
    
    // Return a minimal fallback context that won't break the app
    // but indicates authentication is not available
    return {
      user: null,
      session: null,
      loading: false,  // Changed from isLoading to loading to match AuthContextType
      isAuthenticated: false,
      isAdmin: false,
      signIn: () => Promise.reject(new Error('Auth provider not available')),
      signUp: () => Promise.reject(new Error('Auth provider not available')),
      signOut: () => Promise.reject(new Error('Auth provider not available')),
      updateProfile: () => Promise.reject(new Error('Auth provider not available')),
      resetPassword: () => Promise.reject(new Error('Auth provider not available')),
      refreshUser: () => Promise.reject(new Error('Auth provider not available')),
    };
  }
  
  return context;
};
