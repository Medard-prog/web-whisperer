
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  RefreshCw,
  FileEdit,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface RecentEvent {
  id: string;
  type: 'message' | 'modification' | 'status_change';
  projectId: string;
  projectTitle: string;
  content: string;
  timestamp: string;
  status?: string;
  isRead?: boolean;
}

const RecentEventsPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchRecentEvents = async () => {
      setLoading(true);
      
      try {
        // Fetch recent messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('id, project_id, content, created_at, is_admin')
          .eq('is_admin', true) // Only messages from admin
          .in('project_id', [
            // We'd get the user's project IDs here
            // This is a placeholder implementation
          ])
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (messagesError) throw messagesError;
        
        // Fetch recent modification requests
        const { data: modifications, error: modificationsError } = await supabase
          .from('modification_requests')
          .select('id, project_id, description, created_at, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (modificationsError) throw modificationsError;
        
        // Fetch project status changes
        const { data: statusChanges, error: statusChangesError } = await supabase
          .from('project_status_history')
          .select('id, project_id, new_status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (statusChangesError) throw statusChangesError;
        
        // Get project titles
        const projectIds = new Set([
          ...(messages?.map(m => m.project_id) || []),
          ...(modifications?.map(m => m.project_id) || []),
          ...(statusChanges?.map(s => s.project_id) || [])
        ]);
        
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, title')
          .in('id', Array.from(projectIds));
          
        if (projectsError) throw projectsError;
        
        const projectTitles = projects?.reduce((acc, project) => {
          acc[project.id] = project.title;
          return acc;
        }, {} as Record<string, string>) || {};
        
        // Transform data into events
        const messageEvents: RecentEvent[] = (messages || []).map(message => ({
          id: message.id,
          type: 'message',
          projectId: message.project_id,
          projectTitle: projectTitles[message.project_id] || 'Unknown Project',
          content: message.content,
          timestamp: message.created_at,
          isRead: false // This would come from a read status table in a real implementation
        }));
        
        const modificationEvents: RecentEvent[] = (modifications || []).map(mod => ({
          id: mod.id,
          type: 'modification',
          projectId: mod.project_id,
          projectTitle: projectTitles[mod.project_id] || 'Unknown Project',
          content: mod.description,
          timestamp: mod.created_at,
          status: mod.status
        }));
        
        const statusEvents: RecentEvent[] = (statusChanges || []).map(change => ({
          id: change.id,
          type: 'status_change',
          projectId: change.project_id,
          projectTitle: projectTitles[change.project_id] || 'Unknown Project',
          content: `Project status changed to ${change.new_status}`,
          timestamp: change.created_at,
          status: change.new_status
        }));
        
        // Combine all events and sort by timestamp
        const allEvents = [...messageEvents, ...modificationEvents, ...statusEvents]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5); // Keep only the 5 most recent
          
        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching recent events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentEvents();
    
    // Set up realtime listeners for new events
    const messagesChannel = supabase
      .channel('dashboard-events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `is_admin=eq.true`
      }, (payload) => {
        // In a real implementation, we'd filter by the user's projects
        console.log('New message:', payload);
        // Refresh events
        fetchRecentEvents();
      })
      .subscribe();
      
    return () => {
      messagesChannel.unsubscribe();
    };
  }, [user]);
  
  const getEventIcon = (type: string, status?: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'modification':
        if (status === 'approved') return <CheckCircle className="h-4 w-4" />;
        if (status === 'rejected') return <AlertCircle className="h-4 w-4" />;
        return <FileEdit className="h-4 w-4" />;
      case 'status_change':
        if (status === 'completed') return <CheckCircle className="h-4 w-4" />;
        if (status === 'in_progress') return <Activity className="h-4 w-4" />;
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getEventBadgeColor = (type: string, status?: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'modification':
        if (status === 'approved') return 'bg-green-100 text-green-800 border-green-200';
        if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'status_change':
        if (status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
        if (status === 'in_progress') return 'bg-blue-100 text-blue-800 border-blue-200';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getEventTypeLabel = (type: string, status?: string) => {
    switch (type) {
      case 'message':
        return 'Mesaj nou';
      case 'modification':
        if (status === 'approved') return 'Cerere aprobată';
        if (status === 'rejected') return 'Cerere respinsă';
        return 'Cerere modificare';
      case 'status_change':
        return 'Actualizare status';
      default:
        return 'Eveniment';
    }
  };
  
  const handleEventClick = (event: RecentEvent) => {
    if (event.type === 'message') {
      navigate(`/project/${event.projectId}/chat`);
    } else {
      navigate(`/project/${event.projectId}`);
    }
  };
  
  const refreshEvents = () => {
    setLoading(true);
    // In a real implementation, this would trigger the fetch function
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // For demo purposes, display some mock data if no real data available
  const mockEvents: RecentEvent[] = [
    {
      id: '1',
      type: 'message',
      projectId: '123',
      projectTitle: 'Website E-commerce',
      content: 'Am actualizat designul conform cerințelor.',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'modification',
      projectId: '456',
      projectTitle: 'Blog Corporate',
      content: 'Cerere de adăugare secțiune nouă',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'approved'
    },
    {
      id: '3',
      type: 'status_change',
      projectId: '789',
      projectTitle: 'Magazin Online',
      content: 'Proiectul a trecut în etapa de dezvoltare',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'in_progress'
    }
  ];
  
  const displayEvents = events.length > 0 ? events : mockEvents;
  
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b px-6 py-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600" />
          Evenimente Recente
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshEvents}
          disabled={loading}
          className="h-8 w-8 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayEvents.length > 0 ? (
              displayEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-3 rounded-lg bg-white shadow-sm border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEventBadgeColor(event.type, event.status)}`}>
                        {getEventIcon(event.type, event.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.projectTitle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getEventBadgeColor(event.type, event.status)}>
                            {getEventTypeLabel(event.type, event.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(event.timestamp), 'dd MMM, HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-1">{event.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Nu există evenimente recente</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEventsPanel;
