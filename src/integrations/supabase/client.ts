// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { 
  mapProject, 
  mapProjectNote, 
  mapProjectTask, 
  mapUser, 
  mapMessage, 
  mapProjectFile, 
  mapAdminNote,
  Project, 
  ProjectNote, 
  ProjectTask, 
  User, 
  Message, 
  ProjectFile, 
  AdminNote 
} from '@/types';

const SUPABASE_URL = "https://kadoutdcicucjyqvjihn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG91dGRjaWN1Y2p5cXZqaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTk4MzYsImV4cCI6MjA1NjMzNTgzNn0.275ggz_qZkQo4MvW2Rm75JbYixKje8vaWfZ_6RfNXr0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) as any;

// Helper functions to get properly typed data
export async function fetchProjects(userId?: string): Promise<Project[]> {
  try {
    console.log("Fetching projects for user:", userId);
    
    // First check if connection is working
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error("Error testing connection:", testError);
      throw testError;
    }
    
    // Now fetch the actual projects
    const query = supabase.from('projects').select('*');
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    console.log("Projects fetched:", data);
    return (data || []).map(mapProject);
  } catch (error) {
    console.error("Error in fetchProjects:", error);
    throw error;
  }
}

// New function to fetch project requests for a user
export async function fetchProjectRequests(userId?: string): Promise<Project[]> {
  try {
    console.log("Fetching project requests for user:", userId);
    
    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('project_requests')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error("Error testing connection to project_requests:", testError);
      throw testError;
    }
    
    // Fetch project requests
    const query = supabase.from('project_requests').select('*');
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching project requests:", error);
      throw error;
    }
    
    console.log("Project requests fetched:", data);
    
    // Map project requests to Project type for display
    return (data || []).map(request => ({
      id: request.id,
      title: request.project_name,
      description: request.description || '',
      status: request.status === 'new' ? 'pending' : request.status as any,
      createdAt: request.created_at,
      price: request.price || 0,
      userId: request.user_id,
      hasEcommerce: request.has_ecommerce || false,
      hasCMS: request.has_cms || false,
      hasSEO: request.has_seo || false,
      hasMaintenance: request.has_maintenance || false,
      websiteType: request.project_type,
      pageCount: request.page_count,
      designComplexity: request.design_complexity,
      additionalInfo: request.business_goal
    }));
  } catch (error) {
    console.error("Error in fetchProjectRequests:", error);
    throw error;
  }
}

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return (data || []).map(mapUser);
}

export async function fetchProjectTasks(projectId: string): Promise<ProjectTask[]> {
  const { data, error } = await supabase
    .from('project_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return (data || []).map(mapProjectTask);
}

export async function fetchProjectNotes(projectId: string): Promise<ProjectNote[]> {
  const { data, error } = await supabase
    .from('project_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return (data || []).map(mapProjectNote);
}

// Helper function to submit a project request
export async function submitProjectRequest(requestData: any) {
  const { data, error } = await supabase
    .from('project_requests')
    .insert(requestData);
    
  if (error) {
    throw error;
  }
  
  return data;
}

// Fetch messages for a specific project
export async function fetchProjectMessages(projectId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  return (data || []).map(mapMessage);
}

// Send a message for a specific project
export async function sendProjectMessage(projectId: string, content: string, userId: string, isAdmin: boolean, attachmentUrl?: string, attachmentType?: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      project_id: projectId,
      content,
      user_id: userId,
      is_admin: isAdmin,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType
    });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Upload a file to Supabase storage
export async function uploadFile(file: File, folder: string = 'messages'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('project_files')
    .upload(filePath, file);
  
  if (error) {
    throw error;
  }
  
  const { data: urlData } = supabase.storage
    .from('project_files')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
}

// ADMIN FEATURES

// Fetch admin notes for a project
export async function fetchAdminNotes(projectId: string): Promise<AdminNote[]> {
  try {
    // Use direct query to project_notes table with admin-only filter
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_admin_only', true)  // Admin-only notes
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching admin notes:", error);
      throw error;
    }
    
    return (data || []).map(mapAdminNote);
  } catch (error) {
    console.error("Error in fetchAdminNotes:", error);
    return []; // Return empty array as fallback
  }
}

