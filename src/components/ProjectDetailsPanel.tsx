
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
import { Project, PaymentStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { updateProject } from "@/integrations/supabase/client";
import { Calendar, Clock, DollarSign, Edit, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const paymentStatusMap = {
  pending: {
    label: "În așteptare",
    color: "bg-yellow-100 text-yellow-800"
  },
  partial: {
    label: "Parțial",
    color: "bg-blue-100 text-blue-800"
  },
  paid: {
    label: "Plătit",
    color: "bg-green-100 text-green-800"
  },
  overdue: {
    label: "Întârziat",
    color: "bg-red-100 text-red-800"
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
  const paymentStatus = project.paymentStatus ? 
    (paymentStatusMap[project.paymentStatus as keyof typeof paymentStatusMap] || paymentStatusMap.pending) : 
    paymentStatusMap.pending;
  
  const handleEditClick = () => {
    setEditedProject({...project});
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = async () => {
    if (!editedProject) return;
    
    try {
      setSaving(true);
      
      console.log("Saving project updates:", editedProject);
      
      const updatedProject = await updateProject(editedProject.id, editedProject);
      
      if (onProjectUpdate && updatedProject) {
        onProjectUpdate(updatedProject);
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
              {project.paymentStatus && (
                <Badge className={`ml-2 ${paymentStatus.color}`}>{paymentStatus.label}</Badge>
              )}
            </div>
            <CardDescription className="mt-1.5">
              Creat la {formatDate(project.createdAt)}
              {project.dueDate && (
                <span className="ml-2 text-muted-foreground">• Termen: {formatDate(project.dueDate)}</span>
              )}
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
        <CardContent>
          {/* Redesigned space-y-6 div */}
          <div className="space-y-6">
            {/* Project summary with responsive cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Project Details Card */}
              <Card className="overflow-hidden border shadow-sm hover:shadow transition-shadow bg-gradient-to-br from-white to-purple-50">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                  <div className="flex items-center text-white">
                    <FileText className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Detalii Proiect</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tip Website</p>
                      <p className="font-medium">{project.websiteType || "Nespecificat"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Număr Pagini</p>
                      <p className="font-medium">{project.pageCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Complexitate</p>
                      <p className="font-medium">{project.designComplexity || "Standard"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Card */}
              <Card className="overflow-hidden border shadow-sm hover:shadow transition-shadow bg-gradient-to-br from-white to-indigo-50">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3">
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Stadiu Proiect</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {getCompletionPercentage(project.status)}%
                      </span>
                      {project.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" /> Finalizat
                        </Badge>
                      )}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ 
                          width: `${getCompletionPercentage(project.status)}%`,
                          transition: 'width 0.5s ease-in-out'
                        }}
                      ></div>
                    </div>
                    {project.dueDate && (
                      <div className="pt-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Termen: {formatDate(project.dueDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Price Card */}
              <Card className="overflow-hidden border shadow-sm hover:shadow transition-shadow bg-gradient-to-br from-white to-green-50">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
                  <div className="flex items-center text-white">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Detalii Financiare</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Preț Total</p>
                      <p className="text-lg font-semibold">{project.price.toLocaleString()} RON</p>
                    </div>
                    {typeof project.amountPaid === 'number' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Plătit</p>
                          <p className="font-medium">{project.amountPaid.toLocaleString()} RON</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ 
                              width: `${project.price > 0 ? (project.amountPaid / project.price) * 100 : 0}%`,
                              transition: 'width 0.5s ease-in-out'
                            }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Description Card */}
            <Card className="border shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-2 bg-gray-50">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  Descriere proiect
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className={expandDescription ? "" : "max-h-32 overflow-hidden relative"}>
                  <p className="text-gray-700 whitespace-pre-line">
                    {project.description || "Nu există o descriere pentru acest proiect."}
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
            
            {/* Project Features */}
            {(project.hasCMS || project.hasEcommerce || project.hasSEO || project.hasMaintenance) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.hasCMS && (
                  <Badge variant="outline" className="py-2 px-3 justify-center">CMS</Badge>
                )}
                {project.hasEcommerce && (
                  <Badge variant="outline" className="py-2 px-3 justify-center">E-commerce</Badge>
                )}
                {project.hasSEO && (
                  <Badge variant="outline" className="py-2 px-3 justify-center">SEO</Badge>
                )}
                {project.hasMaintenance && (
                  <Badge variant="outline" className="py-2 px-3 justify-center">Mentenanță</Badge>
                )}
              </div>
            )}
          </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status Proiect</Label>
                  <Select
                    value={editedProject.status}
                    onValueChange={value => setEditedProject({...editedProject, status: value as any})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selectează status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nou</SelectItem>
                      <SelectItem value="pending">În așteptare</SelectItem>
                      <SelectItem value="in_progress">În progres</SelectItem>
                      <SelectItem value="completed">Finalizat</SelectItem>
                      <SelectItem value="cancelled">Anulat</SelectItem>
                    </SelectContent>
                  </Select>
                  
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
                  <Label htmlFor="paymentStatus">Status Plată</Label>
                  <Select
                    value={editedProject.paymentStatus || 'pending'}
                    onValueChange={value => setEditedProject({...editedProject, paymentStatus: value as PaymentStatus})}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Selectează status plată" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">În așteptare</SelectItem>
                      <SelectItem value="partial">Parțial</SelectItem>
                      <SelectItem value="paid">Plătit</SelectItem>
                      <SelectItem value="overdue">Întârziat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preț (RON)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={editedProject.price}
                    onChange={e => setEditedProject({...editedProject, price: Number(e.target.value)})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="amountPaid">Sumă Plătită (RON)</Label>
                  <Input 
                    id="amountPaid" 
                    type="number"
                    value={editedProject.amountPaid || 0}
                    onChange={e => setEditedProject({...editedProject, amountPaid: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Data Finalizare</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={editedProject.dueDate ? new Date(editedProject.dueDate).toISOString().split('T')[0] : ''}
                  onChange={e => setEditedProject({...editedProject, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
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
