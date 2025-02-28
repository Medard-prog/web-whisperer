
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProjects } from "@/integrations/supabase/client";
import { Project } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Clock, MessageSquare, LayoutList, Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import PageTransition from "@/components/PageTransition";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        const projectsData = await fetchProjects(user.id);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca proiectele. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProjects();
  }, [user, toast]);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.websiteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const statusMap = {
    pending: { label: "În așteptare", color: "bg-yellow-500" },
    in_progress: { label: "În curs", color: "bg-blue-500" },
    completed: { label: "Finalizat", color: "bg-green-500" },
    cancelled: { label: "Anulat", color: "bg-red-500" },
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">Bine ai venit, {user?.name || "Utilizator"}!</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Caută proiecte..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Proiecte active</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {projects.filter(p => p.status === "in_progress").length}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Proiecte finalizate</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {projects.filter(p => p.status === "completed").length}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total proiecte</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">{projects.length}</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Projects Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FolderKanban className="h-5 w-5 mr-2 text-blue-500" />
                  Proiectele mele
                </CardTitle>
                <CardDescription>
                  Vizualizează și gestionează proiectele tale
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} onClick={() => navigate(`/project/${project.id}`)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FolderKanban className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Nu ai proiecte</h3>
                    <p className="text-gray-500">Solicită o ofertă pentru a începe un proiect nou.</p>
                    <Button 
                      className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => navigate('/request')}
                    >
                      Solicită ofertă
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LayoutList className="h-5 w-5 mr-2 text-indigo-500" />
                    Acțiuni rapide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/request')}
                  >
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Solicită un proiect nou
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/contact')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contactează-ne
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/schedule')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Programează o consultație
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    Activitate recentă
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 4).map((project) => (
                        <div key={project.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(project.createdAt).toLocaleDateString('ro-RO')}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs text-white ${statusMap[project.status]?.color || "bg-gray-500"}`}>
                            {statusMap[project.status]?.label || project.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Nu există activitate recentă</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Dashboard;
