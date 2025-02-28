
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import ProjectNotesPanel from "@/components/ProjectNotesPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/PageTransition";
import { Project, ProjectTask, ProjectNote, mapProject, mapProjectTask, mapProjectNote } from "@/types";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[] | null>(null);
  const [notes, setNotes] = useState<ProjectNote[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      loadProjectData(id);
    }
  }, [id]);
  
  const loadProjectData = async (projectId: string) => {
    try {
      setLoading(true);
      
      // Fetch project data
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (projectError) throw projectError;
      if (!projectData) throw new Error("Project not found");
      
      // Fetch project tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (tasksError) throw tasksError;
      
      // Fetch project notes (only for admins)
      let notesData = null;
      if (user?.isAdmin) {
        const { data, error: notesError } = await supabase
          .from('project_notes')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
          
        if (notesError) throw notesError;
        notesData = data;
      }
      
      // Map the data to our types
      setProject(mapProject(projectData));
      setTasks(tasksData.map(mapProjectTask));
      setNotes(notesData ? notesData.map(mapProjectNote) : null);
      
    } catch (error) {
      console.error("Error loading project data:", error);
      toast.error("Eroare la încărcarea datelor proiectului");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={user?.isAdmin} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{loading ? "Încărcare proiect..." : project?.title}</h1>
                  <p className="text-gray-500">Detalii despre proiect și stadiul acestuia</p>
                </div>
              </div>
              
              {user?.isAdmin && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adaugă Task
                </Button>
              )}
            </div>
            
            <ProjectDetailsPanel project={project} loading={loading} isAdmin={user?.isAdmin} />
            
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Sarcini</TabsTrigger>
                {user?.isAdmin && (
                  <TabsTrigger value="notes">Note Private</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="tasks">
                <ProjectTasksPanel
                  projectId={id || ""}
                  tasks={tasks}
                  loading={loading}
                />
              </TabsContent>
              
              {user?.isAdmin && (
                <TabsContent value="notes">
                  <ProjectNotesPanel projectId={id || ""} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default ProjectDetails;
