
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, fetchSupportMessages, sendSupportMessage, uploadFile } from "@/integrations/supabase/client";
import { Message } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Send, HelpCircle, Image, FileText, Paperclip, X, File } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import PageTransition from "@/components/PageTransition";

const faqs = [
  {
    question: "Cum pot solicita un proiect nou?",
    answer: "Poți solicita un proiect nou direct din dashboard-ul tău făcând click pe butonul 'Solicită Proiect Nou' sau navigând la secțiunea 'Proiecte' și accesând butonul de acolo."
  },
  {
    question: "Cât durează realizarea unui website?",
    answer: "Timpul de realizare depinde de complexitatea proiectului tău. Un website simplu poate fi gata în 2-3 săptămâni, în timp ce proiectele mai complexe pot dura 1-3 luni. Vei primi o estimare detaliată după evaluarea cerințelor tale."
  },
  {
    question: "Ce informații trebuie să furnizez pentru proiectul meu?",
    answer: "Este util să ne oferi o descriere a afacerii tale, publicul țintă, exemple de site-uri care îți plac, preferințele de design și conținutul pe care dorești să-l incluzi (texte, imagini). Cu cât mai multe detalii, cu atât mai bine putem să realizăm viziunea ta."
  },
  {
    question: "Cum pot face modificări la proiectul meu existent?",
    answer: "Pentru a solicita modificări, navighează la pagina proiectului tău din dashboard și folosește secțiunea de mesaje pentru a comunica direct cu echipa noastră de suport. Poți atașa imagini sau fișiere pentru a explica mai bine modificările dorite."
  },
  {
    question: "Oferiți servicii de mentenanță după finalizarea proiectului?",
    answer: "Da, oferim pachete de mentenanță care includ actualizări de securitate, backup-uri, modificări minore și suport tehnic. Poți selecta opțiunea de mentenanță în formularul de solicitare sau o poți adăuga ulterior contactând echipa noastră."
  }
];

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
    
    // Set up real-time subscription
    const channel = supabase
      .channel('support_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        if (payload.new.project_id) return; // Ignore project messages
        
        const newMessage: Message = {
          id: payload.new.id,
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
          attachmentUrl = await uploadFile(selectedFile, 'support');
          clearInterval(progressInterval);
          setUploadProgress(100);
        } catch (error) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          throw error;
        }
      }
      
      await sendSupportMessage(
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
        <div className="flex-1 p-6 lg:p-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Ajutor & Suport</h1>
            <p className="text-gray-600">
              Obține asistență și răspunsuri la întrebările tale
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-purple-500" />
                    Întrebări Frecvente
                  </CardTitle>
                  <CardDescription>
                    Găsește răspunsuri rapide la cele mai comune întrebări
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contactează-ne</CardTitle>
                  <CardDescription>
                    Alte modalități de a ne contacta
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-gray-500">support@webwhisperer.com</p>
                      <p className="text-sm text-gray-500">Timp de răspuns: 24-48 ore</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <HelpCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Telefon</h3>
                      <p className="text-sm text-gray-500">+40 722 123 456</p>
                      <p className="text-sm text-gray-500">Program: Luni-Vineri, 9:00 - 17:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Chat Suport</CardTitle>
                  <CardDescription>
                    Discută direct cu echipa noastră de suport
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[300px] max-h-[500px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <p>Se încarcă mesajele...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <p className="text-gray-500 mb-2">Nu există mesaje încă</p>
                          <p className="text-sm text-gray-400">
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
                  </div>
                  
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
                  
                  <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Support;
