
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PlusCircleIcon, SendIcon, FileIcon, PaperclipIcon, PresentationIcon } from 'lucide-react';
import { fetchProjectById, updateProject, sendProjectMessage, uploadFile, addAdminNote, fetchAdminNotes, fetchProjectNotes, fetchProjectTasks, addProjectTask, fetchProjectMessages, fetchProjectFiles, uploadProjectFile } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Project, ProjectStatus, ProjectTask, ProjectNote, Message, AdminNote, ProjectFile, PaymentStatus } from '@/types';
import { toast } from 'sonner';
import { projectStatusOptions, paymentStatusOptions } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [newAdminNote, setNewAdminNote] = useState('');
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [clientNotes, setClientNotes] = useState<ProjectNote[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state for editing project details
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    status: 'pending' as ProjectStatus,
    price: 0,
    hasCMS: false,
    hasEcommerce: false,
    hasSEO: false,
    hasMaintenance: false,
    dueDate: '',
    websiteType: '',
    designComplexity: '',
    pageCount: 0,
    paymentStatus: 'pending' as PaymentStatus,
    amountPaid: 0
  });
  
  useEffect(() => {
    if (id && user) {
      loadProjectData();
    }
  }, [id, user]);
  
  const loadProjectData = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjectById(id!);
      if (projectData) {
        setProject(projectData);
        setFormState({
          title: projectData.title || '',
          description: projectData.description || '',
          status: projectData.status as ProjectStatus || 'pending',
          price: projectData.price || 0,
          hasCMS: projectData.hasCMS || false,
          hasEcommerce: projectData.hasEcommerce || false,
          hasSEO: projectData.hasSEO || false,
          hasMaintenance: projectData.hasMaintenance || false,
          dueDate: projectData.dueDate || '',
          websiteType: projectData.websiteType || '',
          designComplexity: projectData.designComplexity || '',
          pageCount: projectData.pageCount || 0,
          paymentStatus: projectData.paymentStatus as PaymentStatus || 'pending',
          amountPaid: projectData.amountPaid || 0
        });
        
        // Load tasks, notes, messages, and files
        const [tasksData, adminNotesData, clientNotesData, messagesData, filesData] = await Promise.all([
          fetchProjectTasks(id!),
          fetchAdminNotes(id!),
          fetchProjectNotes(id!),
          fetchProjectMessages(id!),
          fetchProjectFiles(id!)
        ]);
        
        setTasks(tasksData);
        setAdminNotes(adminNotesData);
        setClientNotes(clientNotesData);
        setMessages(messagesData);
        setFiles(filesData);
      } else {
        toast.error('Project not found');
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdminNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminNote.trim() || !user?.id) return;
    
    try {
      await addAdminNote(id!, newAdminNote, user.id);
      toast.success('Admin note added successfully');
      setNewAdminNote('');
      // Refresh admin notes
      const updatedNotes = await fetchAdminNotes(id!);
      setAdminNotes(updatedNotes);
    } catch (error) {
      console.error('Error adding admin note:', error);
      toast.error('Failed to add admin note');
    }
  };
  
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user?.id) return;
    
    try {
      await addProjectTask(id!, newTaskTitle, user.id);
      toast.success('Task added successfully');
      setNewTaskTitle('');
      // Refresh tasks
      const updatedTasks = await fetchProjectTasks(id!);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };
  
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !user?.id) return;
    
    try {
      let attachmentUrl = '';
      
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }
      
      await sendProjectMessage(
        id!,
        newMessage.trim() || 'Shared a file',
        user.id,
        true,
        attachmentUrl,
        selectedFile?.type
      );
      
      toast.success('Message sent successfully');
      setNewMessage('');
      setSelectedFile(null);
      
      // Refresh messages
      const updatedMessages = await fetchProjectMessages(id!);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  const handleProjectUpdate = async () => {
    if (!project) return;
    
    try {
      setIsUpdating(true);
      
      await updateProject(id!, {
        title: formState.title,
        description: formState.description,
        status: formState.status,
        price: formState.price,
        hasCMS: formState.hasCMS,
        hasEcommerce: formState.hasEcommerce,
        hasSEO: formState.hasSEO,
        hasMaintenance: formState.hasMaintenance,
        dueDate: formState.dueDate,
        websiteType: formState.websiteType,
        designComplexity: formState.designComplexity,
        pageCount: formState.pageCount,
        paymentStatus: formState.paymentStatus,
        amountPaid: formState.amountPaid
      });
      
      // Update local state
      setProject({
        ...project,
        title: formState.title,
        description: formState.description,
        status: formState.status,
        price: formState.price,
        hasCMS: formState.hasCMS,
        hasEcommerce: formState.hasEcommerce,
        hasSEO: formState.hasSEO,
        hasMaintenance: formState.hasMaintenance,
        dueDate: formState.dueDate,
        websiteType: formState.websiteType,
        designComplexity: formState.designComplexity,
        pageCount: formState.pageCount,
        paymentStatus: formState.paymentStatus,
        amountPaid: formState.amountPaid
      });
      
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      const file = e.target.files[0];
      const projectFile = await uploadProjectFile(id!, file);
      
      toast.success('File uploaded successfully');
      
      // Refresh files
      const updatedFiles = await fetchProjectFiles(id!);
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading project details...</div>;
  }
  
  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-gray-500">Project ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={project.status === 'completed' ? 'default' : 
                          project.status === 'in_progress' ? 'secondary' : 
                          project.status === 'cancelled' ? 'destructive' : 
                          'outline'}>
            {project.status.replace('_', ' ')}
          </Badge>
          <Badge variant={project.paymentStatus === 'paid' ? 'default' : 
                          project.paymentStatus === 'partial' ? 'secondary' : 
                          project.paymentStatus === 'overdue' ? 'destructive' : 
                          'outline'}>
            {project.paymentStatus || 'pending'}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input 
                    id="title" 
                    value={formState.title} 
                    onChange={(e) => setFormState({...formState, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formState.status} 
                    onValueChange={(value) => setFormState({...formState, status: value as ProjectStatus})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formState.price} 
                    onChange={(e) => setFormState({...formState, price: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid ($)</Label>
                  <Input 
                    id="amountPaid" 
                    type="number" 
                    value={formState.amountPaid} 
                    onChange={(e) => setFormState({...formState, amountPaid: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select 
                    value={formState.paymentStatus} 
                    onValueChange={(value) => setFormState({...formState, paymentStatus: value as PaymentStatus})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.dueDate ? format(new Date(formState.dueDate), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formState.dueDate ? new Date(formState.dueDate) : undefined}
                        onSelect={(date) => {
                          setFormState({...formState, dueDate: date ? date.toISOString() : ''});
                          setDueDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formState.description} 
                    onChange={(e) => setFormState({...formState, description: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasCMS" 
                      checked={formState.hasCMS} 
                      onCheckedChange={(checked) => setFormState({...formState, hasCMS: checked === true})}
                    />
                    <label htmlFor="hasCMS" className="cursor-pointer">CMS</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasEcommerce" 
                      checked={formState.hasEcommerce} 
                      onCheckedChange={(checked) => setFormState({...formState, hasEcommerce: checked === true})}
                    />
                    <label htmlFor="hasEcommerce" className="cursor-pointer">E-commerce</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasSEO" 
                      checked={formState.hasSEO} 
                      onCheckedChange={(checked) => setFormState({...formState, hasSEO: checked === true})}
                    />
                    <label htmlFor="hasSEO" className="cursor-pointer">SEO</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasMaintenance" 
                      checked={formState.hasMaintenance} 
                      onCheckedChange={(checked) => setFormState({...formState, hasMaintenance: checked === true})}
                    />
                    <label htmlFor="hasMaintenance" className="cursor-pointer">Maintenance</label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteType">Website Type</Label>
                  <Input 
                    id="websiteType" 
                    value={formState.websiteType} 
                    onChange={(e) => setFormState({...formState, websiteType: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designComplexity">Design Complexity</Label>
                  <Input 
                    id="designComplexity" 
                    value={formState.designComplexity} 
                    onChange={(e) => setFormState({...formState, designComplexity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageCount">Page Count</Label>
                  <Input 
                    id="pageCount" 
                    type="number" 
                    value={formState.pageCount} 
                    onChange={(e) => setFormState({...formState, pageCount: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleProjectUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTaskSubmit} className="flex space-x-2 mb-4">
                <Input 
                  placeholder="Add a new task..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Button type="submit">Add</Button>
              </form>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div key={task.id} className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <p className={task.isCompleted ? "line-through text-gray-500" : ""}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Checkbox 
                          checked={task.isCompleted} 
                          // Placeholder as actual completion functionality would be added here
                          onCheckedChange={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No tasks yet.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminNoteSubmit} className="space-y-4 mb-4">
                <Textarea 
                  placeholder="Add a private note (only visible to admin)..." 
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button type="submit">Add Note</Button>
                </div>
              </form>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {adminNotes.map(note => (
                    <div key={note.id} className="p-4 border rounded-md">
                      <p>{note.content}</p>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>By: {note.createdBy || 'Admin'}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {adminNotes.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No admin notes yet.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${message.isAdmin ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{message.isAdmin ? 'A' : 'C'}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {message.isAdmin ? 'Admin' : 'Client'}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.attachmentUrl && (
                          <a 
                            href={message.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center mt-2 text-xs text-blue-600 hover:underline"
                          >
                            <FileIcon className="h-4 w-4 mr-1" />
                            View Attachment
                          </a>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No messages yet.</p>
                  )}
                </div>
              </ScrollArea>
              
              <form onSubmit={handleMessageSubmit} className="space-y-2">
                <Textarea 
                  placeholder="Type your message here..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <div className="flex items-center">
                        <PaperclipIcon className="h-5 w-5 text-gray-500" />
                        <span className="ml-1">
                          {selectedFile ? selectedFile.name : 'Attach file'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <Button type="submit">
                    <SendIcon className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block mb-2">Upload File</label>
                <div className="flex">
                  <input
                    type="file"
                    className="hidden"
                    id="fileUpload"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="fileUpload" 
                    className="cursor-pointer flex-1 mr-2 px-4 py-2 border border-dashed rounded-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    <span>Upload new file</span>
                  </label>
                </div>
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {files.map(file => (
                    <a 
                      key={file.id} 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{file.filename}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                  {files.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No files uploaded yet.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
