
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
import { updateProject, updateProjectStatus, updatePaymentStatus } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

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
  
  const statusOptions = [
    { value: 'new', label: 'Nou' },
    { value: 'pending', label: 'În așteptare' },
    { value: 'in_progress', label: 'În lucru' },
    { value: 'completed', label: 'Finalizat' },
    { value: 'cancelled', label: 'Anulat' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'În așteptare' },
    { value: 'partial', label: 'Parțial' },
    { value: 'paid', label: 'Plătit' },
    { value: 'overdue', label: 'Întârziat' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <Label className="font-medium text-gray-700">Status Proiect</Label>
                    <Select
                      value={project?.status || 'pending'}
                      onValueChange={async (value) => {
                        if (project?.id) {
                          const updatedProject = await updateProjectStatus(project.id, value);
                          if (updatedProject) {
                            handleProjectUpdate(updatedProject);
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selectează status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow">
                    <Label className="font-medium text-gray-700">Status Plată</Label>
                    <Select
                      value={project?.paymentStatus || 'pending'}
                      onValueChange={async (value: string) => {
                        if (project?.id) {
                          const updatedProject = await updateProject(project.id, {
                            ...project,
                            paymentStatus: value as PaymentStatus
                          });
                          if (updatedProject) {
                            handleProjectUpdate(updatedProject);
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selectează status plată" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow">
                    <Label className="font-medium text-gray-700">Data Finalizare</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full mt-2 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {project?.dueDate ? 
                            format(new Date(project.dueDate), 'PPP', { locale: ro }) : 
                            'Selectează data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={project?.dueDate ? new Date(project.dueDate) : undefined}
                          onSelect={async (date) => {
                            if (project?.id && date) {
                              const updatedProject = await updateProject(project.id, {
                                ...project,
                                dueDate: date.toISOString()
                              });
                              if (updatedProject) {
                                handleProjectUpdate(updatedProject);
                              }
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <Label className="font-medium text-gray-700">Preț (€)</Label>
                    <Input 
                      type="number" 
                      className="mt-2"
                      value={project?.price || 0}
                      onChange={async (e) => {
                        if (project?.id) {
                          const updatedProject = await updateProject(project.id, {
                            ...project,
                            price: parseFloat(e.target.value) || 0
                          });
                          if (updatedProject) {
                            handleProjectUpdate(updatedProject);
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow">
                    <Label className="font-medium text-gray-700">Sumă Plătită (€)</Label>
                    <Input 
                      type="number" 
                      className="mt-2"
                      value={project?.amountPaid || 0}
                      onChange={async (e) => {
                        if (project?.id) {
                          const updatedProject = await updateProject(project.id, {
                            ...project,
                            amountPaid: parseFloat(e.target.value) || 0
                          });
                          if (updatedProject) {
                            handleProjectUpdate(updatedProject);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-white rounded-lg shadow">
                  <Label className="font-medium text-gray-700">Descriere Proiect</Label>
                  <Textarea 
                    className="mt-2"
                    value={project?.description || ''}
                    rows={4}
                    onChange={async (e) => {
                      if (project?.id) {
                        const updatedProject = await updateProject(project.id, {
                          ...project,
                          description: e.target.value
                        });
                        if (updatedProject) {
                          handleProjectUpdate(updatedProject);
                        }
                      }
                    }}
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
