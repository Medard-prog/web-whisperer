
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Message, User } from '@/types';
import { 
  fetchProjectById, 
  fetchProjectMessages, 
  fetchUsers,
  sendProjectMessage, 
  supabase 
} from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, 
  ArrowLeft, 
  MessagesSquare,
  UserIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import PageTransition from '@/components/PageTransition';
import DashboardSidebar from '@/components/DashboardSidebar';

const AdminProjectChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projectOwner, setProjectOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const projectData = await fetchProjectById(id);
        if (!projectData) {
          setError("Project not found");
          setLoading(false);
          return;
        }
        setProject(projectData);
        
        const usersData = await fetchUsers();
        setUsers(usersData);
        
        if (projectData.userId) {
          const owner = usersData.find(u => u.id === projectData.userId);
          setProjectOwner(owner || null);
        }
        
        try {
          const messagesData = await fetchProjectMessages(id);
          setMessages(messagesData);
        } catch (err: any) {
          console.error("Error fetching project messages:", err);
          setError(`Could not load messages: ${err.message}`);
          setMessages([]);
        }
      } catch (err: any) {
        console.error("Error loading project data:", err);
        setError(`Failed to load project data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    const channel = supabase
      .channel('admin-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${id}`
      }, (payload) => {
        const newMessage = payload.new as any;
        setMessages((current) => {
          if (current.some(msg => msg.id === newMessage.id)) {
            return current;
          }
          
          const formattedMessage: Message = {
            id: newMessage.id,
            projectId: newMessage.project_id,
            content: newMessage.content,
            createdAt: newMessage.created_at,
            isAdmin: newMessage.is_admin,
            userId: newMessage.user_id,
            attachmentUrl: newMessage.attachment_url,
            attachmentType: newMessage.attachment_type
          };
          
          return [...current, formattedMessage];
        });
        
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      })
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [id, user]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (content: string, file?: File) => {
    if (!id || !user || (!content.trim() && !file)) return;
    
    try {
      setSendingMessage(true);
      
      let attachmentUrl = '';
      let attachmentType = '';
      
      if (file) {
        const fileData = await uploadFile(file, id, user.id);
        if (fileData) {
          attachmentUrl = fileData.url || '';
          attachmentType = file.type;
        }
      }
      
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        projectId: id,
        content,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        userId: user.id,
        attachmentUrl,
        attachmentType
      };
      
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      await sendProjectMessage(
        id,
        content,
        user.id,
        true,
        attachmentUrl,
        attachmentType
      );
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error(`Failed to send message: ${err.message}`);
    } finally {
      setSendingMessage(false);
    }
  };
  
  const uploadFile = async (file: File, projectId: string, userId: string) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `projects/${projectId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('project_files')
        .getPublicUrl(filePath);
        
      return {
        url: urlData.publicUrl,
        path: filePath,
        type: file.type
      };
    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast.error(`Failed to upload file: ${err.message}`);
      return null;
    }
  };
  
  const getUserName = (userId: string) => {
    const userFound = users.find(u => u.id === userId);
    return userFound?.name || 'Unknown User';
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <main className="flex-1 p-4">
          <div className="container max-w-5xl py-6">
            <Breadcrumb className="mb-6">
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/project/${id}`}>{project?.title || 'Project Details'}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>Chat</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <MessagesSquare className="mr-2 h-6 w-6 text-indigo-600" />
                Project Chat
              </h1>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </div>
            
            {loading ? (
              <Card className="shadow-lg border border-gray-200">
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="h-[600px] flex flex-col justify-center items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600/50" />
                  <p className="mt-4 text-gray-500">Loading chat...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : !project ? (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Project not found</AlertDescription>
              </Alert>
            ) : (
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-4 border-b">
                  <CardTitle className="text-xl flex items-center text-indigo-800">
                    <MessagesSquare className="mr-2 h-5 w-5 text-indigo-600" />
                    {project.title}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <UserIcon className="h-3 w-3 mr-1 text-indigo-700" />
                    {projectOwner ? (
                      <span className="text-indigo-700 font-medium">Client: {projectOwner.name} ({projectOwner.email})</span>
                    ) : (
                      <span>Unassigned Project</span>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div 
                    ref={messagesContainerRef}
                    className="h-[600px] overflow-y-auto px-6 py-5 space-y-4 bg-gradient-to-b from-indigo-50/30 to-white"
                  >
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center text-muted-foreground">
                        <div className="bg-indigo-100/50 p-8 rounded-full mb-4">
                          <MessagesSquare className="h-12 w-12 text-indigo-400" />
                        </div>
                        <p className="text-lg font-medium text-indigo-900">No messages yet</p>
                        <p className="text-indigo-600">Start the conversation by sending a message below</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <ChatMessage 
                            key={message.id}
                            message={message}
                            isCurrentUser={message.userId === user?.id}
                            userName={
                              message.isAdmin 
                                ? "Admin" 
                                : getUserName(message.userId)
                            }
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </CardContent>
                
                <div className="border-t p-4 bg-white">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={sendingMessage}
                    placeholder="Type a message as admin..."
                  />
                </div>
              </Card>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default AdminProjectChat;
