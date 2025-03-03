
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProjectById, 
  fetchProjectTasks, 
  fetchProjectFiles 
} from "@/integrations/supabase/client";
import { Project, ProjectTask, ProjectFile } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, RefreshCw, FileEdit } from "lucide-react";
import ModificationRequestDialog from "@/components/ModificationRequestDialog";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[] | null>(null);
  const [files, setFiles] = useState<ProjectFile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      
      // Load tasks
      try {
        const tasksData = await fetchProjectTasks(id!);
        setTasks(tasksData);
      } catch (tasksError) {
        console.error("Error loading tasks:", tasksError);
        // Don't fail the whole page for tasks
      }
      
      // Load files
      try {
        const filesData = await fetchProjectFiles(id!);
        setFiles(filesData);
      } catch (filesError) {
        console.error("Error loading files:", filesError);
        // Don't fail the whole page for files
      }
      
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
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <ProjectDetailsPanel 
                    project={project} 
                    loading={loading} 
                    onProjectUpdate={handleProjectUpdate}
                  />
                  
                  <ProjectTasksPanel 
                    projectId={id || ''} 
                    tasks={tasks} 
                    loading={loading} 
                  />
                </div>
                
                <div className="space-y-8">
                  <div className="flex flex-col gap-4">
                    <Button 
                      onClick={handleChatNav}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2 w-full"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Mesaje
                    </Button>
                    
                    {user && id && (
                      <ModificationRequestDialog projectId={id} userId={user.id}>
                        <Button 
                          variant="outline"
                          className="gap-2 border-amber-500 text-amber-700 hover:bg-amber-50 w-full"
                        >
                          <FileEdit className="h-4 w-4" />
                          Solicită modificări
                        </Button>
                      </ModificationRequestDialog>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default ProjectDetails;
