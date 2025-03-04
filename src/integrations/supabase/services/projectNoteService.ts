
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { ProjectNote } from '@/types';

export const fetchProjectNotes = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(note => ({
      id: note.id,
      content: note.content,
      isAdminOnly: note.is_admin_only,
      createdAt: note.created_at,
      projectId: note.project_id,
      createdBy: note.created_by
    })) as ProjectNote[];
  } catch (error: any) {
    toast.error(`Failed to fetch project notes: ${error.message}`);
    return [];
  }
};
