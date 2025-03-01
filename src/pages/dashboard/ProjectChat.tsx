
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, fetchProjectMessages, sendProjectMessage, uploadFile } from "@/integrations/supabase/client";
import { Message, Project, mapProject, mapMessage } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, ChevronLeft, Image, Paperclip, File, X } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import PageTransition from "@/components/PageTransition";

const ProjectChat = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!projectId || !user) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          // Try to fetch from project_requests if not found in projects
          const { data: requestData, error: requestError } = await supabase
            .from('project_requests')
            .select('*')
            .eq('id', projectId)
            .single();
            
          if (requestError) {
            throw new Error("Project not found");
          }
          
          setProject({
            id: requestData.id,
            title: requestData.project_name,
            description: requestData.description || '',
            status: requestData.status as any,
            createdAt: requestData.created_at,
            price: requestData.price || 0,
            userId: requestData.user_id,
            websiteType: requestData.project_type
          });
        } else {
          setProject(mapProject(projectData));
        }
        
        // Fetch messages
        const messages = await fetchProjectMessages(projectId);
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Nu s-au putut încărca datele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('project_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${projectId}` 
      }, (payload) => {
        console.log('New message received:', payload);
        // Convert the payload to a Message object
        const newMessage: Message = {
          id: payload.new.id,
          projectId: payload.new.project_id,
          content: payload.new.content,
          createdAt: payload.new.created_at,
          isAdmin: payload.new.is_admin,
          userId: payload.new.user_id,
          attachmentUrl: payload.new.attachment_url,
          attachmentType: payload.new.attachment_type
        };
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !user || !projectId) return;
    
    try {
      setIsSending(true);
      
      let attachmentUrl = "";
      let attachmentType = "";
      
      // Upload file if selected
      if (selectedFile) {
        attachmentType = selectedFile.type;
        
        // Simulate upload progress (in a real app, you'd use an upload progress event)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
        
        try {
          attachmentUrl = await uploadFile(selectedFile);
          clearInterval(progressInterval);
          setUploadProgress(100);
        } catch (error) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          throw error;
        }
      }
      
      await sendProjectMessage(
        projectId, 
        newMessage || (selectedFile ? `A trimis un fișier: ${selectedFile.name}` : ""), 
        user.id, 
        false,
        attachmentUrl,
        attachmentType
      );
      
      setNewMessage("");
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Nu s-a putut trimite mesajul", {
        description: error.message || "Te rugăm să încerci din nou."
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Fișierul este prea mare", {
          description: "Mărimea maximă permisă este de 10MB."
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const renderAttachment = (message: Message) => {
    if (!message.attachmentUrl) return null;
    
    if (message.attachmentType?.startsWith('image/')) {
      return (
        <div className="mt-2 max-w-xs">
          <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={message.attachmentUrl} 
              alt="Attachment" 
              className="rounded-md max-h-64 object-contain"
            />
          </a>
        </div>
      );
    }
    
    return (
      <div className="mt-2">
        <a 
          href={message.attachmentUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors"
        >
          <File className="h-4 w-4 mr-2" />
          <span className="truncate">Descarcă fișierul</span>
        </a>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10 flex flex-col">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/project/${projectId}`)}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mesaje</h1>
              <p className="text-gray-600">
                {project ? `Proiect: ${project.title}` : "Încărcare..."}
              </p>
            </div>
          </div>
          
          <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-md">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: "400px" }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Se încarcă mesajele...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-gray-500 mb-2">Nu există mesaje încă</p>
                    <p className="text-gray-400 text-sm">
                      Trimite primul tău mesaj pentru a începe o conversație cu echipa noastră
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isAdmin 
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        {renderAttachment(message)}
                        <div className={`text-xs mt-1 ${message.isAdmin ? 'text-gray-500' : 'text-purple-100'}`}>
                          {format(new Date(message.createdAt), 'dd MMM yyyy, HH:mm', { locale: ro })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>
            
            <div className="p-4 border-t mt-auto">
              {selectedFile && (
                <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(selectedFile.type)}
                    <span className="ml-2 text-sm truncate">{selectedFile.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-2">
                  <div className="h-1 bg-gray-200 rounded">
                    <div 
                      className="h-1 bg-purple-600 rounded" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Se încarcă... {uploadProgress}%</p>
                </div>
              )}
              
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Scrie un mesaj..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isSending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isSending || (!newMessage.trim() && !selectedFile)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </PageTransition>
    </div>
  );
};

export default ProjectChat;
