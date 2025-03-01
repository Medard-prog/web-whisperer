
import { createClient } from '@supabase/supabase-js';
import { 
  Project, 
  ProjectTask, 
  ProjectNote, 
  ProjectFile, 
  User, 
  Message,
  mapProject,
  mapProjectTask,
  mapProjectNote,
  mapUser,
  mapMessage,
  mapProjectFile,
  ProjectStatus,
  PaymentStatus
} from '@/types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true
  }
});

// Enable PostgreSQL replication functionality
export async function enableRealtimePostgres() {
  await supabase
    .from('messages')
    .select('id')
    .limit(1);
}

// Projects functions
export async function fetchProjects(userId?: string) {
  try {
    console.log("Fetching projects", userId ? `for user: ${userId}` : 'for all users');
    
    let query = supabase
      .from('projects')
      .select('*');
      
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    console.log("Projects fetched:", data);
    return data.map(mapProject);
  } catch (error) {
    console.error("Error in fetchProjects:", error);
    return [];
  }
}

export async function fetchProjectRequests(userId?: string) {
  try {
    console.log("Fetching project requests", userId ? `for user: ${userId}` : 'for all users');
    
    let query = supabase
      .from('project_requests')
      .select('*');
      
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching project requests:", error);
      throw error;
    }
    
    console.log("Project requests fetched:", data);
    
    // Map project_request fields to Project type with correct PaymentStatus type
    return data.map(item => ({
      id: item.id,
      title: item.project_name,
      description: item.description,
      status: item.status as ProjectStatus,
      createdAt: item.created_at,
      price: item.price || 0,
      userId: item.user_id,
      hasEcommerce: item.has_ecommerce,
      hasCMS: item.has_cms,
      hasSEO: item.has_seo,
      hasMaintenance: item.has_maintenance,
      websiteType: item.project_type,
      pageCount: item.page_count,
      designComplexity: item.design_complexity,
      additionalInfo: item.business_goal,
      amountPaid: 0,
      paymentStatus: 'pending' as PaymentStatus 
    }));
  } catch (error) {
    console.error("Error in fetchProjectRequests:", error);
    return [];
  }
}

// Also fix the fetchProjectById for the same reason
export async function fetchProjectById(id: string): Promise<Project> {
  console.log("Fetching project details for:", id);
  
  try {
    // First check the projects table
    let { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.log("Project not found in projects table, checking project_requests");
      // If not found in projects, check project_requests
      const { data: requestData, error: requestError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', id)
        .single();
        
      if (requestError) {
        console.error("Project not found in project_requests either:", requestError);
        throw new Error('Project not found');
      }
      
      console.log("Project found in project_requests:", requestData);
      
      // Map project_request fields to Project type with correct PaymentStatus type
      return {
        id: requestData.id,
        title: requestData.project_name,
        description: requestData.description,
        status: requestData.status as ProjectStatus,
        createdAt: requestData.created_at,
        price: requestData.price || 0,
        userId: requestData.user_id,
        hasEcommerce: requestData.has_ecommerce,
        hasCMS: requestData.has_cms,
        hasSEO: requestData.has_seo,
        hasMaintenance: requestData.has_maintenance,
        websiteType: requestData.project_type,
        pageCount: requestData.page_count,
        designComplexity: requestData.design_complexity,
        additionalInfo: requestData.business_goal,
        amountPaid: 0,
        paymentStatus: 'pending' as PaymentStatus
      };
    }
    
    console.log("Project data loaded successfully:", data);
    return mapProject(data);
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

// Project Tasks functions
export async function fetchProjectTasks(projectId: string): Promise<ProjectTask[]> {
  console.log("Fetching tasks for project:", projectId);
  
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    console.log("Project tasks fetched:", data);
    return data.map(mapProjectTask);
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return [];
  }
}

export async function createProjectTask(task: Partial<ProjectTask>): Promise<ProjectTask> {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert(task)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapProjectTask(data);
  } catch (error) {
    console.error("Error creating project task:", error);
    throw error;
  }
}

export async function addProjectTask(
  projectId: string, 
  title: string, 
  userId: string
): Promise<ProjectTask> {
  console.log("Adding task for project:", projectId);
  
  try {
    const taskData = {
      project_id: projectId,
      title,
      created_by: userId,
      is_completed: false
    };
    
    const { data, error } = await supabase
      .from('project_tasks')
      .insert(taskData)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapProjectTask(data);
  } catch (error) {
    console.error("Error adding project task:", error);
    throw error;
  }
}

export async function updateProjectTask(taskId: string, updates: Partial<ProjectTask>): Promise<void> {
  try {
    const { error } = await supabase
      .from('project_tasks')
      .update(updates)
      .eq('id', taskId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error updating project task:", error);
    throw error;
  }
}

export async function deleteProjectTask(taskId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting project task:", error);
    throw error;
  }
}

// Project Notes functions
export async function fetchProjectNotes(projectId: string): Promise<ProjectNote[]> {
  console.log("Fetching notes for project:", projectId);
  
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(mapProjectNote);
  } catch (error) {
    console.error("Error fetching project notes:", error);
    return [];
  }
}

