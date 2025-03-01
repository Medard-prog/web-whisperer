
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProjects,
  fetchProjectRequests,
  fetchProjectTasks, 
  fetchProjectNotes,
  fetchProjectMessages,
  fetchAdminNotes,
  fetchProjectFiles,
  sendProjectMessage,
  addAdminNote,
  uploadProjectFile
} from "@/integrations/supabase/client";
import { Project, ProjectTask, ProjectNote, Message, ProjectFile, AdminNote } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectTasksPanel from "@/components/ProjectTasksPanel";
import ProjectNotesPanel from "@/components/ProjectNotesPanel";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  ArrowLeft,
  FileText,
  MessageSquare,
  CheckSquare,
  Settings,
  StickyNote,
  FilePlus,
  Paperclip
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminNote, setNewAdminNote] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  
  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const regularProjects = await fetchProjects();
        const projectRequests = await fetchProjectRequests();
        
        const allProjects = [...regularProjects, ...projectRequests];
        const foundProject = allProjects.find(p => p.id === id);
        
        if (!foundProject) {
          toast.error("Proiectul nu a fost găsit");
          navigate("/admin/projects");
          return;
        }
        
        setProject(foundProject);
        
        if (foundProject) {
          const projectTasks = await fetchProjectTasks(id);
          const projectNotes = await fetchProjectNotes(id);
          const projectMessages = await fetchProjectMessages(id);
          
          try {
            const adminProjectNotes = await fetchAdminNotes(id);
            setAdminNotes(adminProjectNotes);
            
            // Try to fetch project files, but handle gracefully if the table doesn't exist
            try {
              const files = await fetchProjectFiles(id, true);
              setProjectFiles(files);
            } catch (fileError) {
              console.warn("Project files functionality might not be available:", fileError);
              setProjectFiles([]);
            }
          } catch (error) {
            console.error("Error fetching admin data:", error);
          }
          
          setTasks(projectTasks);
          setNotes(projectNotes);
          setMessages(projectMessages);
        }
      } catch (error) {
        console.error("Error loading project data:", error);
        toast.error("Eroare la încărcarea datelor proiectului");
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [id, navigate]);
  
  const handleAddAdminNote = async () => {
    if (!id || !user || !newAdminNote.trim()) return;
    
    try {
      await addAdminNote(id, newAdminNote, user.id);
      
      const refreshedNotes = await fetchAdminNotes(id);
      setAdminNotes(refreshedNotes);
      
      setNewAdminNote("");
      toast.success("Notă adăugată cu succes");
    } catch (error) {
      console.error("Error adding admin note:", error);
      toast.error("Eroare la adăugarea notei");
    }
  };
  
  const handleSendMessage = async () => {
    if (!id || !user || !newMessage.trim()) return;
    
    try {
      await sendProjectMessage(id, newMessage, user.id, true);
      
      const refreshedMessages = await fetchProjectMessages(id);
      setMessages(refreshedMessages);
      
      setNewMessage("");
      toast.success("Mesaj trimis cu succes");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Eroare la trimiterea mesajului");
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    try {
      setUploadingFile(true);
      
      // Try to upload the file, but handle gracefully if the table doesn't exist
      try {
        await uploadProjectFile(id, file, user.id, true);
        
        // Try to refresh the file list
        try {
          const refreshedFiles = await fetchProjectFiles(id, true);
          setProjectFiles(refreshedFiles);
        } catch (refreshError) {
          console.warn("Could not refresh project files:", refreshError);
        }
        
        toast.success("Fișier încărcat cu succes");
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast.error("Eroare la încărcarea fișierului");
      }
    } finally {
      setUploadingFile(false);
      event.target.value = "";
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar isAdmin={true} />
        <div className="flex-1 p-6 lg:p-10">
          <div className="text-center py-12">
            <p>Se încarcă detaliile proiectului...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar isAdmin={true} />
        <div className="flex-1 p-6 lg:p-10">
          <div className="text-center py-12">
            <p>Proiectul nu a fost găsit</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/admin/projects")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la proiecte
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate("/admin/projects")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-1">{project.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>
                    Creat la {format(new Date(project.createdAt), "dd MMM yyyy")}
                  </span>
                  <span className="mx-2">•</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${project.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                    ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${project.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    ${project.status === 'new' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {project.status === 'completed' && 'Finalizat'}
                    {project.status === 'in_progress' && 'În progres'}
                    {project.status === 'pending' && 'În așteptare'}
                    {project.status === 'cancelled' && 'Anulat'}
                    {project.status === 'new' && 'Nou'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toast.info("Funcționalitate în dezvoltare")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Editează
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="mb-8">
              <TabsTrigger value="details" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Detalii</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                <span>Sarcini</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Mesaje Client</span>
              </TabsTrigger>
              <TabsTrigger value="admin-notes" className="flex items-center gap-1">
                <StickyNote className="h-4 w-4" />
                <span>Note Admin</span>
              </TabsTrigger>
              <TabsTrigger value="admin-files" className="flex items-center gap-1">
                <FilePlus className="h-4 w-4" />
                <span>Fișiere Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ProjectDetailsPanel project={project} loading={false} isAdmin={true} />
                </div>
                
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Notițe Recente</h3>
                      {notes.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nu există notițe încă.</p>
                      ) : (
                        <div className="space-y-4">
                          {notes.slice(0, 3).map(note => (
                            <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm">{note.content}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {format(new Date(note.createdAt), "dd MMM yyyy, HH:mm")}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks">
              <ProjectTasksPanel projectId={project.id} tasks={tasks} loading={false} />
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Conversație cu Clientul</h3>
                  
                  <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto p-2">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Nu există mesaje încă</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`
                              max-w-[80%] rounded-lg p-3
                              ${message.isAdmin 
                                ? 'bg-purple-100 text-purple-900' 
                                : 'bg-gray-100 text-gray-900'}
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={message.isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'}>
                                  {message.isAdmin ? 'A' : 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {message.isAdmin ? 'Admin' : 'Client'}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-[10px] text-gray-500 mt-1 text-right">
                              {format(new Date(message.createdAt), "dd MMM, HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Trimite un mesaj clientului..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Atașează Fișier
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Trimite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin-notes">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Note Administrative</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Aceste note sunt vizibile doar pentru administratori
                  </p>
                  
                  <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto p-2">
                    {adminNotes.length === 0 ? (
                      <div className="text-center py-8">
                        <StickyNote className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Nu există note administrative încă</p>
                      </div>
                    ) : (
                      adminNotes.map(note => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(note.createdAt), "dd MMM yyyy, HH:mm")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Textarea
                      placeholder="Adaugă o notă administrativă..."
                      value={newAdminNote}
                      onChange={(e) => setNewAdminNote(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button 
                        onClick={handleAddAdminNote}
                        disabled={!newAdminNote.trim()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Adaugă Notă
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin-files">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Fișiere Administrative</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Aceste fișiere sunt vizibile doar pentru administratori
                  </p>
                  
                  <div className="mb-6">
                    {projectFiles.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <FilePlus className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Nu există fișiere administrative încă</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectFiles.map(file => (
                          <div key={file.id} className="border rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="bg-gray-100 h-10 w-10 rounded flex items-center justify-center mr-3">
                                <FileText className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.filename}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(file.uploadedAt), "dd MMM yyyy")}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(file.filePath, "_blank")}
                              >
                                Vizualizează
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block w-full">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={uploadingFile}
                      >
                        {uploadingFile ? (
                          <span>Se încarcă...</span>
                        ) : (
                          <>
                            <FilePlus className="mr-2 h-4 w-4" />
                            Încarcă un fișier nou
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminProjectDetails;
