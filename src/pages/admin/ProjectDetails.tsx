
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchProjectById, 
  fetchProjectNotes, 
  fetchProjectTasks, 
  fetchAdminNotes,
  addAdminNote,
  updateProject,
  uploadProjectFile, 
  fetchProjectFiles 
} from '@/integrations/supabase/client';
import { 
  Project, 
  ProjectNote, 
  ProjectTask, 
  AdminNote, 
  ProjectFile 
} from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { 
  Calendar, 
  File, 
  ListTodo, 
  MessageSquare, 
  PencilIcon, 
  StickyNote, 
  Upload, 
  Users, 
  FileIcon,
  FileTextIcon,
  PaperclipIcon,
  FilePresentationIcon,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingScreen from '@/components/LoadingScreen';
import { projectStatusOptions } from '@/lib/constants';

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | null>(null);
  const [projectNotes, setProjectNotes] = useState<ProjectNote[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [newAdminNote, setNewAdminNote] = useState<string>('');
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [savingChanges, setSavingChanges] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [amountDue, setAmountDue] = useState<number>(0);
  
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        // Fetch project data
        const fetchedProject = await fetchProjectById(id);
        if (!fetchedProject) {
          toast({
            title: 'Project not found',
            description: 'The project you are looking for does not exist or you do not have permission to view it.',
            variant: 'destructive',
          });
          navigate('/admin/projects');
          return;
        }
        
        setProject(fetchedProject);
        setFormData(fetchedProject);
        
        // Initialize payment values
        setAmountDue(fetchedProject.price || 0);
        setAmountPaid(fetchedProject.amountPaid || 0);
        setSelectedPaymentStatus(fetchedProject.paymentStatus || 'pending');
        
        try {
          // Fetch project notes
          const notes = await fetchProjectNotes(id);
          setProjectNotes(notes);
        } catch (error) {
          console.error('Error fetching project notes:', error);
        }
        
        try {
          // Fetch project tasks
          const tasks = await fetchProjectTasks(id);
          setProjectTasks(tasks);
        } catch (error) {
          console.error('Error fetching project tasks:', error);
        }
        
        try {
          // Fetch admin notes
          const adminNotesData = await fetchAdminNotes(id);
          setAdminNotes(adminNotesData);
        } catch (error) {
          console.error('Error fetching admin notes:', error);
        }
        
        try {
          // Fetch project files
          const files = await fetchProjectFiles(id);
          setProjectFiles(files);
        } catch (error) {
          console.error('Error fetching project files:', error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading project data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project data. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [id, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      if (!id || !project) return;
      
      setSavingChanges(true);
      
      // Update payment related fields
      const updatedData = {
        ...formData,
        paymentStatus: selectedPaymentStatus,
        amountPaid: amountPaid,
        price: amountDue + amountPaid, // Total price is amount due + amount paid
      };
      
      // Update project
      await updateProject(id, updatedData);
      
      // Update local state
      setProject({ ...project, ...updatedData });
      setEditMode(false);
      
      toast({
        title: 'Success',
        description: 'Project details have been updated.',
      });
      
      setSavingChanges(false);
      
      // Refresh data
      const updatedProject = await fetchProjectById(id);
      if (updatedProject) {
        setProject(updatedProject);
        setFormData(updatedProject);
        setAmountDue(updatedProject.price - (updatedProject.amountPaid || 0));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project details. Please try again.',
        variant: 'destructive',
      });
      setSavingChanges(false);
    }
  };
  
  const handleAddAdminNote = async () => {
    try {
      if (!id || !user || !newAdminNote.trim()) return;
      
      setSavingNote(true);
      
      // Check if this is a project request
      const isProjectRequest = id.startsWith('request_');
      
      // Add admin note
      await addAdminNote(id, newAdminNote, user.id);
      
      // Clear input and refresh notes
      setNewAdminNote('');
      const updatedNotes = await fetchAdminNotes(id);
      setAdminNotes(updatedNotes);
      
      toast({
        title: 'Note added',
        description: 'Your note has been added to the project.',
      });
      
      setSavingNote(false);
    } catch (error) {
      console.error('Error adding admin note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note. Please try again.',
        variant: 'destructive',
      });
      setSavingNote(false);
    }
  };
  
  const handleUploadFile = async () => {
    try {
      if (!id || !selectedFile) return;
      
      setUploadingFile(true);
      
      // Upload file
      const uploadedFile = await uploadProjectFile(id, selectedFile);
      
      // Update files list
      setProjectFiles([...projectFiles, uploadedFile]);
      setSelectedFile(null);
      
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully.',
      });
      
      setUploadingFile(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
      setUploadingFile(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">Project not found or you don't have permission to view it.</p>
        </div>
        <Button onClick={() => navigate('/admin/projects')}>Back to Projects</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Details</h1>
        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={savingChanges}>
                {savingChanges ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="details">
            <File className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="admin-notes">
            <MessageSquare className="h-4 w-4 mr-2" />
            Admin Notes
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="files">
            <Upload className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    {editMode ? (
                      <Input
                        id="title"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mt-1 text-lg">{project.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    {editMode ? (
                      <Select
                        value={formData.status || 'pending'}
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 capitalize">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status === 'in_progress' ? 'In Progress' : 
                           project.status === 'pending' ? 'Pending' : 
                           project.status}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price</Label>
                    {editMode ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 font-semibold">${project.price || 0}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    {editMode ? (
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 whitespace-pre-wrap">{project.description || 'No description'}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Created At</Label>
                    <p className="mt-1">
                      {project.createdAt ? format(new Date(project.createdAt), 'PPP') : 'Unknown'}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    {editMode ? (
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate ? formData.dueDate.slice(0, 10) : ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mt-1">
                        {project.dueDate ? format(new Date(project.dueDate), 'PPP') : 'Not set'}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        {editMode ? (
                          <Checkbox
                            id="hasEcommerce"
                            checked={formData.hasEcommerce || false}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('hasEcommerce', checked as boolean)
                            }
                          />
                        ) : (
                          <Checkbox id="hasEcommerce" checked={project.hasEcommerce || false} disabled />
                        )}
                        <Label htmlFor="hasEcommerce">E-commerce</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {editMode ? (
                          <Checkbox
                            id="hasCMS"
                            checked={formData.hasCMS || false}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('hasCMS', checked as boolean)
                            }
                          />
                        ) : (
                          <Checkbox id="hasCMS" checked={project.hasCMS || false} disabled />
                        )}
                        <Label htmlFor="hasCMS">CMS</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {editMode ? (
                          <Checkbox
                            id="hasSEO"
                            checked={formData.hasSEO || false}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('hasSEO', checked as boolean)
                            }
                          />
                        ) : (
                          <Checkbox id="hasSEO" checked={project.hasSEO || false} disabled />
                        )}
                        <Label htmlFor="hasSEO">SEO</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {editMode ? (
                          <Checkbox
                            id="hasMaintenance"
                            checked={formData.hasMaintenance || false}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('hasMaintenance', checked as boolean)
                            }
                          />
                        ) : (
                          <Checkbox id="hasMaintenance" checked={project.hasMaintenance || false} disabled />
                        )}
                        <Label htmlFor="hasMaintenance">Maintenance</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="websiteType">Website Type</Label>
                    {editMode ? (
                      <Select
                        value={formData.websiteType || ''}
                        onValueChange={(value) => handleSelectChange('websiteType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select website type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="portfolio">Portfolio</SelectItem>
                          <SelectItem value="informational">Informational</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 capitalize">{project.websiteType || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {projectNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No notes yet</p>
              ) : (
                <div className="space-y-4">
                  {projectNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg bg-muted/30">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(note.createdAt), 'PPp')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin-notes">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Textarea
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="Add an admin note..."
                  className="mb-2"
                  rows={3}
                />
                <Button 
                  onClick={handleAddAdminNote} 
                  disabled={!newAdminNote.trim() || savingNote}
                >
                  {savingNote ? 'Saving...' : 'Add Note'}
                </Button>
              </div>
              
              {adminNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No admin notes yet</p>
              ) : (
                <div className="space-y-4">
                  {adminNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg bg-blue-50">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(note.createdAt), 'PPp')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {projectTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tasks assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {projectTasks.map((task) => (
                    <div key={task.id} className="flex items-center p-3 border rounded-lg">
                      <Checkbox
                        checked={task.isCompleted}
                        disabled
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className={task.isCompleted ? 'line-through text-muted-foreground' : ''}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(task.createdAt), 'MMM d')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 border-b pb-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="fileUpload" className="mb-2 block">Upload New File</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                  <Button 
                    onClick={handleUploadFile} 
                    disabled={!selectedFile || uploadingFile}
                  >
                    {uploadingFile ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
              
              {projectFiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No files uploaded yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectFiles.map((file) => (
                    <div key={file.id} className="flex border rounded-lg p-3 items-center">
                      <div className="mr-3">
                        {file.fileType?.includes('image') ? (
                          <FileImage className="h-10 w-10 text-blue-500" />
                        ) : file.fileType?.includes('pdf') ? (
                          <FilePresentationIcon className="h-10 w-10 text-red-500" />
                        ) : (
                          <FileIcon className="h-10 w-10 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(file.uploadedAt), 'PPp')}
                        </p>
                      </div>
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Button variant="ghost" size="sm">
                          <FileTextIcon className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="totalPrice">Total Price</Label>
                    {editMode ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input
                          id="totalPrice"
                          name="price"
                          type="number"
                          value={formData.price || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-xl font-bold">${project.price || 0}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="amountPaid">Amount Paid</Label>
                    {editMode ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input
                          id="amountPaid"
                          type="number"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-green-600 font-semibold">
                        ${project.amountPaid || 0}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="amountDue">Amount Due</Label>
                    <p className="mt-1 text-red-600 font-semibold">
                      ${(project.price || 0) - (project.amountPaid || 0)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    {editMode ? (
                      <Select
                        value={selectedPaymentStatus}
                        onValueChange={setSelectedPaymentStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          project.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          project.paymentStatus === 'partial' ? 'bg-blue-100 text-blue-800' :
                          project.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.paymentStatus || 'Pending'}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Payment History</Label>
                    {project.paymentHistory && project.paymentHistory.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {project.paymentHistory.map((payment, index) => (
                          <div key={index} className="text-sm border-b pb-2">
                            <div className="flex justify-between">
                              <span>{format(new Date(payment.date), 'PP')}</span>
                              <span className="font-medium">${payment.amount}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payment.method}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No payment history available</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProjectDetails;
