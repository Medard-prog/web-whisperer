
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { Project, mapProject } from '@/types';

export const fetchProjectRequests = async (userId?: string) => {
  try {
    console.log("Fetching project requests, userId:", userId);
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('type', 'request')
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
    
    console.log("Project requests fetched:", data);
    return data.map(mapProject) || [];
  } catch (error: any) {
    console.error("Error in fetchProjectRequests:", error);
    toast.error(`Failed to fetch project requests: ${error.message}`);
    return [];
  }
};

export const fetchProjects = async (userId?: string) => {
  try {
    console.log("Fetching projects, userId:", userId);
    
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

    console.log("Projects fetched:", data);
    return data.map(mapProject) as Project[];
  } catch (error: any) {
    console.error("Error in fetchProjects:", error);
    toast.error(`Failed to fetch projects: ${error.message}`);
    return [];
  }
};

export const fetchProjectById = async (projectId: string) => {
  try {
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error("Error fetching project by ID:", projectError);
      return null;
    }

    return mapProject(projectData);
  } catch (error: any) {
    console.error("Exception in fetchProjectById:", error);
    return null;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>) => {
  try {
    console.log('Updating project with ID:', id, 'Data:', projectData);
    
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
        has_cms: projectData.hasCMS,
        has_seo: projectData.hasSEO,
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
    
    return mapProject(data);
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

    return mapProject(data);
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

export const fetchProjectsForReports = async (dateRange?: { from?: Date, to?: Date }) => {
  try {
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
