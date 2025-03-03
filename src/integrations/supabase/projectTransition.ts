
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Project } from '@/types';

/**
 * Transitions a project from project_requests to projects table
 * when its status changes from 'new' or 'pending' to any other status
 */
export const transitionProjectToActive = async (
  projectRequestId: string, 
  newStatus: string
): Promise<Project | null> => {
  try {
    // 1. Only proceed if status is changing to something other than 'new' or 'pending'
    if (newStatus === 'new' || newStatus === 'pending') {
      return null;
    }
    
    // 2. Fetch the project request data
    const { data: requestData, error: fetchError } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', projectRequestId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching project request:', fetchError);
      return null;
    }
    
    if (!requestData) {
      console.log('No project request found with ID:', projectRequestId);
      return null;
    }
    
    // 3. Insert into projects table
    const { data: insertedProject, error: insertError } = await supabase
      .from('projects')
      .insert({
        id: requestData.id, // Keep the same ID for continuity
        title: requestData.project_name,
        description: requestData.description,
        status: newStatus,
        website_type: requestData.project_type,
        page_count: requestData.page_count,
        price: requestData.price,
        user_id: requestData.user_id,
        has_ecommerce: requestData.has_ecommerce,
        has_cms: requestData.has_cms,
        has_seo: requestData.has_seo,
        has_maintenance: requestData.has_maintenance,
        design_complexity: requestData.design_complexity,
        example_urls: requestData.file_urls,
        additional_info: requestData.additional_info,
        created_at: requestData.created_at
      })
      .select()
      .single();
      
    if (insertError) {
      console.error('Error inserting project:', insertError);
      toast.error('Failed to transition project', {
        description: insertError.message
      });
      return null;
    }
    
    // 4. Delete from project_requests table
    const { error: deleteError } = await supabase
      .from('project_requests')
      .delete()
      .eq('id', projectRequestId);
      
    if (deleteError) {
      console.error('Error deleting project request:', deleteError);
      toast.error('Project transitioned but request not deleted', {
        description: deleteError.message
      });
    } else {
      toast.success('Project transitioned to active status', {
        description: 'Project is now in the main projects table'
      });
    }
    
    return insertedProject;
  } catch (error: any) {
    console.error('Error in transitionProjectToActive:', error);
    toast.error('Failed to transition project', {
      description: error.message
    });
    return null;
  }
};
