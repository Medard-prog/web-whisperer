
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { mapProject, Project } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const statusTranslations: Record<string, { label: string; color: string }> = {
  pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "În lucru", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Finalizat", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Anulat", color: "bg-red-100 text-red-800" }
};

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProjects(data.map(mapProject) || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Nu s-au putut încărca proiectele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proiectele Mele</h1>
              <p className="text-gray-600">
                Vezi toate proiectele tale și statusul lor
              </p>
            </div>
            
            <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Link to="/request">
                <Plus className="mr-2 h-4 w-4" />
                Proiect Nou
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Se încarcă proiectele...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nu ai niciun proiect</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Creează primul tău proiect pentru a începe colaborarea cu echipa noastră
                </p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Link to="/request">
                    <Plus className="mr-2 h-4 w-4" />
                    Solicită un Proiect
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge className={statusTranslations[project.status]?.color || "bg-gray-100"}>
                        {statusTranslations[project.status]?.label || project.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.createdAt && format(new Date(project.createdAt), 'dd MMMM yyyy', { locale: ro })}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description || "Fără descriere"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Tip:</span>{" "}
                        <span className="text-gray-600">{project.websiteType || "Website"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Preț:</span>{" "}
                        <span className="text-gray-600">{project.price ? `${project.price} €` : "La cerere"}</span>
                      </div>
                      {project.pageCount && (
                        <div>
                          <span className="font-medium">Pagini:</span>{" "}
                          <span className="text-gray-600">{project.pageCount}</span>
                        </div>
                      )}
                      {project.dueDate && (
                        <div>
                          <span className="font-medium">Termen:</span>{" "}
                          <span className="text-gray-600">
                            {format(new Date(project.dueDate), 'dd MMM yyyy', { locale: ro })}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/project/${project.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Vezi Detalii
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default Projects;