// Add an admin note to a project
export async function addAdminNote(projectId: string, content: string, userId: string) {
  try {
    // Insert directly into project_notes table with admin flag
    const { data, error } = await supabase
      .from('project_notes')
      .insert({ 
        project_id: projectId,
        content: content,
        created_by: userId,
        is_admin_only: true
      });
    
    if (error) {
      console.error("Error adding admin note:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in addAdminNote:", error);
    throw error;
  }
}

// Fetch project files - simplified to avoid type recursion issues
export async function fetchProjectFiles(projectId: string, adminOnly: boolean = false): Promise<ProjectFile[]> {
  try {
    console.log("Fetching project files for project:", projectId, "adminOnly:", adminOnly);
    
    // Check if the project_files bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage
      .listBuckets();
    
    if (bucketError) {
      console.error("Error checking buckets:", bucketError);
      return [];
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'project_files');
    if (!bucketExists) {
      console.log("Storage bucket 'project_files' doesn't exist, returning empty array");
      return [];
    }
    
    // List files in the bucket path for this project
    const { data: filesData, error: listError } = await supabase.storage
      .from('project_files')
      .list(`projects/${projectId}`);
    
    if (listError) {
      console.error("Error listing files:", listError);
      return [];
    }
    
    // Map the files to ProjectFile objects
    return (filesData || []).map(file => {
      const publicUrl = supabase.storage
        .from('project_files')
        .getPublicUrl(`projects/${projectId}/${file.name}`).data.publicUrl;
        
      return {
        id: file.id || Math.random().toString(36).substring(2, 15),
        projectId: projectId,
        filename: file.name,
        filePath: publicUrl,
        fileType: file.metadata?.mimetype || '',
        fileSize: file.metadata?.size || 0,
        uploadedAt: file.created_at || new Date().toISOString(),
        isAdminOnly: adminOnly
      };
    });
  } catch (error) {
    console.error("Error in fetchProjectFiles:", error);
    return []; // Return empty array as fallback
  }
}

// Upload a project file - simplified to avoid type recursion issues
export async function uploadProjectFile(
  projectId: string, 
  file: File, 
  uploadedBy: string, 
  isAdminOnly: boolean = false
): Promise<ProjectFile> {
  try {
    console.log("Uploading file for project:", projectId);
    
    // First check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      throw bucketsError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'project_files');
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      console.log("Bucket 'project_files' doesn't exist yet, creating it");
      const { error: createError } = await supabase.storage
        .createBucket('project_files', { public: true });
        
      if (createError) {
        console.error("Failed to create storage bucket:", createError);
        throw createError;
      }
    }
    
    // Prepare file path and upload
    const fileExt = file.name.split('.').pop();
    const filePath = `projects/${projectId}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Error uploading file to storage:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
      
    console.log("File uploaded to:", urlData.publicUrl);
    
    // Return a ProjectFile object directly
    return {
      id: Math.random().toString(36).substring(2, 15),
      projectId: projectId,
      filename: file.name,
      filePath: urlData.publicUrl,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: uploadedBy,
      uploadedAt: new Date().toISOString(),
      isAdminOnly: isAdminOnly
    };
  } catch (error) {
    console.error("Error in uploadProjectFile:", error);
    throw error;
  }
}

// Support messages (general messages not tied to a project)
export async function fetchSupportMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .is('project_id', null)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  return (data || []).map(mapMessage);
}

// Send a support message
export async function sendSupportMessage(content: string, userId: string, isAdmin: boolean, attachmentUrl?: string, attachmentType?: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      content,
      user_id: userId,
      is_admin: isAdmin,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType
    });
  
  if (error) {
    throw error;
  }
  
  return data;
}
