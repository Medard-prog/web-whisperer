
import { supabase } from '../core/client';
import { toast } from 'sonner';

// This function would pull recent activities from various tables
export const fetchRecentActivity = async (limit = 20) => {
  try {
    // We'll need to fetch from multiple tables and combine the results
    
    // 1. Get recent messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, project_id, user_id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (messagesError) throw messagesError;
    
    // 2. Get recent project modification requests
    const { data: modifications, error: modsError } = await supabase
      .from('project_modification_requests')
      .select('id, project_id, user_id, description, created_at, status, priority')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (modsError) throw modsError;
    
    // 3. Get recent project notes
    const { data: notes, error: notesError } = await supabase
      .from('project_notes')
      .select('id, project_id, created_by, content, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (notesError) throw notesError;
    
    // 4. Get recent project requests
    const { data: projectRequests, error: projectsError } = await supabase
      .from('project_requests')
      .select('id, user_id, description, created_at, status')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (projectsError) throw projectsError;
    
    // Transform and combine data
    const messageActivities = (messages || []).map(msg => ({
      id: msg.id,
      type: 'message' as const,
      projectId: msg.project_id,
      userId: msg.user_id,
      content: msg.content,
      createdAt: msg.created_at
    }));
    
    const modificationActivities = (modifications || []).map(mod => ({
      id: mod.id,
      type: 'modification_request' as const,
      projectId: mod.project_id,
      userId: mod.user_id,
      content: mod.description,
      createdAt: mod.created_at,
      status: mod.status,
      priority: mod.priority
    }));
    
    const noteActivities = (notes || []).map(note => ({
      id: note.id,
      type: 'note' as const,
      projectId: note.project_id,
      userId: note.created_by || '',
      content: note.content,
      createdAt: note.created_at
    }));
    
    const projectRequestActivities = (projectRequests || []).map(req => ({
      id: req.id,
      type: 'project_request' as const,
      userId: req.user_id || '',
      content: req.description,
      createdAt: req.created_at,
      status: req.status
    }));
    
    // Combine all activities and sort by creation date (newest first)
    const allActivities = [
      ...messageActivities, 
      ...modificationActivities, 
      ...noteActivities,
      ...projectRequestActivities
    ].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return allActivities.slice(0, limit);
    
  } catch (error: any) {
    console.error('Error fetching recent activity:', error);
    toast.error('Nu s-a putut încărca activitatea recentă');
    return [];
  }
};
