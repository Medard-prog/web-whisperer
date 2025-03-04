
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, FileText, Bell, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";

interface Event {
  id: string;
  type: "message" | "task" | "note" | "request" | "status";
  title: string;
  description: string;
  date: string;
  projectId?: string;
}

const RecentEventsPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentEvents();
    }
  }, [user]);

  const fetchRecentEvents = async () => {
    setLoading(true);
    try {
      // Used for demonstration - in a real app fetch from a dedicated events/activity table
      const eventsData: Event[] = [];
      
      // Recent messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (messages && messages.length > 0) {
        const messageEvents = messages.map(msg => ({
          id: msg.id,
          type: 'message' as const,
          title: 'Mesaj nou',
          description: msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content,
          date: msg.created_at,
          projectId: msg.project_id
        }));
        
        eventsData.push(...messageEvents);
      }
      
      // Recent tasks
      const { data: tasks } = await supabase
        .from('project_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (tasks && tasks.length > 0) {
        const taskEvents = tasks.map(task => ({
          id: task.id,
          type: 'task' as const,
          title: task.is_completed ? 'Activitate finalizată' : 'Activitate nouă',
          description: task.title,
          date: task.created_at,
          projectId: task.project_id
        }));
        
        eventsData.push(...taskEvents);
      }
      
      // Recent notes
      const { data: notes } = await supabase
        .from('project_notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (notes && notes.length > 0) {
        const noteEvents = notes.map(note => ({
          id: note.id,
          type: 'note' as const,
          title: 'Notă nouă',
          description: note.content.length > 80 ? note.content.substring(0, 80) + '...' : note.content,
          date: note.created_at,
          projectId: note.project_id
        }));
        
        eventsData.push(...noteEvents);
      }
      
      // Sort all events by date (newest first)
      eventsData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // Take the 10 most recent events
      setEvents(eventsData.slice(0, 10));
    } catch (error) {
      console.error("Error fetching recent events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMM, HH:mm", { locale: ro });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'note':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'request':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'status':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          Evenimente recente
        </CardTitle>
        <CardDescription>
          Ultimele actualizări din proiectele tale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))
          ) : events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="bg-muted rounded-full p-2">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{event.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  {event.projectId && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-primary" 
                      onClick={() => window.location.href = `/project/${event.projectId}`}
                    >
                      Vezi proiectul
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>Nu există evenimente recente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEventsPanel;
