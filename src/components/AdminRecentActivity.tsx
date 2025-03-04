import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Mail, CircleAlert, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { fetchRecentActivity } from "@/integrations/supabase/services/analyticsService";
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatRelativeTime } from '@/lib/utils';

type ActivityItem = 
  | { id: string; type: "message"; projectId: string; userId: string; content: string; createdAt: string; }
  | { id: string; type: "modification_request"; projectId: string; userId: string; content: string; createdAt: string; status: string; priority: string; }
  | { id: string; type: "project_note"; projectId: string; userId: string; content: string; createdAt: string; }
  | { id: string; type: "project_request"; id: string; userId: string; content: string; createdAt: string; status: string; };

const AdminRecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentActivity();
        setActivities(data as ActivityItem[]);
      } catch (error) {
        console.error("Error loading recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'modification_request':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'project_note':
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      case 'project_request':
        return <CircleAlert className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'message':
        return 'Mesaj nou';
      case 'modification_request':
        return 'Cerere de modificare';
      case 'project_note':
        return 'Notă nouă';
      case 'project_request':
        return 'Cerere de proiect';
      default:
        return 'Activitate';
    }
  };

  const handleNavigate = (activity: ActivityItem) => {
    if (activity.type === 'message' || activity.type === 'project_note' || activity.type === 'modification_request') {
      navigate(`/admin/project/${activity.projectId}`);
    } else if (activity.type === 'project_request') {
      navigate(`/admin/projects`);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Activitate Recentă</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-100 animate-pulse rounded-md h-16"></div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Nu există activitate recentă</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleNavigate(activity)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-md">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{getActivityTitle(activity)}</h3>
                        {activity.type === 'modification_request' && (
                          <Badge className={
                            activity.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            activity.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }>
                            {activity.status === 'pending' ? 'În așteptare' :
                             activity.status === 'approved' ? 'Aprobat' : 'Respins'}
                          </Badge>
                        )}
                        {activity.type === 'project_request' && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Nou
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(new Date(activity.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {activity.content}
                    </p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Vizualizează <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;
