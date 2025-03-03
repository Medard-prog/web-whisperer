
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProjectById, 
  fetchProjectTasks, 
  fetchProjectNotes
} from "@/integrations/supabase/client";
import { Project, ProjectTask, ProjectNote, PaymentStatus } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import ProjectNotesPanel from "@/components/ProjectNotesPanel";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, RefreshCw } from "lucide-react";

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[] | null>(null);
  const [notes, setNotes] = useState<ProjectNote[] | null>(null);
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
      
      console.log("Admin: Loading project data for ID:", id);
      
      // Load project details
      const projectData = await fetchProjectById(id!);
      if (!projectData) {
        console.error("Admin: Project not found for ID:", id);
        throw new Error("Project not found. It may have been deleted.");
      }
      
      console.log("Admin: Project data loaded successfully:", projectData);
      setProject(projectData);
      
      // Load tasks
      try {
        const tasksData = await fetchProjectTasks(id!);
        setTasks(tasksData);
      } catch (tasksError) {
        console.error("Error loading tasks:", tasksError);
        // Don't fail the whole page for tasks
      }
      
      // Load notes
      try {
        const notesData = await fetchProjectNotes(id!);
        setNotes(notesData);
      } catch (notesError) {
        console.error("Error loading notes:", notesError);
        // Don't fail the whole page for notes
      }
      
    } catch (err) {
      console.error("Admin: Error loading project data:", err);
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
      navigate(`/admin/project/${id}/chat`);
    }
  };
  
  const handleNoteAdded = (newNote: ProjectNote) => {
    if (notes) {
      setNotes([newNote, ...notes]);
    } else {
      setNotes([newNote]);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-8 w-full">
          <div className="mx-auto max-w-full">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">
                {loading ? "Loading Project..." : project?.title || "Project Details"}
              </h1>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/admin/projects")}
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
              <div className="space-y-8">
                <ProjectDetailsPanel 
                  project={project} 
                  loading={loading} 
                  isAdmin={true}
                  onProjectUpdate={handleProjectUpdate}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ProjectTasksPanel 
                      projectId={id || ''} 
                      tasks={tasks} 
                      loading={loading} 
                      isAdmin={true}
                    />
                    
                    {/* Chat button */}
                    <Button 
                      onClick={handleChatNav}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Project Chat
                    </Button>
                  </div>
                  
                  <ProjectNotesPanel 
                    projectId={id || ''} 
                    userId={user?.id}
                    onNoteAdded={handleNoteAdded}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminProjectDetails;
