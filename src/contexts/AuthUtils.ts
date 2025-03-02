
import { supabase } from '@/integrations/supabase/client';
import { UserDetails } from './AuthTypes';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

// Helper to fetch user profile data from Supabase
export async function fetchUserProfile(userId: string): Promise<Partial<UserDetails> | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (data) {
      return {
        name: data.name,
        isAdmin: data.is_admin,
        phone: data.phone,
        company: data.company,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

// Helper to create user details from session
export function createUserDetails(session: Session, profileData?: Partial<UserDetails> | null): UserDetails {
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: profileData?.name || session.user.user_metadata?.name || 
          session.user.email?.split('@')[0] || 'User',
    isAdmin: profileData?.isAdmin || session.user.user_metadata?.isAdmin || false,
    phone: profileData?.phone,
    company: profileData?.company,
  };
}

// Handle auth errors with user-friendly messages
export function handleAuthError(error: any, action: string): void {
  console.error(`Error during ${action}:`, error);
  
  let message = 'A apărut o eroare. Încercați din nou.';
  
  if (error.message) {
    if (error.message.includes('Email not confirmed')) {
      message = 'Verificați-vă email-ul pentru a confirma contul.';
    } else if (error.message.includes('Invalid login credentials')) {
      message = 'Email sau parolă incorectă.';
    } else if (error.message.includes('User already registered')) {
      message = 'Acest email este deja înregistrat.';
    }
  }
  
  toast.error(`Eroare la ${action}`, {
    description: message
  });
}
