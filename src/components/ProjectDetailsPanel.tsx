import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, DollarSign, Edit, FileText } from "lucide-react";
import { toast } from "sonner";

interface ProjectDetailsPanelProps {
  project: Project | null;
  loading: boolean;
  isAdmin?: boolean;
  onProjectUpdate?: (updatedProject: Project) => void;
}

const statusMap = {
  pending: {
    label: "În așteptare",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  in_progress: {
    label: "În progres",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  completed: {
    label: "Finalizat",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  cancelled: {
    label: "Anulat",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  new: {
    label: "Nou",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
};

const ProjectDetailsPanel = ({ project, loading, isAdmin = false, onProjectUpdate }: ProjectDetailsPanelProps) => {
  const [expandDescription, setExpandDescription] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }
  
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proiect negăsit</CardTitle>
          <CardDescription>
            Proiectul căutat nu există sau nu ai acces la el.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const status = statusMap[project.status as keyof typeof statusMap] || statusMap.pending;
  
  const handleEditClick = () => {
    setEditedProject({...project});
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = async () => {
    if (!editedProject) return;
    
    try {
      setSaving(true);
      
      console.log("Saving project updates:", editedProject);
      
      let { error } = await supabase
        .from('project_requests')
        .update({
          project_name: editedProject.title,
          description: editedProject.description,
          status: editedProject.status,
          price: editedProject.price,
          has_ecommerce: editedProject.hasEcommerce,
          has_cms: editedProject.hasCMS,
          has_seo: editedProject.hasSEO,
          has_maintenance: editedProject.hasMaintenance
        })
        .eq('id', editedProject.id);
        
      if (error) {
        console.log("Not found in project_requests, trying projects table...");
        const { error: projectsError } = await supabase
          .from('projects')
          .update({
            title: editedProject.title,
            description: editedProject.description,
            status: editedProject.status,
            price: editedProject.price,
            has_ecommerce: editedProject.hasEcommerce,
            has_cms: editedProject.hasCMS,
            has_seo: editedProject.hasSEO,
            has_maintenance: editedProject.hasMaintenance
          })
          .eq('id', editedProject.id);
          
        if (projectsError) {
          throw projectsError;
        }
      }
      
      if (onProjectUpdate) {
        onProjectUpdate(editedProject);
      }
      
      setShowEditDialog(false);
      toast.success("Proiect actualizat cu succes");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Eroare la actualizarea proiectului");
    } finally {
      setSaving(false);
    }
  };
  
  const getCompletionPercentage = (status: string) => {
    switch (status) {
      case 'new': return 0;
      case 'pending': return 10;
      case 'in_progress': return 50;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <Badge className={`ml-2 ${status.color}`}>{status.label}</Badge>
            </div>
            <CardDescription className="mt-1.5">
              Creat la {formatDate(project.createdAt)}
            </CardDescription>
          </div>
          {isAdmin && (
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-lg border bg-white p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-md p-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Data finalizare</p>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold pl-2">
                {project.dueDate ? formatDate(project.dueDate) : "Nespecificată"}
              </p>
              <div className="absolute top-0 right-0 h-full w-1.5 bg-purple-400"></div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg border bg-white p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-md p-2">
                    <Clock className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Stadiu</p>
                  </div>
                </div>
              </div>
              <div className="pl-2">
                <div className="flex items-center mt-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full max-w-32">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ 
                        width: `${getCompletionPercentage(project.status)}%`,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-semibold text-lg">
                    {getCompletionPercentage(project.status)}%
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1.5 bg-indigo-400"></div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg border bg-white p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-md p-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Preț</p>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold pl-2">{project.price.toLocaleString()} RON</p>
              <div className="absolute top-0 right-0 h-full w-1.5 bg-green-400"></div>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                Descriere proiect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={expandDescription ? "" : "max-h-32 overflow-hidden relative"}>
                <p className="text-gray-700">
                  {project.description}
                </p>
                {!expandDescription && project.description && project.description.length > 200 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>
              {project.description && project.description.length > 200 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandDescription(!expandDescription)}
                  className="mt-2"
                >
                  {expandDescription ? "Afișează mai puțin" : "Afișează mai mult"}
                </Button>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editare Proiect</DialogTitle>
          </DialogHeader>
          
          {editedProject && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titlu</Label>
                <Input 
                  id="title" 
                  value={editedProject.title}
                  onChange={e => setEditedProject({...editedProject, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea 
                  id="description" 
                  value={editedProject.description || ''}
                  onChange={e => setEditedProject({...editedProject, description: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  value={editedProject.status}
                  onChange={e => setEditedProject({...editedProject, status: e.target.value as any})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="new">Nou</option>
                  <option value="pending">În așteptare</option>
                  <option value="in_progress">În progres</option>
                  <option value="completed">Finalizat</option>
                  <option value="cancelled">Anulat</option>
                </select>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Procentaj finalizare: {getCompletionPercentage(editedProject.status)}%</p>
                  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${getCompletionPercentage(editedProject.status)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Preț (RON)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={editedProject.price}
                  onChange={e => setEditedProject({...editedProject, price: Number(e.target.value)})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="hasCMS" 
                    checked={editedProject.hasCMS || false}
                    onChange={e => setEditedProject({...editedProject, hasCMS: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="hasCMS">Include CMS</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="hasEcommerce" 
                    checked={editedProject.hasEcommerce || false}
                    onChange={e => setEditedProject({...editedProject, hasEcommerce: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="hasEcommerce">Include Ecommerce</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="hasSEO" 
                    checked={editedProject.hasSEO || false}
                    onChange={e => setEditedProject({...editedProject, hasSEO: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="hasSEO">Include SEO</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="hasMaintenance" 
                    checked={editedProject.hasMaintenance || false}
                    onChange={e => setEditedProject({...editedProject, hasMaintenance: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="hasMaintenance">Include Mentenanță</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Anulează
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
              disabled={saving}
            >
              {saving ? "Se salvează..." : "Salvează Modificările"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectDetailsPanel;
