
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Pencil,
  MessageSquare,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { Project } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectDetailsPanelProps {
  project: Project | null;
  loading?: boolean;
  isAdmin?: boolean;
}

const ProjectDetailsPanel = ({ project, loading = false, isAdmin = false }: ProjectDetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const statusMap = {
    pending: { 
      label: "În așteptare", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle 
    },
    in_progress: { 
      label: "În progres", 
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock 
    },
    completed: { 
      label: "Finalizat", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle 
    },
    cancelled: { 
      label: "Anulat", 
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle 
    },
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 mt-8" />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500">Proiect nedisponibil</h3>
        <p className="text-gray-400">Proiectul nu a fost găsit sau nu aveți permisiunea de a-l accesa.</p>
      </div>
    );
  }
  
  const StatusIcon = statusMap[project.status].icon;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${statusMap[project.status].color}`}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" />
              {statusMap[project.status].label}
            </Badge>
            <span className="text-sm text-gray-500">
              Creat la {formatDate(project.createdAt)}
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
        </div>
        {isAdmin && (
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Pencil className="h-4 w-4 mr-2" />
            Actualizează proiect
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Preț</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(project.price)}</div>
            {project.hasMaintenance && (
              <p className="text-sm text-gray-500">+ 200 RON/lună mentenanță</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Termen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                {project.dueDate ? (
                  <>
                    <div className="font-semibold">{formatDate(project.dueDate)}</div>
                    <p className="text-sm text-gray-500">Data estimată de finalizare</p>
                  </>
                ) : (
                  <div className="text-gray-500">Nespecificat</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tip Website</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold capitalize">{project.websiteType}</div>
            <p className="text-sm text-gray-500">
              {project.pageCount} pagini, design {project.designComplexity}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit">
          <TabsTrigger value="overview">Detalii</TabsTrigger>
          <TabsTrigger value="messages">Mesaje</TabsTrigger>
          <TabsTrigger value="payments">Plăți</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalii proiect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Descriere</h3>
                <p>{project.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Funcționalități</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                      <span>{project.pageCount} pagini</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                      <span>Design {project.designComplexity}</span>
                    </li>
                    {project.hasCMS && (
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                        <span>Sistem administrare conținut (CMS)</span>
                      </li>
                    )}
                    {project.hasEcommerce && (
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                        <span>Magazin online (eCommerce)</span>
                      </li>
                    )}
                    {project.hasSEO && (
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                        <span>Optimizare SEO</span>
                      </li>
                    )}
                    {project.hasMaintenance && (
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                        <span>Mentenanță lunară</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                {(project.exampleUrls && project.exampleUrls.length > 0) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Website-uri exemplu</h3>
                    <ul className="space-y-2">
                      {project.exampleUrls.map((url, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:underline"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {project.additionalInfo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Informații suplimentare</h3>
                  <p>{project.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mesaje</CardTitle>
              <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mesaj nou
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-500">Nu există mesaje</h3>
                <p className="text-gray-400 mb-4">Nu există încă mesaje pentru acest proiect.</p>
                <Button className="bg-brand-600 hover:bg-brand-700">
                  Trimite primul mesaj
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plăți și facturi</CardTitle>
              {!isAdmin && project.status === "pending" && (
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Efectuează plata
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-500">Nu există facturi</h3>
                <p className="text-gray-400">Nu există încă facturi pentru acest proiect.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPanel;