// Users functions
export async function fetchUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(mapUser);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function fetchUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return mapUser(data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Messages functions
export async function fetchProjectMessages(projectId: string): Promise<Message[]> {
  console.log("Fetching messages for project:", projectId);
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    console.log("Messages fetched:", data);
    return data.map(mapMessage);
  } catch (error) {
    console.error("Error fetching project messages:", error);
    return [];
  }
}

export async function sendProjectMessage(
  projectId: string,
  content: string,
  userId: string,
  isAdmin: boolean,
  attachmentUrl?: string,
  attachmentType?: string
): Promise<Message | null> {
  console.log("Sending message for project:", projectId);
  
  try {
    const messageData = {
      project_id: projectId,
      content,
      user_id: userId,
      is_admin: isAdmin,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType
    };
    
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapMessage(data);
  } catch (error) {
    console.error("Error sending project message:", error);
    throw error;
  }
}

// Support messages functions
export async function fetchSupportMessages(userId: string): Promise<Message[]> {
  console.log("Fetching support messages for user:", userId);
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .is('project_id', null)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    console.log("Support messages fetched:", data);
    return data.map(mapMessage);
  } catch (error) {
    console.error("Error fetching support messages:", error);
    return [];
  }
}

export async function sendSupportMessage(
  content: string,
  userId: string,
  isAdmin: boolean,
  attachmentUrl?: string,
  attachmentType?: string
): Promise<Message | null> {
  console.log("Sending support message for user:", userId);
  
  try {
    const messageData = {
      content,
      user_id: userId,
      is_admin: isAdmin,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType
    };
    
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapMessage(data);
  } catch (error) {
    console.error("Error sending support message:", error);
    throw error;
  }
}

// Files functions
export async function fetchProjectFiles(projectId: string): Promise<ProjectFile[]> {
  console.log("Fetching files for project:", projectId);
  
  try {
    // Check if bucket exists and create it if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'project_files');
    
    if (!bucketExists) {
      console.log("Creating project_files bucket");
      try {
        await supabase.storage.createBucket('project_files', {
          public: false
        });
      } catch (bucketError) {
        console.error("Error creating bucket:", bucketError);
      }
    }
    
    // Query the database for file metadata
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    
    // Get signed URLs for each file
    const filesWithUrls = await Promise.all(data.map(async (file) => {
      try {
        const { data: urlData } = await supabase.storage
          .from('project_files')
          .createSignedUrl(file.file_path, 3600);
          
        return {
          ...file,
          url: urlData?.signedUrl || null
        };
      } catch (urlError) {
        console.error("Error getting signed URL:", urlError);
        return file;
      }
    }));
    
    return filesWithUrls.map(mapProjectFile);
  } catch (error) {
    console.error("Error fetching project files:", error);
    return [];
  }
}

