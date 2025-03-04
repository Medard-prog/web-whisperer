
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { User } from '@/types';

export const fetchUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      toast.error(`Failed to fetch user data: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    toast.error(`Failed to fetch user data: ${error.message}`);
    return null;
  }
};

export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast.error(`Failed to fetch users: ${error.message}`);
      return [];
    }

    return data as User[];
  } catch (error: any) {
    toast.error(`Failed to fetch users: ${error.message}`);
    return [];
  }
};

export const fetchSupportMessages = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error(`Failed to fetch support messages: ${error.message}`);
    return [];
  }
};

export const sendSupportMessage = async (userId: string, message: string) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .insert([{ 
        user_id: userId, 
        content: message,
        created_at: new Date().toISOString(),
        is_from_user: true
      }])
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(`Failed to send support message: ${error.message}`);
    return null;
  }
};
