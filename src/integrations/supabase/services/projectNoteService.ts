
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { ProjectNote } from '@/types';
import { mapProjectNote } from '@/types/mappers';

export const fetchProjectNotes = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(note => mapProjectNote(note));
  } catch (error: any) {
    toast.error(`Failed to fetch project notes: ${error.message}`);
    return [];
  }
};

export const addProjectNote = async (
  projectId: string, 
  content: string, 
  isAdminOnly: boolean, 
  userId: string,
  file?: File
) => {
  try {
    let fileUrl = null;
    let filePath = null;
    
    // Upload file if provided
    if (file) {
      const fileName = `${Date.now()}_${file.name.replace(/[^\x00-\x7F]/g, '')}`;
      filePath = `notes/${projectId}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('project_files')
        .getPublicUrl(filePath);
        
      fileUrl = urlData.publicUrl;
    }
    
    // Insert note with file info if available
    const { data, error } = await supabase
      .from('project_notes')
      .insert({
        project_id: projectId,
        content: content,
        is_admin_only: true, // Always private, only admins can see
        created_by: userId,
        file_url: fileUrl,
        file_path: filePath,
        file_name: file ? file.name : null
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return mapProjectNote(data);
  } catch (error: any) {
    console.error('Error adding project note:', error);
    toast.error(`Failed to add note: ${error.message}`);
    return null;
  }
};

export const deleteProjectNote = async (noteId: string) => {
  try {
    const { error } = await supabase
      .from('project_notes')
      .delete()
      .eq('id', noteId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete note: ${error.message}`);
    return false;
  }
};
