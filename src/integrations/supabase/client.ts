
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ProjectTask, Project, Message, User, ProjectNote, ProjectFile } from '@/types';

// Provide fallback values for development if environment variables are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://development-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'some-placeholder-key-for-dev-mode';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export all required functions that are used in the codebase
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

export const fetchProjectRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error("Error fetching project by ID:", error);
      toast.error(`Failed to fetch project: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    toast.error(`Failed to fetch project: ${error.message}`);
    return null;
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
    const { data, error } = await supabase
      .from('project_messages')
      .select('*, user:profiles(id, email, profile_data)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching project messages:", error);
      toast.error(`Failed to fetch project messages: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error: any) {
    toast.error(`Failed to fetch project messages: ${error.message}`);
    return [];
  }
};

export const sendProjectMessage = async (projectId: string, userId: string, message: string) => {
  try {
    const { data, error } = await supabase
      .from('project_messages')
      .insert([{
        project_id: projectId,
        user_id: userId,
        content: message
      }])
      .select('*, user:profiles(id, email, profile_data)')
      .single();

    if (error) {
      console.error("Error sending project message:", error);
      toast.error(`Failed to send project message: ${error.message}`);
      return null;
    }

    return data;
  } catch (error: any) {
    toast.error(`Failed to send project message: ${error.message}`);
    return null;
  }
};

// Add missing functions referenced in the codebase
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

export const uploadFile = async (projectId: string, file: File, userId: string) => {
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
    
    // Mock return - in a real implementation this would insert into a files table
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      url: publicUrl,
      size: file.size,
      type: file.type,
      projectId,
      uploadedBy: userId,
      createdAt: new Date().toISOString()
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
