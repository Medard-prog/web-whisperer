
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, fetchProjectTasks, addProjectTask, createProjectTask } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectTask, mapProjectTask } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from "lucide-react";

interface ProjectTasksPanelProps {
  projectId: string;
  tasks: ProjectTask[] | null;
  loading: boolean;
}

const ProjectTasksPanel = ({ projectId, tasks: initialTasks, loading: initialLoading }: ProjectTasksPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(initialLoading);
  const [tasks, setTasks] = useState<ProjectTask[] | null>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    } else if (projectId && !initialLoading) {
      // If tasks weren't provided but we have a projectId, load them
      loadTasks();
    }
  }, [initialTasks, projectId, initialLoading]);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await fetchProjectTasks(projectId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-au putut încărca sarcinile. Încearcă din nou.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addTask = async () => {
    if (!newTaskTitle.trim() || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Using the correct function name from our exports
      const newTask = await addProjectTask(projectId, newTaskTitle, user.id);
      setTasks(prev => prev ? [newTask, ...prev] : [newTask]);
      setNewTaskTitle("");
      
      toast({
        title: "Sarcină adăugată",
        description: "Sarcina a fost adăugată cu succes.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut adăuga sarcina. Încearcă din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      // Optimistically update the UI
      setTasks(prev => 
        prev ? prev.map(task => 
          task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
        ) : null
      );
      
      const { error } = await supabase
        .from('project_tasks')
        .update({ is_completed: !isCompleted })
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling task:', error);
      
      // Revert the change if there was an error
      setTasks(prev => 
        prev ? prev.map(task => 
          task.id === taskId ? { ...task, isCompleted: isCompleted } : task
        ) : null
      );
      
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut actualiza sarcina. Încearcă din nou.",
      });
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      // Optimistically update the UI
      setTasks(prev => prev ? prev.filter(task => task.id !== taskId) : null);
      
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Sarcină ștearsă",
        description: "Sarcina a fost ștearsă cu succes.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Refetch tasks if there was an error
      loadTasks();
      
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut șterge sarcina. Încearcă din nou.",
      });
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-purple-500" />
            Sarcini proiect
          </CardTitle>
          <CardDescription>
            Gestionează sarcinile asociate acestui proiect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Adaugă o sarcină nouă..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button 
              onClick={addTask} 
              disabled={isSubmitting || !newTaskTitle.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tasks && tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 border rounded-md flex items-start gap-3 ${
                    task.isCompleted ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task.id, task.isCompleted)}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Termen: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Circle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nu există sarcini pentru acest proiect</p>
              <p className="text-sm text-gray-400">Adaugă o sarcină nouă pentru a începe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectTasksPanel;
