import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTask } from "@/types";
import { 
  PlusCircle, 
  Trash2, 
  Loader2, 
  CalendarIcon, 
  CheckCircle2,
  ClipboardList, 
  AlertCircle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectTasksPanelProps {
  projectId: string;
  tasks?: ProjectTask[] | null;
  loading?: boolean;
  isAdmin?: boolean;
  onTasksUpdate?: (updatedTasks: ProjectTask[]) => void;
}

const ProjectTasksPanel = ({ 
  projectId, 
  tasks: initialTasks = null, 
  loading = false,
  isAdmin = false,
  onTasksUpdate
}: ProjectTasksPanelProps) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingTaskState, setLoadingTaskState] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);
  
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);
    setCompletionPercentage(percentage);
  }, [tasks]);
  
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      setIsAddingTask(true);
      
      const { data, error } = await supabase
        .from("project_tasks")
        .insert([
          {
            project_id: projectId,
            title: newTaskTitle,
            description: newTaskDescription,
            is_completed: false,
            created_by: 'system'
          },
        ])
        .select("*")
        .single();
        
      if (error) throw error;
      
      const newTask: ProjectTask = {
        id: data.id,
        projectId: data.project_id,
        title: data.title,
        description: data.description,
        isCompleted: data.is_completed,
        createdAt: data.created_at,
        createdBy: data.created_by || 'system'
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setShowAddForm(false);
      
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }
      
      toast.success("Task added successfully");
    } catch (error: any) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
      setError(error.message);
    } finally {
      setIsAddingTask(false);
    }
  };
  
  const handleToggleTask = async (taskId: string, currentState: boolean) => {
    try {
      setLoadingTaskState({ ...loadingTaskState, [taskId]: true });
      
      const { data, error } = await supabase
        .from("project_tasks")
        .update({ is_completed: !currentState })
        .eq("id", taskId)
        .select();
        
      if (error) throw error;
      
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !currentState } : task
      );
      
      setTasks(updatedTasks);
      
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }
      
    } catch (error: any) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task status");
    } finally {
      const newLoadingState = { ...loadingTaskState };
      delete newLoadingState[taskId];
      setLoadingTaskState(newLoadingState);
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoadingTaskState({ ...loadingTaskState, [taskId]: true });
      
      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", taskId);
        
      if (error) throw error;
      
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }
      
      toast.success("Task deleted successfully");
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      const newLoadingState = { ...loadingTaskState };
      delete newLoadingState[taskId];
      setLoadingTaskState(newLoadingState);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-7 w-[200px] mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-primary" />
            Tasks
          </CardTitle>
          
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <Progress value={completionPercentage} className="w-24" />
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
        
        {tasks.length === 0 && !showAddForm ? (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto opacity-20" />
            <p className="mt-2">No tasks yet</p>
            {(isAdmin) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start justify-between p-3 rounded-md ${
                  task.isCompleted
                    ? "bg-green-50 border border-green-100"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {loadingTaskState[task.id] ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() =>
                        handleToggleTask(task.id, task.isCompleted)
                      }
                      disabled={!isAdmin && task.isCompleted}
                    />
                  )}
                  
                  <div>
                    <div className="font-medium text-sm flex items-center">
                      {task.title}
                      {task.isCompleted && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    {task.createdAt && (
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={loadingTaskState[task.id]}
                  >
                    {loadingTaskState[task.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            ))}
            
            {showAddForm && (
              <div className="p-3 border border-dashed rounded-md bg-muted/50 space-y-3">
                <Input
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Task description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTaskTitle("");
                      setNewTaskDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim() || isAddingTask}
                  >
                    {isAddingTask ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Add Task
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {!showAddForm && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTasksPanel;
