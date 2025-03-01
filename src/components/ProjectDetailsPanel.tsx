
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, DollarSign, Edit, FileText, MessageSquare } from "lucide-react";

interface ProjectDetailsPanelProps {
  project: Project | null;
  loading: boolean;
  isAdmin?: boolean;
}

const statusMap = {
  pending: {
    label: "În așteptare",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  in_progress: {
    label: "În progres",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  completed: {
    label: "Finalizat",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  cancelled: {
    label: "Anulat",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  new: {
    label: "Nou",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
};

const ProjectDetailsPanel = ({ project, loading, isAdmin = false }: ProjectDetailsPanelProps) => {
  const [expandDescription, setExpandDescription] = useState(false);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }
  
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proiect negăsit</CardTitle>
          <CardDescription>
            Proiectul căutat nu există sau nu ai acces la el.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const status = statusMap[project.status as keyof typeof statusMap] || statusMap.pending;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <Badge className={`ml-2 ${status.color}`}>{status.label}</Badge>
            </div>
            <CardDescription className="mt-1.5">
              Creat la {formatDate(project.createdAt)}
            </CardDescription>
          </div>
          {isAdmin && (
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="mr-2">
                <Edit className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-purple-50 border-none">
              <CardContent className="p-4 flex items-center">
                <Calendar className="h-10 w-10 text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Data finalizare</p>
                  <p className="font-semibold">
                    {project.dueDate ? formatDate(project.dueDate) : "Nespecificată"}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-indigo-50 border-none">
              <CardContent className="p-4 flex items-center">
                <Clock className="h-10 w-10 text-indigo-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Stadiu</p>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded overflow-hidden mt-1">
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ 
                          width: project.status === 'completed' 
                            ? '100%' 
                            : project.status === 'in_progress' 
                              ? '50%' 
                              : project.status === 'pending' 
                                ? '10%' 
                                : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 font-semibold">
                      {project.status === 'completed' 
                        ? '100%' 
                        : project.status === 'in_progress' 
                          ? '50%' 
                          : project.status === 'pending' 
                            ? '10%' 
                            : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-none">
              <CardContent className="p-4 flex items-center">
                <DollarSign className="h-10 w-10 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Preț</p>
                  <p className="font-semibold">{project.price.toLocaleString()} RON</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                Descriere proiect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={expandDescription ? "" : "max-h-32 overflow-hidden relative"}>
                <p className="text-gray-700">
                  {project.description}
                </p>
                {!expandDescription && project.description && project.description.length > 200 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>
              {project.description && project.description.length > 200 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandDescription(!expandDescription)}
                  className="mt-2"
                >
                  {expandDescription ? "Afișează mai puțin" : "Afișează mai mult"}
                </Button>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Mesaje</span>
            </Button>
            {!isAdmin && (
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Solicită modificări
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectDetailsPanel;
