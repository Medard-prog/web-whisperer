import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ProjectTask, Project, Message } from '@/types';

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

export const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
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

export const updatePaymentStatus = async (projectId: string, status: PaymentStatus) => {
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
export const addProjectTask = async (projectId: string, task: Partial<ProjectTask>) => {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert([{ ...task, project_id: projectId }])
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(`Failed to add task: ${error.message}`);
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

// Define missing types
export enum ProjectStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid'
}
