
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectTask } from "@/types";
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
        
        setProject(data as Project);
        
        // If admin, fetch tasks
        if (isAdmin) {
          const { data: tasksData, error: tasksError } = await supabase
            .from('project_tasks')
            .select('*')
            .eq('project_id', id)
            .order('created_at', { ascending: false });
            
          if (tasksError) {
            throw tasksError;
          }
          
          setTasks(tasksData as ProjectTask[]);
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
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
                
                <Skeleton className="h-64 mt-8" />
              </div>
            ) : (
              <div className="space-y-6">
                <ProjectDetailsPanel 
                  project={project}
                  loading={loading}
                  isAdmin={isAdmin}
                />
                
                {isAdmin && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <ProjectTasksPanel
                        projectId={id || ''}
                        tasks={tasks}
                        loading={loading}
                      />
                    </div>
                    <div>
                      {/* Project notes panel would go here */}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default ProjectDetails;
