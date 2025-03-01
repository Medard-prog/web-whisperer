
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

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

// Simplified function to fetch project files to avoid type recursion issues
export async function fetchProjectFiles(projectId: string, adminOnly: boolean = false): Promise<ProjectFile[]> {
  try {
    console.log("Fetching project files for project:", projectId);
    
    // Check if the bucket exists
    let { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("Error checking buckets:", bucketError);
      return [];
    }
    
    // If bucket doesn't exist, return empty array
    const bucketExists = buckets.some(bucket => bucket.name === 'project_files');
    if (!bucketExists) {
      console.log("Storage bucket 'project_files' doesn't exist");
      return [];
    }
    
    // List files in project folder
    const { data: files, error: listError } = await supabase.storage
      .from('project_files')
      .list(`projects/${projectId}`);
    
    if (listError) {
      console.error("Error listing files:", listError);
      return [];
    }
    
    // Map files to ProjectFile objects - simplify to avoid deep recursion
    const projectFiles = [];
    
    for (const file of files || []) {
      // Get public URL without using mapProjectFile to avoid recursion
      const { data: urlData } = supabase.storage
        .from('project_files')
        .getPublicUrl(`projects/${projectId}/${file.name}`);
        
      projectFiles.push({
        id: file.id || `file-${Math.random().toString(36).substring(2)}`,
        projectId,
        filename: file.name,
        filePath: urlData.publicUrl,
        fileType: file.metadata?.mimetype || 'application/octet-stream',
        fileSize: file.metadata?.size || 0,
        uploadedAt: file.created_at || new Date().toISOString(),
        isAdminOnly: adminOnly
      });
    }
    
    return projectFiles;
  } catch (error) {
    console.error("Error in fetchProjectFiles:", error);
    return [];
  }
}

// Simplified function to upload project file - simplify to avoid deep recursion
export async function uploadProjectFile(
  projectId: string, 
  file: File, 
  uploadedBy: string, 
  isAdminOnly: boolean = false
): Promise<ProjectFile> {
  try {
    console.log("Uploading file for project:", projectId);
    
    // Check if bucket exists
    let bucketExists = false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      bucketExists = buckets.some(bucket => bucket.name === 'project_files');
    } catch (error) {
      console.error("Error checking if bucket exists:", error);
    }
    
    // Create bucket if needed
    if (!bucketExists) {
      try {
        await supabase.storage.createBucket('project_files', { public: true });
        console.log("Created 'project_files' bucket");
      } catch (error) {
        console.error("Error creating bucket:", error);
        throw error;
      }
    }
    
    // Prepare file path
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `projects/${projectId}/${fileName}`;
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }
    
    // Get public URL - simplify to avoid recursion
    const { data: urlData } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
    
    // Create ProjectFile object directly
    return {
      id: `file-${Math.random().toString(36).substring(2)}`,
      projectId,
      filename: file.name,
      filePath: urlData.publicUrl,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      isAdminOnly
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
