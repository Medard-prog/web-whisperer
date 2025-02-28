
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, fetchProjectTasks } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectTask, mapProject } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import ProjectNotesPanel from "@/components/ProjectNotesPanel";
import PageTransition from "@/components/PageTransition";

interface ProjectDetailsProps {
  isAdmin?: boolean;
}

const ProjectDetails = ({ isAdmin = false }: ProjectDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[] | null>(null);
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProject(mapProject(data));
        
        // If admin, fetch tasks
        if (isAdmin) {
          const projectTasks = await fetchProjectTasks(id);
          setTasks(projectTasks);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca detaliile proiectului. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [id, isAdmin, toast]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={isAdmin} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6 max-w-7xl mx-auto">
            <ProjectDetailsPanel 
              project={project}
              loading={loading}
              isAdmin={isAdmin}
            />
            
            {isAdmin ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProjectTasksPanel
                    projectId={id || ''}
                    tasks={tasks}
                    loading={loading}
                  />
                </div>
                <div>
                  <ProjectNotesPanel projectId={id || ''} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {/* User-specific content for project details could go here */}
              </div>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default ProjectDetails;
