
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { ProjectFile } from '@/types';

export const fetchProjectFiles = async (projectId: string) => {
  try {
    return [] as ProjectFile[];
  } catch (error: any) {
    toast.error(`Failed to fetch project files: ${error.message}`);
    return [];
  }
};

export const uploadFile = async (file: File, projectId: string, userId: string) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `projects/${projectId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
      
    const publicUrl = urlData.publicUrl;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      projectId: projectId,
      filename: file.name,
      filePath: filePath,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      isAdminOnly: false,
      url: publicUrl
    } as ProjectFile;
  } catch (error: any) {
    toast.error(`Failed to upload file: ${error.message}`);
    return null;
  }
};
