import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ProjectTask, Project, Message, User, ProjectNote, ProjectFile, mapProjectFile, mapProject } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kadoutdcicucjyqvjihn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG91dGRjaWN1Y2p5cXZqaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTk4MzYsImV4cCI6MjA1NjMzNTgzNn0.275ggz_qZkQo4MvW2Rm75JbYixKje8vaWfZ_6RfNXr0';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export const fetchProjectRequests = async (userId?: string) => {
  try {
    let query = supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching project requests:", error);
      toast.error(`Failed to fetch project requests: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error: any) {
    toast.error(`Failed to fetch project requests: ${error.message}`);
    return [];
  }
};

export const fetchProjects = async (userId?: string) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Failed to fetch projects: ${error.message}`);
      return [];
    }

    return data as Project[];
  } catch (error: any) {
    toast.error(`Failed to fetch projects: ${error.message}`);
    return [];
  }
};

export const fetchProjectById = async (projectId: string) => {
  try {
    // First try to find the project in the projects table
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError && projectError.code === 'PGRST116') {
      console.log("Project not found in projects table, checking project_requests...");
      
      // If not found in projects table, try the project_requests table
      const { data: requestData, error: requestError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (requestError) {
        console.error("Error fetching project from both tables:", requestError);
        return null;
      }
      
      if (requestData) {
        // Map project_requests data to Project type
        return {
          id: requestData.id,
          title: requestData.project_name,
          description: requestData.description || '',
          status: requestData.status || 'new',
          createdAt: requestData.created_at,
          price: requestData.price || 0,
          userId: requestData.user_id,
          hasEcommerce: requestData.has_ecommerce,
          hasCMS: requestData.has_cms,
          hasSEO: requestData.has_seo,
          hasMaintenance: requestData.has_maintenance,
          // Website details
          websiteType: requestData.project_type,
          pageCount: requestData.page_count,
          designComplexity: requestData.design_complexity,
          exampleUrls: requestData.example_urls,
          additionalInfo: requestData.additional_info,
        } as Project;
      }
      return null;
    }

    if (projectError) {
      console.error("Error fetching project by ID:", projectError);
      return null;
    }

    return projectData;
  } catch (error: any) {
    console.error("Exception in fetchProjectById:", error);
    return null;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>) => {
  try {
    console.log('Updating project with ID:', id, 'Data:', projectData);
    
    // First check if this is a project_request or a regular project
    const { data: projectRequest, error: prError } = await supabase
      .from('project_requests')
      .select('id')
      .eq('id', id)
      .single();
    
    if (prError && prError.code !== 'PGRST116') {
      console.error('Error checking project request:', prError);
      throw prError;
    }
    
    let result;
    
    if (projectRequest) {
      // It's a project request
      console.log('Updating project_requests table');
      const { data, error } = await supabase
        .from('project_requests')
        .update({
          project_name: projectData.title,
          description: projectData.description,
          price: projectData.price,
          status: projectData.status,
          project_type: projectData.websiteType,
          page_count: projectData.pageCount,
          has_ecommerce: projectData.hasEcommerce,
          has_cms: projectData.hasCms,
          has_seo: projectData.hasSeo,
          has_maintenance: projectData.hasMaintenance,
          design_complexity: projectData.designComplexity
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      
      // Format the response to match Project structure
      return {
        id: result.id,
        title: result.project_name,
        description: result.description || '',
        status: result.status || 'pending',
        createdAt: result.created_at,
        userId: result.user_id,
        price: result.price || 0,
        websiteType: result.project_type,
        pageCount: result.page_count,
        hasEcommerce: result.has_ecommerce,
        hasCms: result.has_cms, 
        hasSeo: result.has_seo,
        hasMaintenance: result.has_maintenance,
        designComplexity: result.design_complexity,
        isRequest: true
      };
    } else {
      // It's a regular project
      console.log('Updating projects table');
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          price: projectData.price,
          status: projectData.status,
          website_type: projectData.websiteType,
          page_count: projectData.pageCount,
          has_ecommerce: projectData.hasEcommerce,
          has_cms: projectData.hasCms,
          has_seo: projectData.hasSeo,
          has_maintenance: projectData.hasMaintenance,
          design_complexity: projectData.designComplexity,
          payment_status: projectData.paymentStatus,
          amount_paid: projectData.amountPaid,
          due_date: projectData.dueDate
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      
      return {
        id: result.id,
        title: result.title,
        description: result.description,
        status: result.status,
        createdAt: result.created_at,
        userId: result.user_id,
        price: result.price,
        websiteType: result.website_type,
        pageCount: result.page_count,
        hasEcommerce: result.has_ecommerce,
        hasCms: result.has_cms,
        hasSeo: result.has_seo,
        hasMaintenance: result.has_maintenance,
        designComplexity: result.design_complexity,
        paymentStatus: result.payment_status,
        amountPaid: result.amount_paid,
        dueDate: result.due_date
      };
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const updateProjectStatus = async (projectId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ status: status })
      .eq('id', projectId)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating project status:", error);
      toast.error(`Failed to update project status: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    toast.error(`Failed to update project status: ${error.message}`);
    return null;
  }
};

export const updatePaymentStatus = async (projectId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ payment_status: status })
      .eq('id', projectId)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating payment status:", error);
      toast.error(`Failed to update payment status: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    toast.error(`Failed to update payment status: ${error.message}`);
    return null;
  }
};

export const fetchProjectMessages = async (projectId: string) => {
  try {
    // Use our custom SQL function to fetch messages
    const { data, error } = await supabase.rpc('fetch_messages', { 
      p_project_id: projectId 
    });

    if (error) {
      console.error("Error fetching project messages:", error);
      toast.error(`Failed to fetch project messages: ${error.message}`);
      return [];
    }

    console.log("Messages fetched:", data);
    
    // Map the data to our Message type
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

    // Format the message according to our Message type
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

export const fetchProjectTasks = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      isCompleted: task.is_completed,
      dueDate: task.due_date,
      createdAt: task.created_at,
      projectId: task.project_id,
      createdBy: task.created_by
    })) as ProjectTask[];
  } catch (error: any) {
    toast.error(`Failed to fetch project tasks: ${error.message}`);
    return [];
  }
};

export const addProjectTask = async (projectId: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert([{ 
        project_id: projectId, 
        title: title,
        is_completed: false
      }])
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      isCompleted: data.is_completed,
      dueDate: data.due_date,
      createdAt: data.created_at,
      projectId: data.project_id,
      createdBy: data.created_by
    } as ProjectTask;
  } catch (error: any) {
    toast.error(`Failed to add task: ${error.message}`);
    return null;
  }
};

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

