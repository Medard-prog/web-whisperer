
import { useState, useEffect } from "react";
import { ProjectModificationRequest } from "@/types";
import { fetchModificationRequests, updateModificationRequestStatus, fetchUserData } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign,
  FileEdit,
  User,
  Tag
} from 'lucide-react';
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "./ui/separator";

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { 
    label: "În așteptare", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <Clock className="h-4 w-4" /> 
  },
  approved: { 
    label: "Aprobat", 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  rejected: { 
    label: "Respins", 
    color: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircle className="h-4 w-4" /> 
  }
};

const priorityMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  low: { 
    label: "Scăzută", 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: <Tag className="h-4 w-4" /> 
  },
  normal: { 
    label: "Normală", 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    icon: <Tag className="h-4 w-4" /> 
  },
  high: { 
    label: "Ridicată", 
    color: "bg-orange-100 text-orange-800 border-orange-200", 
    icon: <AlertTriangle className="h-4 w-4" /> 
  },
  urgent: { 
    label: "Urgentă", 
    color: "bg-red-100 text-red-800 border-red-200", 
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
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    if (!isAdmin) return;
    
    try {
      setProcessingId(requestId);
      await updateModificationRequestStatus(requestId, status);
      
      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status } 
            : request
        )
      );
      
      toast.success(
        status === 'approved' 
          ? 'Cererea de modificare a fost aprobată cu succes!' 
          : 'Cererea de modificare a fost respinsă'
      );
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast.error("Nu s-a putut actualiza statusul cererii");
    } finally {
      setProcessingId(null);
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
          <FileEdit className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium text-lg mb-1">
            {isAdmin
              ? "Nu există cereri de modificare pentru acest proiect"
              : "Nu ai solicitat nicio modificare pentru acest proiect"}
          </p>
          <p className="text-gray-500 text-center text-sm max-w-md">
            {isAdmin
              ? "Cererile de modificare vor apărea aici când un client solicită modificări la proiect."
              : "Poți solicita modificări la proiect folosind butonul 'Solicită modificări' din pagina de detalii a proiectului."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Split requests into two columns
  const halfLength = Math.ceil(requests.length / 2);
  const leftColumnRequests = requests.slice(0, halfLength);
  const rightColumnRequests = requests.slice(halfLength);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {leftColumnRequests.map((request) => (
          <RequestCard 
            key={request.id}
            request={request}
            userData={userData}
            isAdmin={isAdmin}
            processingId={processingId}
            handleStatusChange={handleStatusChange}
          />
        ))}
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        {rightColumnRequests.map((request) => (
          <RequestCard 
            key={request.id}
            request={request}
            userData={userData}
            isAdmin={isAdmin}
            processingId={processingId}
            handleStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

// Extracted RequestCard component for better organization
interface RequestCardProps {
  request: ProjectModificationRequest;
  userData: Record<string, any>;
  isAdmin: boolean;
  processingId: string | null;
  handleStatusChange: (requestId: string, status: string) => Promise<void>;
}

const RequestCard = ({ 
  request, 
  userData, 
  isAdmin, 
  processingId, 
  handleStatusChange 
}: RequestCardProps) => {
  return (
    <Card 
      key={request.id} 
      className={`overflow-hidden ${
        request.status === 'approved' 
          ? 'border-green-200 bg-green-50/30' 
          : request.status === 'rejected'
            ? 'border-red-200 bg-red-50/30'
            : ''
      }`}
    >
      <CardHeader className={`border-b pb-3 ${
        request.status === 'approved' 
          ? 'bg-green-50' 
          : request.status === 'rejected'
            ? 'bg-red-50'
            : 'bg-gray-50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
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
            
            <CardDescription className="sm:ml-2 mt-1 sm:mt-0">
              <Clock className="inline h-3 w-3 mr-1" />
              {format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ro })}
            </CardDescription>
          </div>
        </div>
        
        {isAdmin && userData[request.userId] && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <User className="h-3 w-3" />
            <span>Solicitat de: </span>
            <span className="font-medium">
              {userData[request.userId].name || userData[request.userId].email}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 flex items-center">
              <FileEdit className="h-4 w-4 mr-1 text-gray-500" />
              Descriere modificări:
            </h3>
            <p className="text-gray-700 mt-2 whitespace-pre-line bg-white p-3 rounded border">
              {request.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h3 className="font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                Buget estimat:
              </h3>
              <p className="text-gray-700 mt-1">{request.budget}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                Termen estimat:
              </h3>
              <p className="text-gray-700 mt-1">{request.timeline}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {isAdmin && request.status === 'pending' && (
        <CardFooter className="border-t bg-gray-50 gap-2 p-4">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 flex-1 font-medium"
            onClick={() => handleStatusChange(request.id, 'approved')}
            disabled={processingId === request.id}
          >
            {processingId === request.id ? (
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Aprobă
          </Button>
          <Button 
            variant="outline"
            className="flex-1 font-medium border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400"
            onClick={() => handleStatusChange(request.id, 'rejected')}
            disabled={processingId === request.id}
          >
            {processingId === request.id ? (
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Respinge
          </Button>
        </CardFooter>
      )}
      
      {request.status !== 'pending' && (
        <CardFooter className={`border-t p-3 flex flex-col items-start ${
          request.status === 'approved' 
            ? 'bg-green-50' 
            : 'bg-red-50'
        }`}>
          <p className={`text-sm font-medium flex items-center ${
            request.status === 'approved' 
              ? 'text-green-700' 
              : 'text-red-700'
          }`}>
            {request.status === 'approved' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Cererea a fost aprobată
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Cererea a fost respinsă
              </>
            )}
          </p>
          {request.status === 'approved' && (
            <p className="text-xs text-green-600 mt-1">
              Vom contacta cât de curând pentru detalii despre implementare.
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ModificationRequestsPanel;
