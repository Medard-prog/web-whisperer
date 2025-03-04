
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProjectById, 
} from "@/integrations/supabase/client";
import { Project } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ModificationRequestsPanel from "@/components/ModificationRequestsPanel";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, RefreshCw, FileEdit } from "lucide-react";
import ModificationRequestDialog from "@/components/ModificationRequestDialog";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  
  useEffect(() => {
    if (!id) return;
    
    loadProjectData();
  }, [id]);
  
  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading project data for ID:", id);
      
      // Load project details
      const projectData = await fetchProjectById(id!);
      if (!projectData) {
        console.error("Project not found for ID:", id);
        throw new Error("Project not found. It may have been deleted or you don't have access to it.");
      }
      
      console.log("Project data loaded successfully:", projectData);
      setProject(projectData);
      
    } catch (err) {
      console.error("Error loading project data:", err);
      setError(err instanceof Error ? err.message : "Failed to load project data");
      toast.error("Error loading project data", {
        description: err instanceof Error ? err.message : "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    toast.success("Project updated successfully");
  };
  
  const handleChatNav = () => {
    if (id) {
      navigate(`/dashboard/project/${id}/chat`);
    }
  };

  const handleModificationRequestComplete = () => {
    // Reload modification requests when a new one is submitted
    if (activeTab === "modifications") {
      loadProjectData();
    } else {
      setActiveTab("modifications");
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {loading ? "Loading Project..." : project?.title || "Project Details"}
            </h1>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard/projects")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center text-red-800">
              <p className="font-medium text-xl mb-2">Error</p>
              <p className="mb-4">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2 gap-2" 
                onClick={() => loadProjectData()}
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="details">Detalii proiect</TabsTrigger>
                <TabsTrigger value="modifications">Cereri modificări</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <ProjectDetailsPanel 
                  project={project} 
                  loading={loading} 
                  onProjectUpdate={handleProjectUpdate}
                  hideAdditionalInfo={true}
                />
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    onClick={handleChatNav}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2 flex-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Mesaje
                  </Button>
                  
                  {user && id && (
                    <ModificationRequestDialog 
                      projectId={id} 
                      userId={user.id}
                      onRequestComplete={handleModificationRequestComplete}
                    >
                      <Button 
                        variant="outline"
                        className="gap-2 border-amber-500 text-amber-700 hover:bg-amber-50 flex-1"
                      >
                        <FileEdit className="h-4 w-4" />
                        Solicită modificări
                      </Button>
                    </ModificationRequestDialog>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="modifications">
                <ModificationRequestsPanel 
                  projectId={id!}
                  isAdmin={false}
                />
                
                {user && id && (
                  <div className="mt-6">
                    <ModificationRequestDialog 
                      projectId={id} 
                      userId={user.id}
                      onRequestComplete={handleModificationRequestComplete}
                    >
                      <Button 
                        className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <FileEdit className="h-4 w-4" />
                        Solicită o nouă modificare
                      </Button>
                    </ModificationRequestDialog>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default ProjectDetails;
