
import { useState, useEffect } from "react";
import { ProjectModificationRequest } from "@/types";
import { fetchModificationRequests, updateModificationRequestStatus, fetchUserData } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { 
    label: "În așteptare", 
    color: "bg-yellow-100 text-yellow-800", 
    icon: <Clock className="h-4 w-4" /> 
  },
  approved: { 
    label: "Aprobat", 
    color: "bg-green-100 text-green-800", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  rejected: { 
    label: "Respins", 
    color: "bg-red-100 text-red-800", 
    icon: <XCircle className="h-4 w-4" /> 
  }
};

const priorityMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  low: { 
    label: "Scăzută", 
    color: "bg-blue-100 text-blue-800", 
    icon: null 
  },
  normal: { 
    label: "Normală", 
    color: "bg-gray-100 text-gray-800", 
    icon: null 
  },
  high: { 
    label: "Ridicată", 
    color: "bg-orange-100 text-orange-800", 
    icon: <AlertTriangle className="h-4 w-4" /> 
  },
  urgent: { 
    label: "Urgentă", 
    color: "bg-red-100 text-red-800", 
    icon: <AlertTriangle className="h-4 w-4" /> 
  }
};

interface ModificationRequestsPanelProps {
  projectId?: string;
  isAdmin: boolean;
}

const ModificationRequestsPanel = ({ projectId, isAdmin }: ModificationRequestsPanelProps) => {
  const [requests, setRequests] = useState<ProjectModificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadModificationRequests();
  }, [projectId]);

  const loadModificationRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchModificationRequests(projectId);
      setRequests(data);
      
      // Get user data for each request
      const userIds = [...new Set(data.map(request => request.userId))];
      const userDataMap: Record<string, any> = {};
      
      for (const userId of userIds) {
        const userData = await fetchUserData(userId);
        if (userData) {
          userDataMap[userId] = userData;
        }
      }
      
      setUserData(userDataMap);
    } catch (error: any) {
      console.error("Error loading modification requests:", error);
      setError(error.message);
      toast.error("Nu s-au putut încărca cererile de modificare");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      await updateModificationRequestStatus(requestId, status);
      
      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status } 
            : request
        )
      );
      
      toast.success(`Cererea a fost ${status === 'approved' ? 'aprobată' : 'respinsă'}`);
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast.error("Nu s-a putut actualiza statusul cererii");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        <p className="font-medium">A apărut o eroare</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-center mb-4">
            {isAdmin
              ? "Nu există cereri de modificare pentru acest proiect"
              : "Nu ai solicitat nicio modificare pentru acest proiect"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="border-b bg-gray-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={statusMap[request.status]?.color || "bg-gray-100"}>
                  <span className="flex items-center gap-1">
                    {statusMap[request.status]?.icon}
                    {statusMap[request.status]?.label || request.status}
                  </span>
                </Badge>
                <Badge className={priorityMap[request.priority]?.color || "bg-gray-100"}>
                  <span className="flex items-center gap-1">
                    {priorityMap[request.priority]?.icon}
                    {priorityMap[request.priority]?.label || request.priority}
                  </span>
                </Badge>
              </div>
              <CardDescription>
                {format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ro })}
              </CardDescription>
            </div>
            
            {isAdmin && userData[request.userId] && (
              <div className="mt-2 text-sm text-gray-500">
                Solicitat de: {userData[request.userId].name || userData[request.userId].email}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Descriere:</h3>
                <p className="text-gray-600 mt-1 whitespace-pre-line">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Buget:</h3>
                  <p className="text-gray-600 mt-1">{request.budget}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Termen:</h3>
                  <p className="text-gray-600 mt-1">{request.timeline}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          {isAdmin && request.status === 'pending' && (
            <CardFooter className="border-t bg-gray-50 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusChange(request.id, 'approved')}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Aprobă
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleStatusChange(request.id, 'rejected')}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Respinge
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ModificationRequestsPanel;
