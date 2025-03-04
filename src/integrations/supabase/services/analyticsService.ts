
import { supabase } from '../core/client';
import { toast } from 'sonner';

export const fetchDashboardStats = async () => {
  try {
    // Get project counts by status
    const { data: statusCounts, error: statusError } = await supabase.rpc('get_project_status_counts');
    
    if (statusError) throw statusError;
    
    // Get project counts by payment status
    const { data: paymentCounts, error: paymentError } = await supabase.rpc('get_payment_status_counts');
    
    if (paymentError) throw paymentError;
    
    // Get total revenue data
    const { data: revenueData, error: revenueError } = await supabase.rpc('get_monthly_revenue');
    
    if (revenueError) throw revenueError;
    
    // Get feature adoption
    const [
      { data: ecommerceCount, error: ecommerceError },
      { data: cmsCount, error: cmsError },
      { data: seoCount, error: seoError },
      { data: maintenanceCount, error: maintenanceError }
    ] = await Promise.all([
      supabase.rpc('count_projects_with_ecommerce'),
      supabase.rpc('count_projects_with_cms'),
      supabase.rpc('count_projects_with_seo'),
      supabase.rpc('count_projects_with_maintenance')
    ]);
    
    if (ecommerceError || cmsError || seoError || maintenanceError) {
      throw new Error('Error fetching feature counts');
    }
    
    return {
      statusCounts: statusCounts || [],
      paymentCounts: paymentCounts || [],
      revenueData: revenueData || [],
      featureCounts: {
        ecommerce: ecommerceCount || 0,
        cms: cmsCount || 0,
        seo: seoCount || 0,
        maintenance: maintenanceCount || 0
      }
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    toast.error(`Failed to fetch dashboard statistics: ${error.message}`);
    return {
      statusCounts: [],
      paymentCounts: [],
      revenueData: [],
      featureCounts: {
        ecommerce: 0,
        cms: 0,
        seo: 0,
        maintenance: 0
      }
    };
  }
};

export const fetchRecentActivity = async (limit = 10) => {
  try {
    // Get recent messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, project_id, user_id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (messagesError) throw messagesError;
    
    // Get recent modification requests
    const { data: modifications, error: modificationsError } = await supabase
      .from('project_modification_requests')
      .select('id, project_id, user_id, description, created_at, status, priority')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (modificationsError) throw modificationsError;
    
    // Get recent project notes
    const { data: notes, error: notesError } = await supabase
      .from('project_notes')
      .select('id, project_id, created_by, content, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (notesError) throw notesError;
    
    // Get recent project requests
    const { data: projectRequests, error: requestsError } = await supabase
      .from('projects')
      .select('id, user_id, title, description, created_at, status')
      .eq('type', 'request')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (requestsError) throw requestsError;
    
    // Combine and format the data
    const combinedActivity = [
      ...(messages || []).map(msg => ({
        id: msg.id,
        type: 'message',
        projectId: msg.project_id,
        userId: msg.user_id,
        content: msg.content,
        createdAt: msg.created_at,
      })),
      ...(modifications || []).map(mod => ({
        id: mod.id,
        type: 'modification_request',
        projectId: mod.project_id,
        userId: mod.user_id,
        content: mod.description,
        createdAt: mod.created_at,
        status: mod.status,
        priority: mod.priority
      })),
      ...(notes || []).map(note => ({
        id: note.id,
        type: 'project_note',
        projectId: note.project_id,
        userId: note.created_by,
        content: note.content,
        createdAt: note.created_at,
      })),
      ...(projectRequests || []).map(req => ({
        id: req.id,
        type: 'project_request',
        userId: req.user_id,
        content: req.title,
        createdAt: req.created_at,
        status: req.status,
      })),
    ];
    
    // Sort by creation date (newest first)
    return combinedActivity.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    }).slice(0, limit);
    
  } catch (error: any) {
    console.error('Error fetching recent activity:', error);
    toast.error(`Failed to fetch recent activity: ${error.message}`);
    return [];
  }
};

// Functions for the Reports page
export const getProjectStatusChartData = async () => {
  try {
    const { data, error } = await supabase.rpc('get_project_status_counts');
    if (error) throw error;
    
    return data.map((item: any) => ({
      name: item.status,
      value: parseInt(item.count)
    }));
  } catch (error: any) {
    console.error('Error fetching project status data:', error);
    toast.error(`Failed to fetch project status data: ${error.message}`);
    return [];
  }
};

export const getProjectsByPaymentStatus = async () => {
  try {
    const { data, error } = await supabase.rpc('get_payment_status_counts');
    if (error) throw error;
    
    return data.map((item: any) => ({
      name: item.payment_status,
      value: parseInt(item.count)
    }));
  } catch (error: any) {
    console.error('Error fetching payment status data:', error);
    toast.error(`Failed to fetch payment status data: ${error.message}`);
    return [];
  }
};

export const getTotalRevenueData = async () => {
  try {
    const { data, error } = await supabase.rpc('get_monthly_revenue');
    if (error) throw error;
    
    return data.map((item: any) => ({
      name: item.month_year,
      total: parseFloat(item.total_revenue),
      collected: parseFloat(item.total_collected)
    }));
  } catch (error: any) {
    console.error('Error fetching revenue data:', error);
    toast.error(`Failed to fetch revenue data: ${error.message}`);
    return [];
  }
};

export const getPopularFeaturesData = async () => {
  try {
    const [
      { data: ecommerceCount, error: ecommerceError },
      { data: cmsCount, error: cmsError },
      { data: seoCount, error: seoError },
      { data: maintenanceCount, error: maintenanceError }
    ] = await Promise.all([
      supabase.rpc('count_projects_with_ecommerce'),
      supabase.rpc('count_projects_with_cms'),
      supabase.rpc('count_projects_with_seo'),
      supabase.rpc('count_projects_with_maintenance')
    ]);
    
    if (ecommerceError || cmsError || seoError || maintenanceError) {
      throw new Error('Error fetching feature counts');
    }
    
    return [
      { name: 'E-commerce', value: ecommerceCount },
      { name: 'CMS', value: cmsCount },
      { name: 'SEO', value: seoCount },
      { name: 'Mentenanță', value: maintenanceCount }
    ];
  } catch (error: any) {
    console.error('Error fetching feature data:', error);
    toast.error(`Failed to fetch feature data: ${error.message}`);
    return [];
  }
};
