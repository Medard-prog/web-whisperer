
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProjects } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import { Project } from "@/types";
import { Plus, FileText, UserRound, CheckCircle, Clock, BarChart } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !authLoading) {
      loadProjects();
    } else if (!authLoading && !loading) {
      setLoading(false);
    }
  }, [user, authLoading]);
  
  const loadProjects = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      console.log("Loading projects in Dashboard for user:", user.id);
      
      // Load projects from the combined projects table
      const allProjects = await fetchProjects(user.id);
      console.log("All projects fetched in Dashboard:", allProjects);
      
      // Sort by creation date (newest first)
      allProjects.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      console.log("Combined projects in Dashboard:", allProjects);
      setProjects(allProjects);
      
    } catch (error) {
      console.error("Error loading projects in Dashboard:", error);
      toast.error("Eroare la încărcarea proiectelor", {
        description: "Vă rugăm să reîncercați mai târziu."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestProject = () => {
    navigate("/request");
  };
  
  // Calculate stats from projects
  const activeProjects = projects.filter(p => p.status === "in_progress" || p.status === "new").length;
  const pendingProjects = projects.filter(p => p.status === "pending").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const totalProjects = projects.length;
  
  const statsCards = [
    {
      title: "Proiecte active",
      value: activeProjects,
      icon: Clock,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Proiecte în așteptare",
      value: pendingProjects,
      icon: FileText,
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      title: "Proiecte finalizate",
      value: completedProjects,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700" 
    },
    {
      title: "Proiecte totale",
      value: totalProjects,
      icon: BarChart,
      color: "bg-purple-100 text-purple-700"
    }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">
                  Bine ai venit, {user?.name || "User"}! Iată stadiul proiectelor tale.
                </p>
              </div>
              
              <Button
                onClick={handleRequestProject}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Solicită Proiect Nou
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <h3 className="text-3xl font-bold">
                          {loading ? <Skeleton className="h-8 w-12" /> : stat.value}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mb-8 border-none shadow-md">
              <CardHeader>
                <CardTitle>Proiectele tale</CardTitle>
                <CardDescription>
                  Vizualizează lista proiectelor tale în lucru și cele finalizate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <Card key={item} className="h-[220px]">
                        <CardHeader className="pb-2">
                          <Skeleton className="h-5 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-2/3 mb-4" />
                          <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => navigate(`/project/${project.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Niciun proiect momentan</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Nu ai niciun proiect activ în acest moment. Solicită un proiect nou pentru a începe colaborarea.
                    </p>
                    <Button
                      onClick={handleRequestProject}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Solicită Proiect Nou
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Profil utilizator</CardTitle>
                <CardDescription>
                  Detaliile contului tău
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 text-white">
                    <UserRound className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">{user?.name || "Utilizator"}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    {user?.company && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Companie:</span> {user.company}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-auto">
                    <Button
                      variant="outline"
                      className="border-gray-300"
                      onClick={() => navigate("/dashboard/settings")}
                    >
                      Editează profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Dashboard;
