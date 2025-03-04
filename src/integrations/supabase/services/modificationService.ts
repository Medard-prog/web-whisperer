
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { ProjectModificationRequest } from '@/types';

export const fetchModificationRequests = async (projectId?: string) => {
  try {
    let query = supabase
      .from('project_modification_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching modification requests:", error);
      toast.error(`Failed to fetch modification requests: ${error.message}`);
      return [];
    }

    return data.map(request => ({
      id: request.id,
      projectId: request.project_id,
      userId: request.user_id,
      description: request.description,
      budget: request.budget,
      timeline: request.timeline,
      priority: request.priority,
      status: request.status,
      createdAt: request.created_at
    } as ProjectModificationRequest));
  } catch (error: any) {
    console.error("Error in fetchModificationRequests:", error);
    toast.error(`Failed to fetch modification requests: ${error.message}`);
    return [];
  }
};

export const updateModificationRequestStatus = async (requestId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('project_modification_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error("Error updating modification request status:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateModificationRequestStatus:", error);
    throw error;
  }
};
