
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
  uploadFile 
} from '@/integrations/supabase/client';
import { Project, Message } from '@/types';
import { toast } from 'sonner';
import { FileIcon, PaperclipIcon, SendIcon } from 'lucide-react';

export default function ProjectChat() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id && user) {
      loadProjectData();
      
      // Set up real-time subscription for new messages
      const subscription = setupMessageSubscription();
      
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [id, user]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Get project details
      const projectData = await fetchProjectById(id!);
      setProject(projectData);
      
      // Get project messages
      const projectMessages = await fetchProjectMessages(id!);
      setMessages(projectMessages);
    } catch (error) {
      console.error('Error loading project chat data:', error);
      toast.error('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };
  
  const setupMessageSubscription = () => {
    const subscription = supabase
      .channel('public:messages')
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
      .subscribe();
      
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
      
      let attachmentUrl = '';
      
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }
      
      await sendProjectMessage(
        id!,
        newMessage.trim() || 'Shared a file',
        user.id,
        false, // Not admin
        attachmentUrl,
        selectedFile?.type
      );
      
      setNewMessage('');
      setSelectedFile(null);
      
      // No need to refresh messages due to real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading chat...</div>;
  }
  
  if (!project) {
    return <div className="flex justify-center items-center h-screen">Project not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full md:max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            Chat for Project: {project.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[70vh]">
            <ScrollArea className="flex-1 p-4 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No messages yet. Start the conversation!
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
  );
}
