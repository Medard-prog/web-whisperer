
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProjects, fetchProjectRequests } from "@/integrations/supabase/client";
import { Project } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { SearchIcon, PlusCircle, FolderKanban } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch all projects (without user filter for admin)
        const regularProjects = await fetchProjects();
        const projectRequests = await fetchProjectRequests();
        
        // Combine and sort by date
        const allProjects = [...regularProjects, ...projectRequests].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setProjects(allProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Eroare la încărcarea proiectelor", {
          description: "Încercați din nou mai târziu"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Toate Proiectele</h1>
              <p className="text-gray-600">
                Gestionează toate proiectele și cererile clienților
              </p>
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Caută proiecte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[260px]"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Proiect Nou
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Se încarcă proiectele...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderKanban className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {searchTerm ? "Nu s-au găsit proiecte" : "Nu există proiecte"}
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {searchTerm 
                    ? `Nu s-au găsit proiecte pentru "${searchTerm}". Încercați alte cuvinte cheie.` 
                    : "Nu există proiecte în sistem momentan."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => navigate(`/admin/project/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminProjects;