export async function uploadFile(file: File): Promise<string> {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    // Check if bucket exists and create it if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'project_files');
    
    if (!bucketExists) {
      try {
        await supabase.storage.createBucket('project_files', {
          public: false
        });
      } catch (bucketError) {
        console.error("Error creating bucket:", bucketError);
      }
    }
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get a signed URL for the file
    const { data: urlData, error: urlError } = await supabase.storage
      .from('project_files')
      .createSignedUrl(filePath, 3600);
      
    if (urlError) throw urlError;
    
    return urlData.signedUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Add routing to App.tsx for chat pages
export async function setupChatRoutes() {
  console.log("Setting up chat routes");
  return true;
}

export async function enableRealtimeForTable(tableName: string) {
  try {
    await supabase.rpc('enable_realtime', { table_name: tableName });
    return true;
  } catch (error) {
    console.error(`Error enabling realtime for ${tableName}:`, error);
    return false;
  }
}

// Enable realtime for messages table
enableRealtimeForTable('messages').then(result => {
  console.log("Realtime enabled for messages:", result);
});

// Report related functions
export async function getProjectStatusChartData() {
  try {
    const { data, error } = await supabase.rpc('get_project_status_counts');
    
    if (error) throw error;
    
    const requestStatusData = await supabase.rpc('get_project_request_status_counts');
    
    // Combine and format data for chart
    const formattedData = [...(data || []), ...(requestStatusData.data || [])]
      .reduce((acc: any[], item) => {
        const existingItem = acc.find(i => i.name === item.status);
        if (existingItem) {
          existingItem.value += Number(item.count);
        } else {
          acc.push({ name: item.status, value: Number(item.count) });
        }
        return acc;
      }, []);
    
    return formattedData;
  } catch (error) {
    console.error("Error getting project status data:", error);
    return [];
  }
}

export async function getProjectsByPaymentStatus() {
  try {
    const { data, error } = await supabase.rpc('get_payment_status_counts');
    
    if (error) throw error;
    
    // Format data for chart
    return (data || []).map(item => ({
      name: item.payment_status,
      value: Number(item.count)
    }));
  } catch (error) {
    console.error("Error getting payment status data:", error);
    return [];
  }
}

export async function getTotalRevenueData() {
  try {
    const { data, error } = await supabase.rpc('get_monthly_revenue');
    
    if (error) throw error;
    
    // Format data for chart
    return (data || []).map(item => ({
      name: item.month_year,
      total: Number(item.total_revenue),
      collected: Number(item.total_collected)
    }));
  } catch (error) {
    console.error("Error getting revenue data:", error);
    return [];
  }
}

export async function getPopularFeaturesData() {
  try {
    const [ecommerce, cms, seo, maintenance] = await Promise.all([
      supabase.rpc('count_projects_with_ecommerce'),
      supabase.rpc('count_projects_with_cms'),
      supabase.rpc('count_projects_with_seo'),
      supabase.rpc('count_projects_with_maintenance')
    ]);
    
    if (ecommerce.error || cms.error || seo.error || maintenance.error) {
      throw new Error("Error fetching feature counts");
    }
    
    return [
      { name: 'E-commerce', value: Number(ecommerce.data) },
      { name: 'CMS', value: Number(cms.data) },
      { name: 'SEO', value: Number(seo.data) },
      { name: 'Maintenance', value: Number(maintenance.data) }
    ];
  } catch (error) {
    console.error("Error getting popular features data:", error);
    return [];
  }
}

export async function fetchProjectsForReports(dateRange: { from?: Date; to?: Date }) {
  try {
    let query = supabase
      .from('projects')
      .select('*');
    
    if (dateRange.from) {
      query = query.gte('created_at', dateRange.from.toISOString());
    }
    
    if (dateRange.to) {
      query = query.lte('created_at', dateRange.to.toISOString());
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(mapProject);
  } catch (error) {
    console.error("Error fetching projects for reports:", error);
    return [];
  }
}
