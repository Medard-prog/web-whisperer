
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types';
import { fetchProjectById, fetchProjectMessages, sendProjectMessage, supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, MessagesSquare } from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';

const ProjectChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
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
    
    const loadProjectData = async () => {
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
    
    loadProjectData();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages')
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
      
      // Send message
      const message = await sendProjectMessage(
        id,
        content,
        user.id,
        false,
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
  
  if (loading) {
    return (
      <div className="container max-w-4xl py-6">
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
      <div className="container max-w-4xl py-6">
        <h1 className="text-2xl font-bold mb-4">Project Chat</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container max-w-4xl py-6">
        <h1 className="text-2xl font-bold mb-4">Project Chat</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-2xl font-bold mb-4">Project Chat</h1>
      
      <Card className="shadow-md border">
        <CardHeader className="bg-muted/50 pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessagesSquare className="mr-2 h-5 w-5 text-primary" />
            {project.title}
          </CardTitle>
          <CardDescription>
            Use this chat to communicate about your project
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
                    userName={message.isAdmin ? "Admin" : user?.name || "You"}
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
    </div>
  );
};

export default ProjectChat;