export const fetchProjectFiles = async (projectId: string) => {
  try {
    // For now, return an empty array
    // In real implementation, this would fetch files from storage
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
    
    // Create a properly formatted ProjectFile object
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

export const getProjectStatusChartData = async (dateRange?: { from?: Date, to?: Date }) => {
  try {
    // Mock data for development
    return [
      { name: 'New', value: 10 },
      { name: 'In Progress', value: 5 },
      { name: 'Completed', value: 8 }
    ];
  } catch (error: any) {
    toast.error(`Failed to fetch chart data: ${error.message}`);
    return [];
  }
};

export const getProjectsByPaymentStatus = async (dateRange?: { from?: Date, to?: Date }) => {
  try {
    // Mock data for development
    return [
      { name: 'Paid', value: 12 },
      { name: 'Partial', value: 3 },
      { name: 'Unpaid', value: 4 }
    ];
  } catch (error: any) {
    toast.error(`Failed to fetch payment data: ${error.message}`);
    return [];
  }
};

export const getTotalRevenueData = async (dateRange?: { from?: Date, to?: Date }) => {
  try {
    // Mock data for development
    return [
      { month: 'Jan', revenue: 2300 },
      { month: 'Feb', revenue: 3200 },
      { month: 'Mar', revenue: 4100 },
      { month: 'Apr', revenue: 4800 },
      { month: 'May', revenue: 5500 },
      { month: 'Jun', revenue: 4900 }
    ];
  } catch (error: any) {
    toast.error(`Failed to fetch revenue data: ${error.message}`);
    return [];
  }
};

export const getPopularFeaturesData = async () => {
  try {
    // Mock data for development
    return [
      { name: 'E-commerce', value: 15 },
      { name: 'CMS', value: 22 },
      { name: 'SEO', value: 18 },
      { name: 'Maintenance', value: 10 }
    ];
  } catch (error: any) {
    toast.error(`Failed to fetch features data: ${error.message}`);
    return [];
  }
};

export const fetchProjectsForReports = async (dateRange?: { from?: Date, to?: Date }) => {
  try {
    // Mock implementation for reports
    const { data, error } = await supabase
      .from('project_requests')
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error(`Failed to fetch projects for reports: ${error.message}`);
    return [];
  }
};

export const fetchSupportMessages = async (userId: string) => {
  try {
    // Mock implementation
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
