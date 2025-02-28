
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ProjectTask } from "@/types";
import { 
  Plus, 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  PenLine, 
  ClipboardList, 
  Trash2 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectTasksPanelProps {
  projectId: string;
  tasks: ProjectTask[] | null;
  loading?: boolean;
}

const ProjectTasksPanel = ({ projectId, tasks, loading = false }: ProjectTasksPanelProps) => {
  const [newTask, setNewTask] = useState("");
  
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    // In a real app, this would add the task to the database
    setNewTask("");
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-brand-500" />
          Sarcini de lucru
        </CardTitle>
        <Badge variant="outline" className="bg-brand-50">
          {tasks ? `${tasks.filter(t => t.isCompleted).length}/${tasks.length} finalizate` : '0/0'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Adaugă o sarcină nouă..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddTask} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          {!tasks || tasks.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <PlusCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-1">Nu există sarcini</h3>
              <p className="text-sm text-gray-400 mb-4">Adaugă prima sarcină pentru acest proiect</p>
              <Button className="bg-brand-600 hover:bg-brand-700">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă sarcină
              </Button>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start p-3 rounded-md border ${
                  task.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <Checkbox 
                  checked={task.isCompleted} 
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <p className={`${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Termen: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      {task.isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                          <span className="text-green-600">Finalizat</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>În așteptare</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PenLine className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasksPanel;
