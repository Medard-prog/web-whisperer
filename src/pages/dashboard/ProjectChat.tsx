import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  fetchProjectById, 
  fetchProjectMessages, 
  sendProjectMessage, 
  uploadFile,
  supabase 
} from '@/integrations/supabase/client';
import { Project, Message } from '@/types';
import { toast } from 'sonner';
import { FileIcon, PaperclipIcon, SendIcon, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import DashboardSidebar from '@/components/DashboardSidebar';

const ProjectChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id && user) {
      loadProjectData();
      
      // Set up real-time subscription for new messages
      const subscription = setupMessageSubscription();
      
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [id, user]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching project details for:", id);
      // Get project details
      const projectData = await fetchProjectById(id!);
      setProject(projectData);
      
      console.log("Fetching messages for project:", id);
      // Get project messages
      const projectMessages = await fetchProjectMessages(id!);
      console.log("Messages fetched:", projectMessages);
      setMessages(projectMessages);
    } catch (error) {
      console.error('Error loading project chat data:', error);
      toast.error('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };
  
  const setupMessageSubscription = () => {
    console.log("Setting up realtime subscription for project messages");
    const subscription = supabase
      .channel(`messages-${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${id}` 
      }, payload => {
        console.log('Real-time message received:', payload);
        
        // Add the new message to the chat
        const newMessage = payload.new as any;
        
        // Create a properly formatted message object
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
        
        setMessages(prev => [...prev, formattedMessage]);
      })
      .subscribe((status) => {
        console.log(`Subscription status:`, status);
      });
      
    return subscription;
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !user?.id) {
      return;
    }
    
    try {
      setSending(true);
      console.log("Sending message for project:", id);
      
      let attachmentUrl = '';
      
      if (selectedFile) {
        const fileData = await uploadFile(selectedFile, id, user.id);
        if (fileData) {
          attachmentUrl = fileData.url || '';
        }
      }
      
      const sentMessage = await sendProjectMessage(
        id!,
        newMessage.trim() || 'Shared a file',
        user.id,
        false, // Not admin
        attachmentUrl,
        selectedFile?.type || ''
      );
      
      // Add the new message to the UI immediately without waiting for realtime
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
      }
      
      setNewMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    if (!file || !project?.id || !user?.id) return;
    
    try {
      setUploading(true);
      setUploadProgress(30);
      
      const fileData = await uploadFile(file, project.id, user.id);
      
      setUploadProgress(90);
      
      if (fileData) {
        // Add the new message to the UI immediately without waiting for realtime
        const sentMessage = await sendProjectMessage(
          id!,
          'Shared a file',
          user.id,
          false, // Not admin
          fileData.url || '',
          file.type || ''
        );
        
        if (sentMessage) {
          setMessages(prev => [...prev, sentMessage]);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/project/${id}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi la Proiect
              </Button>
              <h1 className="text-xl font-bold">
                {project ? `Chat: ${project.title}` : 'Încărcare...'}
              </h1>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Mesaje Proiect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[65vh]">
                  <ScrollArea className="flex-1 p-4 mb-4">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center text-gray-500 py-4">
                          Se încarcă mesajele...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          Nu există mesaje. Începe conversația!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.userId === user?.id 
                                  ? 'bg-primary/10 text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {message.isAdmin ? 'A' : 'C'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium">
                                  {message.isAdmin ? 'Admin' : 'You'}
                                </span>
                              </div>
                              
                              <p>{message.content}</p>
                              
                              {message.attachmentUrl && (
                                <a 
                                  href={message.attachmentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center mt-2 text-blue-600 hover:underline"
                                >
                                  <FileIcon className="h-4 w-4 mr-1" />
                                  View Attachment
                                </a>
                              )}
                              
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(message.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={handleSendMessage} className="mt-auto">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px]"
                        />
                        
                        {selectedFile && (
                          <div className="mt-2 text-sm text-gray-600 flex items-center">
                            <FileIcon className="h-4 w-4 mr-1" />
                            <span className="truncate">{selectedFile.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer p-2 border rounded hover:bg-gray-100">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                          <PaperclipIcon className="h-5 w-5" />
                        </label>
                        
                        <Button 
                          type="submit" 
                          size="icon"
                          disabled={sending || (!newMessage.trim() && !selectedFile)}
                        >
                          <SendIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default ProjectChat;
