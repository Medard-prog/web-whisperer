import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Edit, 
  FileText, 
  Check, 
  PanelTop, 
  ShoppingCart, 
  CalendarClock,
  BarChart3,
  Users,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from "@/components/ui/progress";

interface ProjectDetailsPanelProps {
  project: Project | null;
  loading: boolean;
  isAdmin?: boolean;
  onProjectUpdate?: (updatedProject: Project) => void;
  hideAdditionalInfo?: boolean;
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

const ProjectDetailsPanel = ({ 
  project, 
  loading, 
  isAdmin = false, 
  onProjectUpdate,
  hideAdditionalInfo = false
}: ProjectDetailsPanelProps) => {
  const [expandDescription, setExpandDescription] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="shadow-md border">
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
      <Card className="shadow-md border">
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

  const completionPercentage = getCompletionPercentage(project.status);
  const paymentPercentage = project.price > 0 ? Math.round((project.amountPaid || 0) / project.price * 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border border-gray-200 overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {project.websiteType || "Website"}
                </Badge>
                {project.hasCMS && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    CMS
                  </Badge>
                )}
                {project.hasEcommerce && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    E-commerce
                  </Badge>
                )}
                {project.hasSEO && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    SEO
                  </Badge>
                )}
                {project.hasMaintenance && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    Mentenanță
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm opacity-90">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Creat: {formatDate(project.createdAt)}
                </div>
                {project.dueDate && (
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    Termen: {formatDate(project.dueDate)}
                  </div>
                )}
              </div>
            </div>
            
            {isAdmin && (
              <Button 
                onClick={handleEditClick}
                variant="outline"
                size="sm"
                className="mt-4 md:mt-0 bg-white text-indigo-600 hover:bg-gray-100 border-transparent"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editează
              </Button>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-sm border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                        Status Proiect
                      </CardTitle>
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progres</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        Status Plată
                      </CardTitle>
                      {project.paymentStatus && (
                        <Badge className={paymentStatus.color}>
                          {paymentStatus.label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plătit</span>
                        <span className="font-medium">{paymentPercentage}%</span>
                      </div>
                      <Progress value={paymentPercentage} className="h-2" />
                      <div className="flex justify-between text-sm pt-1">
                        <span>{project.amountPaid || 0} RON</span>
                        <span>{project.price} RON</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Descriere Proiect
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

              {project.exampleUrls && project.exampleUrls.length > 0 && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <PanelTop className="h-4 w-4 mr-2 text-indigo-500" />
                      Website-uri de Referință
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {project.exampleUrls.map((url, index) => (
                        <li key={index} className="text-indigo-600 hover:underline">
                          <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {!hideAdditionalInfo && project.additionalInfo && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                      Informații Suplimentare
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">
                      {project.additionalInfo}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <Card className="shadow-sm border">
                <CardHeader className="pb-2 bg-gray-50">
                  <CardTitle className="text-base flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    Specificații Proiect
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Tip Website:</dt>
                      <dd className="font-medium">{project.websiteType || "Nespecificat"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Număr Pagini:</dt>
                      <dd className="font-medium">{project.pageCount || 0}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Complexitate:</dt>
                      <dd className="font-medium">{project.designComplexity || "Standard"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Preț Total:</dt>
                      <dd className="font-medium">{project.price.toLocaleString()} RON</dd>
                    </div>
                    {typeof project.amountPaid === 'number' && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Suma Plătită:</dt>
                        <dd className="font-medium">{project.amountPaid.toLocaleString()} RON</dd>
                      </div>
                    )}
                    <div className="pt-1 border-t">
                      <h4 className="font-medium mb-2">Funcționalități:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${project.hasCMS ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                          <span>CMS</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${project.hasEcommerce ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                          <span>E-commerce</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${project.hasSEO ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                          <span>SEO</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${project.hasMaintenance ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                          <span>Mentenanță</span>
                        </div>
                      </div>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="pb-2 bg-gray-50">
                  <CardTitle className="text-base flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                          <Check className="h-3 w-3" />
                        </div>
                        <div className="h-10 w-0.5 bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Creare Proiect</p>
                        <p className="text-xs text-gray-500">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`h-6 w-6 rounded-full ${project.status === 'in_progress' || project.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white text-xs`}>
                          {project.status === 'in_progress' || project.status === 'completed' ? <Check className="h-3 w-3" /> : '2'}
                        </div>
                        <div className="h-10 w-0.5 bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Începere Implementare</p>
                        <p className="text-xs text-gray-500">{project.status === 'in_progress' || project.status === 'completed' ? 'În progres' : 'În așteptare'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`h-6 w-6 rounded-full ${project.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white text-xs`}>
                          {project.status === 'completed' ? <Check className="h-3 w-3" /> : '3'}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Finalizare</p>
                        {project.dueDate ? (
                          <p className="text-xs text-gray-500">
                            {project.status === 'completed' ? 'Complet' : `Termen: ${formatDate(project.dueDate)}`}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">Termen nedefinit</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="websiteType">Tip Website</Label>
                  <Select
                    value={editedProject.websiteType || ''}
                    onValueChange={value => setEditedProject({...editedProject, websiteType: value})}
                  >
                    <SelectTrigger id="websiteType">
                      <SelectValue placeholder="Selectează tip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="designComplexity">Complexitate Design</Label>
                  <Select
                    value={editedProject.designComplexity || 'standard'}
                    onValueChange={value => setEditedProject({...editedProject, designComplexity: value})}
                  >
                    <SelectTrigger id="designComplexity">
                      <SelectValue placeholder="Selectează complexitate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pageCount">Număr Pagini</Label>
                <Input 
                  id="pageCount" 
                  type="number"
                  value={editedProject.pageCount || 1}
                  onChange={e => setEditedProject({...editedProject, pageCount: Number(e.target.value)})}
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

              <div className="grid gap-2">
                <Label htmlFor="additionalInfo">Informații Suplimentare</Label>
                <Textarea 
                  id="additionalInfo" 
                  value={editedProject.additionalInfo || ''}
                  onChange={e => setEditedProject({...editedProject, additionalInfo: e.target.value})}
                  rows={3}
                />
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
