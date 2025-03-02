import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, fetchProjectTasks } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectTask, mapProjectTask } from "@/types";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { ListChecks, CheckCheck, Plus, Trash2 } from "lucide-react";

interface ProjectTasksPanelProps {
  projectId: string;
  tasks: ProjectTask[] | null;
  loading: boolean;
}

const ProjectTasksPanel = ({ projectId, tasks, loading }: ProjectTasksPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newTask, setNewTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>(tasks || []);
  
  useEffect(() => {
    setProjectTasks(tasks || []);
  }, [tasks]);
  
  const fetchTasks = async () => {
    try {
      const tasks = await fetchProjectTasks(projectId);
      setProjectTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-au putut încărca task-urile. Încearcă din nou.",
      });
    }
  };
  
  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const newTaskObj = {
        project_id: projectId,
        description: newTask,
        created_by: user?.id || '',
        is_completed: false,
      };
      
      const { data, error } = await supabase
        .from('project_tasks')
        .insert(newTaskObj)
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Use the mapper function to convert the snake_case response to camelCase
      const mappedTask = mapProjectTask(data);
      setProjectTasks(prev => [mappedTask, ...prev]);
      setNewTask("");
      
      toast({
        title: "Task adăugat",
        description: "Task-ul a fost adăugat cu succes.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut adăuga task-ul. Încearcă din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateTaskStatus = async (id: string, isCompleted: boolean) => {
    try {
      // Optimistically update the UI
      setProjectTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, isCompleted: isCompleted } : task
        )
      );
      
      const { error } = await supabase
        .from('project_tasks')
        .update({ is_completed: isCompleted })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Task actualizat",
        description: "Task-ul a fost actualizat cu succes.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      
      // Refetch tasks if there was an error
      fetchTasks();
      
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut actualiza task-ul. Încearcă din nou.",
      });
    }
  };
  
  const deleteTask = async (id: string) => {
    try {
      // Optimistically update the UI
      setProjectTasks(prev => prev.filter(task => task.id !== id));
      
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Task șters",
        description: "Task-ul a fost șters cu succes.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Refetch tasks if there was an error
      fetchTasks();
      
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut șterge task-ul. Încearcă din nou.",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-indigo-500" />
            Task-uri
          </CardTitle>
          <CardDescription>
            Gestionează task-urile proiectului
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Adaugă un task nou..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button 
                onClick={addTask} 
                disabled={isSubmitting || !newTask.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adaugă
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : projectTasks.length > 0 ? (
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.isCompleted}
                      onCheckedChange={(checked) => updateTaskStatus(task.id, !!checked)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-gray-800 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}
                    >
                      {task.description}
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md bg-gray-50">
              <CheckCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nu există task-uri pentru acest proiect</p>
              <p className="text-sm text-gray-400">Adaugă un task pentru a începe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectTasksPanel;
