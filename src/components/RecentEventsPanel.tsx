import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRecentEvents } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface RecentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'project' | 'message' | 'payment' | 'support';
  status?: string;
  url?: string;
}

const RecentEventsPanel = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await fetchRecentEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching recent events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <BarChart3 className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        {loading ? (
          <div className="text-center py-4">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-4">No recent events</div>
        ) : (
          <ul className="list-none p-0 m-0 space-y-3">
            {events.map((event) => (
              <li key={event.id} className="border rounded-md p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.description}</p>
                    <p className="text-xs mt-1">
                      {new Date(event.date).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {event.url && (
                    <Button variant="ghost" size="sm" className="px-2">
                      <a href={event.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Vezi <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEventsPanel;
