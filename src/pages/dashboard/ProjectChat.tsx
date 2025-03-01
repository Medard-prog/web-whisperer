
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjectById, fetchProjectMessages, sendProjectMessage, supabase, uploadFile } from '@/integrations/supabase/client';
import { Message, Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaperclipIcon, SendIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, FileImage, FileMusic, FilePdf, FileText, FileVideo } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

const ProjectChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch project and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id || !user) return;

        // Fetch project details
        const projectData = await fetchProjectById(id);
        setProject(projectData);
        
        // Fetch messages
        const messagesData = await fetchProjectMessages(id);
        setMessages(messagesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project chat data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project chat data. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, toast]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!id) return;
    
    // Subscribe to real-time updates for messages
    const channel = supabase
      .channel('project-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${id}`
        },
        (payload) => {
          console.log('New message received:', payload);
          // Map the new message to our Message type
          const newMessage: Message = {
            id: payload.new.id,
            projectId: payload.new.project_id,
            content: payload.new.content,
            createdAt: payload.new.created_at,
            isAdmin: payload.new.is_admin || false,
            userId: payload.new.user_id,
            attachmentUrl: payload.new.attachment_url,
            attachmentType: payload.new.attachment_type,
          };
          
          // Update messages state with the new message
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
    
    // Cleanup function to remove the channel when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleSendMessage = async () => {
    try {
      if (!id || !user || !message.trim()) return;
      
      setSending(true);
      let attachmentUrl = '';
      let attachmentType = '';
      
      // Handle file upload
      if (file) {
        setUploadingFile(true);
        try {
          attachmentUrl = await uploadFile(file, `messages/${id}`);
          attachmentType = file.type;
          setFile(null);
          toast({
            title: 'File uploaded',
            description: 'Your file has been uploaded successfully.',
          });
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Upload failed',
            description: 'Failed to upload file. Please try again.',
            variant: 'destructive',
          });
        }
        setUploadingFile(false);
      }
      
      // Send message
      await sendProjectMessage(id, message, user.id, user.isAdmin || false, attachmentUrl, attachmentType);
      
      // Clear message input
      setMessage('');
      setSending(false);
      
      // No need to fetch messages again as we're using real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Helper function to display file icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="h-6 w-6" />;
    if (type.includes('pdf')) return <FilePdf className="h-6 w-6" />;
    if (type.includes('video')) return <FileVideo className="h-6 w-6" />;
    if (type.includes('audio')) return <FileMusic className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
          <p className="text-gray-500">We couldn't find the project you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-md border-0">
        <CardHeader className="border-b border-border bg-muted/50">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-muted-foreground">
              Project Chat
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 h-[60vh] flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}
                  >
                    <div 
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.isAdmin 
                          ? 'bg-muted text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.attachmentUrl && (
                        <div className="mt-2">
                          <a 
                            href={msg.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm underline"
                          >
                            {msg.attachmentType && getFileIcon(msg.attachmentType)}
                            <span>Attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {file && (
            <div className="flex items-center gap-2 p-2 mt-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 flex-1 text-sm">
                {getFileIcon(file.type)}
                <span className="truncate">{file.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-border p-4">
          <div className="flex w-full gap-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleTriggerFileInput}
              disabled={sending || uploadingFile}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[40px] max-h-[120px]"
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sending || uploadingFile}
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectChat;
