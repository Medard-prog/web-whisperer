
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types';
import { 
  fetchProjectById, 
  fetchProjectMessages, 
  sendProjectMessage, 
  supabase 
} from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, 
  ArrowLeft, 
  MessagesSquare,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import PageTransition from '@/components/PageTransition';
import DashboardSidebar from '@/components/DashboardSidebar';

const ProjectChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load project and messages data
  useEffect(() => {
    if (!id || !user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project data
        const projectData = await fetchProjectById(id);
        if (!projectData) {
          throw new Error("Project not found");
        }
        setProject(projectData);
        
        // Fetch project messages
        const messagesData = await fetchProjectMessages(id);
        setMessages(messagesData);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load chat data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('project-messages')
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
        
        // Auto scroll to bottom on new message
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
        const uploadResult = await uploadFile(file);
        if (uploadResult) {
          attachmentUrl = uploadResult.url;
          attachmentType = file.type;
        }
      }
      
      await sendProjectMessage(
        id,
        content,
        user.id,
        false, // isAdmin = false for client messages
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
  
  const uploadFile = async (file: File) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `projects/${id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('project_files')
        .getPublicUrl(filePath);
        
      return {
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast.error(`Failed to upload file: ${err.message}`);
      return null;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {loading ? "Loading..." : `${project?.title || "Project"} Chat`}
              </h1>
              
              <Button 
                variant="outline"
                onClick={() => navigate(`/dashboard/project/${id}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
            </div>
            
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="h-[500px] flex flex-col justify-center items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32 mt-4" />
                </CardContent>
              </Card>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Card className="shadow-md border">
                <CardHeader className="bg-muted/50 pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <MessagesSquare className="mr-2 h-5 w-5 text-primary" />
                    {project.title}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Status: {statusMap[project.status as keyof typeof statusMap]?.label || project.status}
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
                            userName={message.isAdmin ? "Admin" : "You"}
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
                  placeholder="Type your message..."
                />
              </Card>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

// Helper for status mapping
const statusMap = {
  pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "În lucru", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Finalizat", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Anulat", color: "bg-red-100 text-red-800" },
  new: { label: "Nou", color: "bg-purple-100 text-purple-800" }
};

export default ProjectChat;
