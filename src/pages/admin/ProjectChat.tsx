
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
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, 
  ArrowLeft, 
  MessagesSquare,
  UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';

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

  // Load project, messages, and users data
  useEffect(() => {
    if (!id || !user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project data
        const projectData = await fetchProjectById(id);
        if (!projectData) {
          setError("Project not found");
          setLoading(false);
          return;
        }
        setProject(projectData);
        
        // Fetch all users to get project owner's name
        const usersData = await fetchUsers();
        setUsers(usersData);
        
        if (projectData.userId) {
          const owner = usersData.find(u => u.id === projectData.userId);
          setProjectOwner(owner || null);
        }
        
        // Fetch project messages
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
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('admin-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${id}`
      }, (payload) => {
        // Check if message already exists to prevent duplicates
        const newMessage = payload.new as any;
        setMessages((current) => {
          // Don't add if we already have this message
          if (current.some(msg => msg.id === newMessage.id)) {
            return current;
          }
          
          // Transform to our Message type
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
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [id, user]);
  
  // Scroll to bottom when messages change
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
      
      // Upload file if provided
      if (file) {
        const fileData = await uploadFile(file, id, user.id);
        if (fileData) {
          attachmentUrl = fileData.url || '';
          attachmentType = file.type;
        }
      }
      
      // Send message as admin
      const message = await sendProjectMessage(
        id,
        content,
        user.id,
        true, // isAdmin = true
        attachmentUrl,
        attachmentType
      );
      
      if (message) {
        // No need to update messages state, the subscription will handle it
        toast.success("Message sent");
      }
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
  
  // Function to get user name by ID
  const getUserName = (userId: string) => {
    const userFound = users.find(u => u.id === userId);
    return userFound?.name || 'Unknown User';
  };
  
  if (loading) {
    return (
      <div className="container py-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="h-[500px] flex flex-col justify-center items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-32 mt-4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Project Chat</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold">Project Messages</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Project Chat</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold">Project Messages</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/admin/projects/${id}`}>{project.title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Project Chat</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Project Messages</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <Card className="shadow-md border">
        <CardHeader className="bg-muted/50 pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessagesSquare className="mr-2 h-5 w-5 text-primary" />
            {project.title}
          </CardTitle>
          <CardDescription className="flex items-center">
            <UserIcon className="h-3 w-3 mr-1" />
            {projectOwner ? (
              <span>Client: {projectOwner.name} ({projectOwner.email})</span>
            ) : (
              <span>Unassigned Project</span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div 
            ref={messagesContainerRef}
            className="h-[500px] overflow-y-auto p-4 space-y-2 bg-background/80"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-muted-foreground">
                <MessagesSquare className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation by sending a message below</p>
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
        
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={sendingMessage}
          placeholder="Type a message as admin..."
        />
      </Card>
    </div>
  );
};

export default AdminProjectChat;
