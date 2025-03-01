
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
  AdminNote,
  PaymentStatus 
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
      additionalInfo: request.business_goal,
      // Add default payment values for consistency
      amountPaid: 0,
      paymentStatus: 'pending' as PaymentStatus
    }));
  } catch (error) {
    console.error("Error in fetchProjectRequests:", error);
    throw error;
  }
}

// Updated fetchProjectById to properly check both regular projects and project requests
export async function fetchProjectById(projectId: string): Promise<Project | null> {
  try {
    console.log("Fetching project details for:", projectId);
    
    // Check if this is a project request ID (based on prefix if you're using one)
    const isProjectRequest = projectId.includes('request_');
    
    if (isProjectRequest) {
      // Try project_requests table with the actual ID (removing any prefix)
      const actualId = projectId.replace('request_', '');
      const { data: requestData, error: requestError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', actualId)
        .maybeSingle();
      
      if (requestError) {
        console.error("Error fetching project request:", requestError);
        throw requestError;
      }
      
      if (requestData) {
        return {
          id: `request_${requestData.id}`, // Add prefix to distinguish requests from projects
          title: requestData.project_name,
          description: requestData.description || '',
          status: requestData.status === 'new' ? 'pending' : requestData.status as any,
          createdAt: requestData.created_at,
          price: requestData.price || 0,
          userId: requestData.user_id,
          hasEcommerce: requestData.has_ecommerce || false,
          hasCMS: requestData.has_cms || false,
          hasSEO: requestData.has_seo || false,
          hasMaintenance: requestData.has_maintenance || false,
          websiteType: requestData.project_type,
          pageCount: requestData.page_count,
          designComplexity: requestData.design_complexity,
          additionalInfo: requestData.business_goal,
          amountPaid: 0, // Default for new requests
          paymentStatus: 'pending' as PaymentStatus, // Default status
        };
      }
    } else {
      // Try projects table
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching project:", error);
        throw error;
      }
      
      if (data) {
        return mapProject(data);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchProjectById:", error);
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
  try {
    console.log("Fetching tasks for project:", projectId);
    
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching project tasks:", error);
      throw error;
    }
    
    console.log("Project tasks fetched:", data);
    return (data || []).map(mapProjectTask);
  } catch (error) {
    console.error("Error in fetchProjectTasks:", error);
    return [];
  }
}

export async function addProjectTask(projectId: string, title: string, userId: string): Promise<ProjectTask> {
  try {
    console.log("Adding task for project:", projectId);
    
    const taskData = {
      project_id: projectId,
      title: title,
      is_completed: false,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('project_tasks')
      .insert(taskData)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error adding project task:", error);
      throw error;
    }
    
    return mapProjectTask(data);
  } catch (error) {
    console.error("Error in addProjectTask:", error);
    throw error;
  }
}

// Fix fetchProjectNotes to work with both projects and project requests
export async function fetchProjectNotes(projectId: string): Promise<ProjectNote[]> {
  try {
    console.log("Fetching notes for project:", projectId);
    
    // Check if this is a project request ID (based on prefix if you're using one)
    const isProjectRequest = projectId.includes('request_');
    const actualId = isProjectRequest ? projectId.replace('request_', '') : projectId;
    
    // For regular projects
    if (!isProjectRequest) {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', actualId)
        .eq('is_admin_only', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching project notes:", error);
        throw error;
      }
      
      return (data || []).map(mapProjectNote);
    }
    
    // For project requests, we'll just return an empty array since there's no request_notes table
    console.log("Project request notes are not implemented yet");
    return [];
  } catch (error) {
    console.error("Error in fetchProjectNotes:", error);
    return [];
  }
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
  try {
    console.log("Fetching messages for project:", projectId);
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching project messages:", error);
      throw error;
    }
    
    return (data || []).map(mapMessage);
  } catch (error) {
    console.error("Error in fetchProjectMessages:", error);
    return [];
  }
}

// Send a message for a specific project
export async function sendProjectMessage(projectId: string, content: string, userId: string, isAdmin: boolean, attachmentUrl?: string, attachmentType?: string) {
  try {
    console.log("Sending message for project:", projectId);
    
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
      console.error("Error sending project message:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in sendProjectMessage:", error);
    throw error;
  }
}

// Upload a file to Supabase storage
export async function uploadFile(file: File, folder: string = 'messages'): Promise<string> {
  try {
    // First check if bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'project_files');
    
    if (!bucketExists) {
      console.log('Creating project_files bucket');
      const { data, error } = await supabase.storage.createBucket('project_files', {
        public: true
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
    }
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

// ADMIN FEATURES

// Fetch admin notes for a project
export async function fetchAdminNotes(projectId: string): Promise<AdminNote[]> {
  try {
    console.log("Fetching admin notes for project:", projectId);
    
    // Check if this is a project request ID
    const isProjectRequest = projectId.includes('request_');
    const actualId = isProjectRequest ? projectId.replace('request_', '') : projectId;
    
    // For regular projects
    if (!isProjectRequest) {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', actualId)
        .eq('is_admin_only', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching admin notes:", error);
        throw error;
      }
      
      return (data || []).map(mapAdminNote);
    }
    
    // For project requests, we'll return an empty array for now
    console.log("Admin notes for project requests are not implemented yet");
    return [];
  } catch (error) {
    console.error("Error in fetchAdminNotes:", error);
    return [];
  }
}

// Add an admin note to a project
export async function addAdminNote(projectId: string, content: string, userId: string) {
  try {
    console.log("Adding admin note for project:", projectId);
    
    // Check if this is a project request ID
    const isProjectRequest = projectId.includes('request_');
    const actualId = isProjectRequest ? projectId.replace('request_', '') : projectId;
    
    // Only support regular projects for now
    const { data, error } = await supabase
      .from('project_notes')
      .insert({ 
        project_id: actualId,
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
export async function fetchProjectFiles(projectId: string): Promise<ProjectFile[]> {
  try {
    console.log('Fetching files for project:', projectId);
    
    // First, check if the project_files bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'project_files');
    
    if (!bucketExists) {
      console.error('Storage bucket "project_files" does not exist');
      try {
        console.log('Creating project_files bucket');
        const { error } = await supabase.storage.createBucket('project_files', {
          public: true
        });
        
        if (error) {
          console.error('Error creating bucket:', error);
          return [];
        }
      } catch (err) {
        console.error('Error creating bucket:', err);
        return [];
      }
      
      return [];
    }
    
    // Check if the project folder exists, if not create an empty folder by uploading a dummy file
    try {
      const { data: folderCheck } = await supabase.storage
        .from('project_files')
        .list(`projects/${projectId}`);
      
      if (!folderCheck || folderCheck.length === 0) {
        // Create an empty folder by uploading a placeholder file
        const emptyBlob = new Blob([''], { type: 'text/plain' });
        const placeholderFile = new File([emptyBlob], '.placeholder', { type: 'text/plain' });
        
        await supabase.storage
          .from('project_files')
          .upload(`projects/${projectId}/.placeholder`, placeholderFile);
      }
    } catch (err) {
      console.log('Folder might not exist yet, this is normal for new projects');
    }
    
    // List files in the bucket
    const { data: files, error } = await supabase.storage
      .from('project_files')
      .list(`projects/${projectId}`);
    
    if (error) {
      console.error('Error fetching project files:', error);
      return [];
    }
    
    // Create an array to hold our results
    const result: ProjectFile[] = [];
    
    // Process each file without complex type operations
    for (const file of files || []) {
      // Skip placeholder files
      if (file.name === '.placeholder') continue;
      
      // Get the public URL - Fixed: Access the nested publicUrl property correctly
      const { data: urlData } = supabase.storage
        .from('project_files')
        .getPublicUrl(`projects/${projectId}/${file.name}`);
      
      // Create a simple ProjectFile object
      const projectFile: ProjectFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        projectId,
        filename: file.name,
        filePath: `projects/${projectId}/${file.name}`,
        fileType: file.metadata?.mimetype || '',
        fileSize: file.metadata?.size || 0,
        uploadedBy: '',
        uploadedAt: file.created_at || new Date().toISOString(),
        isAdminOnly: false,
        url: urlData.publicUrl
      };
      
      result.push(projectFile);
    }
    
    return result;
  } catch (error) {
    console.error('Error in fetchProjectFiles:', error);
    return [];
  }
}

// Simplified function to upload project file
export async function uploadProjectFile(
  projectId: string, 
  file: File
): Promise<ProjectFile> {
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'project_files');
    
    if (!bucketExists) {
      try {
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket('project_files', {
          public: true
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
      } catch (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
    }
    
    // Upload file
    const filePath = `projects/${projectId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
    
    // Create a simple ProjectFile object without complex type operations
    const projectFile: ProjectFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      projectId,
      filename: file.name,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: '',
      uploadedAt: new Date().toISOString(),
      isAdminOnly: false,
      url: urlData.publicUrl
    };
    
    return projectFile;
  } catch (error) {
    console.error('Error in uploadProjectFile:', error);
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

// Update project function
export async function updateProject(projectId: string, projectData: Partial<Project>): Promise<void> {
  try {
    console.log("Updating project:", projectId, projectData);
    
    // Check if this is a project request ID
    const isProjectRequest = projectId.includes('request_');
    const actualId = isProjectRequest ? projectId.replace('request_', '') : projectId;
    
    if (!isProjectRequest) {
      // It's a regular project
      const { error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          price: projectData.price,
          has_ecommerce: projectData.hasEcommerce,
          has_cms: projectData.hasCMS,
          has_seo: projectData.hasSEO,
          has_maintenance: projectData.hasMaintenance,
          due_date: projectData.dueDate,
          website_type: projectData.websiteType,
          page_count: projectData.pageCount,
          design_complexity: projectData.designComplexity,
          amount_paid: projectData.amountPaid,
          payment_status: projectData.paymentStatus
        })
        .eq('id', actualId);
      
      if (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    } else {
      // It's a project request
      const { error } = await supabase
        .from('project_requests')
        .update({
          project_name: projectData.title,
          description: projectData.description,
          status: projectData.status === 'pending' ? 'new' : projectData.status,
          price: projectData.price,
          has_ecommerce: projectData.hasEcommerce,
          has_cms: projectData.hasCMS,
          has_seo: projectData.hasSEO,
          has_maintenance: projectData.hasMaintenance,
          project_type: projectData.websiteType,
          page_count: projectData.pageCount,
          design_complexity: projectData.designComplexity,
          business_goal: projectData.additionalInfo
          // Note: payment_status and amount_paid don't exist in project_requests
        })
        .eq('id', actualId);
      
      if (error) {
        console.error("Error updating project request:", error);
        throw error;
      }
    }
    
    console.log("Project updated successfully");
  } catch (error) {
    console.error("Error in updateProject:", error);
    throw error;
  }
}

// Get chart data for admin reports
export async function getProjectStatusChartData(): Promise<any[]> {
  try {
    // For projects, use the stored procedure we created
    const { data: projectsData, error: projectsError } = await supabase
      .rpc('get_project_status_counts');
    
    if (projectsError) {
      console.error("Error fetching project status data:", projectsError);
      throw projectsError;
    }
    
    // Get counts for project requests too
    const { data: requestsData, error: requestsError } = await supabase
      .rpc('get_project_request_status_counts');
    
    if (requestsError) {
      console.error("Error fetching project request status data:", requestsError);
      throw requestsError;
    }
    
    // Combine the data
    const statusCounts: Record<string, number> = {};
    
    // Process projects
    if (projectsData) {
      projectsData.forEach((item: any) => {
        const status = item.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + Number(item.count);
      });
    }
    
    // Process project requests
    if (requestsData) {
      requestsData.forEach((item: any) => {
        const status = item.status === 'new' ? 'pending' : (item.status || 'unknown');
        statusCounts[status] = (statusCounts[status] || 0) + Number(item.count);
      });
    }
    
    // Format data for chart
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error("Error in getProjectStatusChartData:", error);
    return [];
  }
}

export async function getProjectsByPaymentStatus(): Promise<any[]> {
  try {
    // Use the stored procedure we created
    const { data, error } = await supabase
      .rpc('get_payment_status_counts');
    
    if (error) {
      console.error("Error fetching payment status data:", error);
      throw error;
    }
    
    // Format data for chart
    if (data) {
      return data.map((item: any) => ({
        name: item.payment_status || 'unknown',
        value: Number(item.count)
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error in getProjectsByPaymentStatus:", error);
    return [];
  }
}

export async function getTotalRevenueData(period?: string): Promise<any[]> {
  try {
    // Use the stored procedure we created
    const { data, error } = await supabase
      .rpc('get_monthly_revenue');
    
    if (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
    
    // Process data to format for charts
    if (data) {
      return data.map((item: any) => ({
        month: item.month_year,
        total: Number(item.total_revenue || 0),
        collected: Number(item.total_collected || 0)
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error in getTotalRevenueData:", error);
    return [];
  }
}

export async function getPopularFeaturesData(): Promise<any[]> {
  try {
    // Use the stored procedures we created
    const [ecommerceResult, cmsResult, seoResult, maintenanceResult] = await Promise.all([
      supabase.rpc('count_projects_with_ecommerce'),
      supabase.rpc('count_projects_with_cms'),
      supabase.rpc('count_projects_with_seo'),
      supabase.rpc('count_projects_with_maintenance')
    ]);
    
    if (ecommerceResult.error || cmsResult.error || seoResult.error || maintenanceResult.error) {
      console.error("Error fetching features data");
      throw ecommerceResult.error || cmsResult.error || seoResult.error || maintenanceResult.error;
    }
    
    return [
      { name: 'E-commerce', value: Number(ecommerceResult.data || 0) },
      { name: 'CMS', value: Number(cmsResult.data || 0) },
      { name: 'SEO', value: Number(seoResult.data || 0) },
      { name: 'Maintenance', value: Number(maintenanceResult.data || 0) }
    ];
  } catch (error) {
    console.error("Error in getPopularFeaturesData:", error);
    return [];
  }
}

export async function fetchProjectsForReports(): Promise<any[]> {
  try {
    // Get regular projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectsError) {
      console.error("Error fetching projects for reports:", projectsError);
      throw projectsError;
    }
    
    // Get project requests
    const { data: requestsData, error: requestsError } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (requestsError) {
      console.error("Error fetching project requests for reports:", requestsError);
      throw requestsError;
    }
    
    // Format project data
    const projects = (projectsData || []).map(project => ({
      id: project.id,
      title: project.title,
      status: project.status,
      price: project.price,
      created_at: project.created_at,
      has_ecommerce: project.has_ecommerce,
      has_cms: project.has_cms,
      has_seo: project.has_seo,
      has_maintenance: project.has_maintenance,
      payment_status: project.payment_status || 'pending',
      amount_paid: project.amount_paid || 0
    }));
    
    // Format project request data 
    const requests = (requestsData || []).map(request => ({
      id: `request_${request.id}`,
      title: request.project_name,
      status: request.status === 'new' ? 'pending' : request.status,
      price: request.price,
      created_at: request.created_at,
      has_ecommerce: request.has_ecommerce,
      has_cms: request.has_cms,
      has_seo: request.has_seo,
      has_maintenance: request.has_maintenance,
      payment_status: 'pending', // Default for requests
      amount_paid: 0 // Default for requests
    }));
    
    return [...projects, ...requests];
  } catch (error) {
    console.error("Error in fetchProjectsForReports:", error);
    return [];
  }
}
