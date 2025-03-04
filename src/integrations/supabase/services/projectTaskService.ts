
import { supabase } from '../core/client';
import { toast } from 'sonner';
import { ProjectTask } from '@/types';

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
