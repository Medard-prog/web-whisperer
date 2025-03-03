
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, fetchProjectNotes, fetchProjectTasks } from "@/integrations/supabase/client";
import { Project, ProjectNote, ProjectTask } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectNotesPanel from "@/components/ProjectNotesPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import ModificationRequestsPanel from "@/components/ModificationRequestsPanel";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, RefreshCw } from "lucide-react";

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
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
      
      // Load project details
      const projectData = await fetchProjectById(id!);
      if (!projectData) {
        throw new Error("Project not found");
      }
      setProject(projectData);
      
      // Load project notes
      const notesData = await fetchProjectNotes(id!);
      setNotes(notesData);
      
      // Load project tasks
      const tasksData = await fetchProjectTasks(id!);
      setTasks(tasksData);
      
    } catch (err) {
      console.error("Error loading project data:", err);
      setError(err instanceof Error ? err.message : "Failed to load project data");
      toast.error("Error loading project data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    toast.success("Project updated successfully");
  };
  
  const handleNotesUpdate = (updatedNotes: ProjectNote[]) => {
    setNotes(updatedNotes);
  };
  
  const handleTasksUpdate = (updatedTasks: ProjectTask[]) => {
    setTasks(updatedTasks);
  };
  
  const handleChatNav = () => {
    if (id) {
      navigate(`/admin/project/${id}/chat`);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {loading ? "Loading Project..." : project?.title || "Project Details"}
            </h1>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/projects")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              
              <Button
                onClick={handleChatNav}
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
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
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="modifications">Cereri modificări</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <ProjectDetailsPanel 
                  project={project} 
                  loading={loading} 
                  onProjectUpdate={handleProjectUpdate}
                  isAdmin={true}
                />
              </TabsContent>
              
              <TabsContent value="notes">
                <ProjectNotesPanel 
                  projectId={id!} 
                  notes={notes} 
                  loading={loading}
                  onNotesUpdate={handleNotesUpdate}
                  isAdmin={true}
                />
              </TabsContent>
              
              <TabsContent value="tasks">
                <ProjectTasksPanel 
                  projectId={id!} 
                  tasks={tasks} 
                  loading={loading}
                  onTasksUpdate={handleTasksUpdate}
                  isAdmin={true}
                />
              </TabsContent>
              
              <TabsContent value="modifications">
                <ModificationRequestsPanel 
                  projectId={id!}
                  isAdmin={true}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminProjectDetails;
