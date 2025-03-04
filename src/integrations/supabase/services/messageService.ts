
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { Message } from '@/types';

export const fetchProjectMessages = async (projectId: string) => {
  try {
    const { data, error } = await supabase.rpc('fetch_messages', { 
      p_project_id: projectId 
    });

    if (error) {
      console.error("Error fetching project messages:", error);
      toast.error(`Failed to fetch project messages: ${error.message}`);
      return [];
    }

    console.log("Messages fetched:", data);
    
    return (data || []).map(msg => ({
      id: msg.id,
      projectId: msg.project_id,
      content: msg.content,
      createdAt: msg.created_at,
      isAdmin: msg.is_admin,
      userId: msg.user_id,
      attachmentUrl: msg.attachment_url,
      attachmentType: msg.attachment_type
    } as Message));
  } catch (error: any) {
    console.error("Error in fetchProjectMessages:", error);
    toast.error(`Failed to fetch project messages: ${error.message}`);
    return [];
  }
};

export const sendProjectMessage = async (
  projectId: string,
  content: string,
  userId: string,
  isAdmin: boolean = false,
  attachmentUrl: string = '',
  attachmentType: string = ''
) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        project_id: projectId,
        user_id: userId,
        content: content,
        is_admin: isAdmin,
        attachment_url: attachmentUrl,
        attachment_type: attachmentType
      }])
      .select('*')
      .single();

    if (error) {
      console.error("Error sending project message:", error);
      toast.error(`Failed to send project message: ${error.message}`);
      return null;
    }

    return {
      id: data.id,
      projectId: data.project_id,
      content: data.content,
      createdAt: data.created_at,
      isAdmin: data.is_admin,
      userId: data.user_id,
      attachmentUrl: data.attachment_url,
      attachmentType: data.attachment_type
    } as Message;
  } catch (error: any) {
    toast.error(`Failed to send project message: ${error.message}`);
    return null;
  }
};
