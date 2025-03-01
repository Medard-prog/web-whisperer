
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSupportMessages, sendSupportMessage, uploadFile } from "@/integrations/supabase/client";
import { Message } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Send, Image, Paperclip, File, X, Clock, ArrowRight, LifeBuoy, Headphones } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import PageTransition from "@/components/PageTransition";

const Support = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const supportMessages = await fetchSupportMessages(user.id);
        setMessages(supportMessages);
      } catch (error) {
        console.error("Error fetching support messages:", error);
        toast.error("Nu s-au putut încărca mesajele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !user) return;
    
    try {
      setIsSending(true);
      
      let attachmentUrl = "";
      let attachmentType = "";
      
      // Upload file if selected
      if (selectedFile) {
        attachmentType = selectedFile.type;
        
        // Simulate upload progress
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
      
      await sendSupportMessage(
        newMessage || (selectedFile ? `Am trimis un fișier: ${selectedFile.name}` : ""), 
        user.id, 
        false,
        attachmentUrl,
        attachmentType
      );
      
      // Refresh messages
      const refreshedMessages = await fetchSupportMessages(user.id);
      setMessages(refreshedMessages);
      
      setNewMessage("");
      setSelectedFile(null);
      setUploadProgress(0);
      
      toast.success("Mesaj trimis cu succes");
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
        <div className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-bold mb-6">Suport Tehnic</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <div className="flex items-center">
                    <Headphones className="h-6 w-6 mr-2" />
                    <div>
                      <CardTitle>Asistență și Suport</CardTitle>
                      <CardDescription className="text-purple-100">
                        Suntem aici să te ajutăm cu orice întrebare sau problemă
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <p>Se încarcă mesajele...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <LifeBuoy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">Nu există mesaje încă</p>
                            <p className="text-gray-400 text-sm">
                              Trimite primul tău mesaj pentru a începe o conversație cu echipa noastră de suport
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
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={message.isAdmin ? 'bg-gray-500 text-white' : 'bg-purple-300 text-purple-700'}>
                                      {message.isAdmin ? 'S' : user?.name?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">
                                    {message.isAdmin ? 'Echipa Suport' : 'Tu'}
                                  </span>
                                </div>
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
                    </div>
                    
                    <div className="p-4 border-t mt-auto bg-white">
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
                        <Textarea
                          placeholder="Scrie un mesaj..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          disabled={isSending}
                          className="flex-1 min-h-[60px] max-h-[120px]"
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
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <div className="space-y-6">
                <Card className="border-none shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Program Suport</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Luni - Vineri</span>
                        <span>09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sâmbătă</span>
                        <span>10:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duminică</span>
                        <span>Închis</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Timp mediu de răspuns: 2-4 ore</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Documentație</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-sm mb-4">
                      Explorează ghidurile și tutorialele noastre pentru a afla mai multe despre cum să folosești serviciile noastre.
                    </p>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center justify-between text-sm hover:text-purple-600 transition-colors">
                        <span>Ghid de utilizare</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <a href="#" className="flex items-center justify-between text-sm hover:text-purple-600 transition-colors">
                        <span>Întrebări frecvente</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <a href="#" className="flex items-center justify-between text-sm hover:text-purple-600 transition-colors">
                        <span>Tutoriale video</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <LifeBuoy className="h-12 w-12 text-purple-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ai nevoie de ajutor urgent?</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Contactează-ne direct pentru asistență imediată
                      </p>
                      <Button variant="outline" className="w-full border-purple-200">
                        +40 770 123 456
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Support;
