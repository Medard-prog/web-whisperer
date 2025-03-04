
import React, { useState, useEffect } from 'react';
import { 
  fetchRecentActivity, 
  fetchUserData, 
  fetchProjectById 
} from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare, 
  FileEdit, 
  FileText, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { ro } from 'date-fns/locale';
import { formatRelativeTime } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'message' | 'project_request' | 'modification_request' | 'note';
  projectId?: string;
  userId: string;
  content?: string;
  createdAt: string;
  status?: string;
  priority?: string;
}

const AdminRecentActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [projectData, setProjectData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // In a real implementation, this would come from an API
      // For now, let's simulate fetching data
      const recentActivities = await fetchRecentActivity();
      setActivities(recentActivities);
      
      // Fetch user data for each activity
      const userIds = [...new Set(recentActivities.map(activity => activity.userId))];
      const userDataMap: Record<string, any> = {};
      
      for (const userId of userIds) {
        const userData = await fetchUserData(userId);
        if (userData) {
          userDataMap[userId] = userData;
        }
      }
      
      setUserData(userDataMap);
      
      // Fetch project data for each activity with a projectId
      const projectIds = [...new Set(recentActivities
        .filter(activity => activity.projectId)
        .map(activity => activity.projectId as string)
      )];
      
      const projectDataMap: Record<string, any> = {};
      
      for (const projectId of projectIds) {
        const projectData = await fetchProjectById(projectId);
        if (projectData) {
          projectDataMap[projectId] = projectData;
        }
      }
      
      setProjectData(projectDataMap);
      
    } catch (error: any) {
      console.error('Error loading recent activity:', error);
      setError('Nu s-a putut încărca activitatea recentă');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecentActivity();
    setRefreshing(false);
  };
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'project_request':
        return <FolderOpen className="h-5 w-5 text-purple-500" />;
      case 'modification_request':
        return <FileEdit className="h-5 w-5 text-amber-500" />;
      case 'note':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getActivityTitle = (activity: Activity) => {
    const userName = userData[activity.userId]?.name || 'Un utilizator';
    const projectTitle = activity.projectId && projectData[activity.projectId] 
      ? projectData[activity.projectId].title
      : 'un proiect';
      
    switch (activity.type) {
      case 'message':
        return `${userName} a trimis un mesaj nou`;
      case 'project_request':
        return `${userName} a solicitat un proiect nou`;
      case 'modification_request':
        return `${userName} a solicitat modificări pentru ${projectTitle}`;
      case 'note':
        return `O notă nouă a fost adăugată la ${projectTitle}`;
      default:
        return 'Activitate nouă';
    }
  };
  
  const getActionLink = (activity: Activity) => {
    if (!activity.projectId) return null;
    
    switch (activity.type) {
      case 'message':
        return `/admin/project/${activity.projectId}/chat`;
      case 'modification_request':
      case 'note':
        return `/admin/project/${activity.projectId}`;
      case 'project_request':
        return `/admin/projects`;
      default:
        return null;
    }
  };
  
  const filteredActivities = activeTab === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeTab);
    
  const handleNavigate = (activity: Activity) => {
    const link = getActionLink(activity);
    if (link) {
      navigate(link);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activitate recentă</span>
            <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            <AlertTriangle className="h-5 w-5 mb-2" />
            <p className="font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Activitate recentă</span>
          <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">Toate</TabsTrigger>
            <TabsTrigger value="message">Mesaje</TabsTrigger>
            <TabsTrigger value="modification_request">Modificări</TabsTrigger>
            <TabsTrigger value="project_request">Proiecte noi</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-start space-x-3 p-3 border rounded-md">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Clock className="h-12 w-12 mx-auto opacity-20 mb-3" />
            <p className="text-lg font-medium">Nu există activitate recentă</p>
            <p className="text-sm">
              {activeTab === 'all'
                ? 'Activitatea va apărea aici când utilizatorii interacționează cu platforma.'
                : `Nu există activitate recentă de tipul "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map(activity => (
              <div 
                key={activity.id}
                className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigate(activity)}
                style={{cursor: getActionLink(activity) ? 'pointer' : 'default'}}
              >
                <div className="rounded-full p-2 bg-gray-100 mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {getActivityTitle(activity)}
                      </h4>
                      
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span title={format(new Date(activity.createdAt), 'dd MMMM yyyy HH:mm')}>
                          {formatRelativeTime(new Date(activity.createdAt))}
                        </span>
                      </div>
                    </div>
                    
                    {activity.projectId && projectData[activity.projectId] && (
                      <Badge variant="outline" className="text-xs">
                        {projectData[activity.projectId].title}
                      </Badge>
                    )}
                  </div>
                  
                  {activity.content && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
                      {activity.content}
                    </p>
                  )}
                  
                  {activity.type === 'modification_request' && activity.status && (
                    <div className="mt-2">
                      <Badge 
                        className={
                          activity.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : activity.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                        }
                      >
                        {activity.status === 'pending'
                          ? 'În așteptare'
                          : activity.status === 'approved'
                            ? 'Aprobat'
                            : 'Respins'}
                      </Badge>
                      
                      {activity.priority && (
                        <Badge 
                          className="ml-2 bg-blue-100 text-blue-800 border-blue-300"
                        >
                          {activity.priority === 'low'
                            ? 'Prioritate scăzută'
                            : activity.priority === 'normal'
                              ? 'Prioritate normală'
                              : activity.priority === 'high'
                                ? 'Prioritate ridicată'
                                : 'Prioritate urgentă'}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {getActionLink(activity) && (
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary-dark gap-1 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(activity);
                        }}
                      >
                        <span className="text-xs">Vezi detalii</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
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
