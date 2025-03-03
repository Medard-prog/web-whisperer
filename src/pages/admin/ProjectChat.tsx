
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
import { FileIcon, PaperclipIcon, SendIcon, ArrowLeft, Loader2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import DashboardSidebar from '@/components/DashboardSidebar';

const AdminProjectChat = () => {
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
      
      console.log("Admin: Fetching project details for:", id);
      // Get project details
      const projectData = await fetchProjectById(id!);
      if (!projectData) {
        toast.error("Project not found");
        navigate("/admin/projects");
        return;
      }
      setProject(projectData);
      
      console.log("Admin: Fetching messages for project:", id);
      // Get project messages
      const projectMessages = await fetchProjectMessages(id!);
      console.log("Admin: Messages fetched:", projectMessages);
      setMessages(projectMessages);
    } catch (error) {
      console.error('Error loading project chat data:', error);
      toast.error('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };
  
  const setupMessageSubscription = () => {
    console.log("Admin: Setting up realtime subscription for project messages");
    const subscription = supabase
      .channel(`admin-messages-${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${id}` 
      }, payload => {
        console.log('Admin: Real-time message received:', payload);
        
        // Add the new message to the chat if it's not from the current user
        // This prevents duplicate messages when the admin sends a message
        const newMessage = payload.new as any;
        if (newMessage.user_id !== user?.id) {
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
        }
      })
      .subscribe((status) => {
        console.log(`Admin: Subscription status:`, status);
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
      console.log("Admin: Sending message for project:", id);
      
      let attachmentUrl = '';
      
      if (selectedFile) {
        const fileData = await uploadFile(selectedFile, id!, user.id);
        if (fileData) {
          attachmentUrl = fileData.url || '';
        }
      }
      
      const sentMessage = await sendProjectMessage(
        id!,
        newMessage.trim() || 'Shared a file',
        user.id,
        true, // Admin
        attachmentUrl,
        selectedFile?.type || ''
      );
      
      // Add the new message to the UI immediately without waiting for realtime
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
      }
      
      setNewMessage('');
      setSelectedFile(null);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/project/${id}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
              <h1 className="text-xl font-bold">
                {project ? `Chat: ${project.title} (Admin)` : 'Loading...'}
              </h1>
            </div>
            
            <Card className="mb-6 border-0 shadow-lg">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-white">Project Messages (Admin View)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[70vh]">
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-6">
                        {messages.length === 0 ? (
                          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <div className="flex flex-col items-center gap-2">
                              <MessageSquareIcon className="h-8 w-8 text-gray-400" />
                              <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                              <p className="text-sm text-gray-500">
                                Start the conversation by sending a message below.
                              </p>
                            </div>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <MessageBubble 
                              key={message.id} 
                              message={message} 
                              isCurrentUser={message.isAdmin}
                              formatTime={formatMessageTime}
                            />
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  )}
                  
                  <div className="border-t p-4 bg-white rounded-b-lg">
                    <form onSubmit={handleSendMessage} className="mt-auto">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 bg-gray-50 rounded-lg p-1">
                          <Textarea
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="border-0 bg-transparent min-h-[60px] focus-visible:ring-0 resize-none"
                          />
                          
                          {selectedFile && (
                            <div className="mt-2 text-sm text-gray-600 flex items-center p-2 bg-white rounded-md">
                              <FileIcon className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="ml-2 h-5 w-5" 
                                onClick={() => setSelectedFile(null)}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <label className="cursor-pointer p-2 border rounded-full bg-white hover:bg-gray-50 transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <PaperclipIcon className="h-5 w-5 text-gray-600" />
                          </label>
                          
                          <Button 
                            type="submit" 
                            size="icon"
                            className="rounded-full bg-primary hover:bg-primary/90"
                            disabled={sending || (!newMessage.trim() && !selectedFile)}
                          >
                            {sending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SendIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

// Add these missing components
const MessageSquareIcon = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

const XIcon = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  formatTime: (timestamp: string) => string;
}

const MessageBubble = ({ message, isCurrentUser, formatTime }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[80%] 
        rounded-2xl 
        ${isCurrentUser 
          ? 'bg-blue-600 text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'}
        shadow-sm
      `}>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className={`h-6 w-6 ${isCurrentUser ? 'bg-white text-blue-600' : 'bg-gray-300 text-gray-700'}`}>
              <AvatarFallback>
                {message.isAdmin ? 'A' : 'C'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {message.isAdmin ? 'Admin' : 'Client'}
            </span>
          </div>
          
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          
          {message.attachmentUrl && (
            <div className="mt-3 bg-white/20 p-2 rounded">
              <a 
                href={message.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`
                  flex items-center 
                  text-sm font-medium 
                  ${isCurrentUser ? 'text-white hover:text-white/90' : 'text-blue-600 hover:text-blue-700'}
                  hover:underline
                `}
              >
                <FileIcon className="h-4 w-4 mr-2" />
                View Attachment
              </a>
            </div>
          )}
          
          <div className={`text-xs mt-2 ${isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectChat;
