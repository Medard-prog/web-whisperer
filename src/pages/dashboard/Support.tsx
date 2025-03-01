
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSupportMessages, sendSupportMessage } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Send, Paperclip, HelpCircle } from "lucide-react";
import { Message } from "@/types";

const Support = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const messages = await fetchSupportMessages(user.id);
        setMessages(messages);
      } catch (error) {
        console.error("Error loading support messages:", error);
        setError("Nu s-au putut încărca mesajele");
        toast.error("Nu s-au putut încărca mesajele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [user]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      const message = await sendSupportMessage(newMessage, user.id, false);
      if (message) {
        setMessages(prev => [...prev, message]);
        setNewMessage("");
      } else {
        toast.error("Nu s-a putut trimite mesajul");
      }
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Nu s-a putut trimite mesajul", {
        description: "Te rugăm să reîncerci mai târziu."
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Asistență</h1>
              <p className="text-gray-600">
                Contactează echipa noastră de suport pentru ajutor
              </p>
            </div>
          </div>
          
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-500" />
                Conversație
              </CardTitle>
              <CardDescription>
                Trimite un mesaj echipei de suport
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Se încarcă mesajele...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <ScrollArea className="flex-1 mb-4">
                  <div className="flex flex-col gap-3 p-3">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex w-full ${message.isAdmin ? 'items-start' : 'items-end flex-row-reverse'}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm text-gray-500">
                              {message.isAdmin ? 'Echipa Suport' : 'Tu'} - {formatDate(message.createdAt)}
                            </p>
                          </div>
                          <div className="rounded-md px-3 py-2 w-fit max-w-[400px]" style={{
                            backgroundColor: message.isAdmin ? '#E2E8F0' : '#DCF8C6'
                          }}>
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                  <Textarea
                    placeholder="Scrie un mesaj..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={1}
                    className="resize-none flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Trimite
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Apasă Shift + Enter pentru a adăuga o linie nouă
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </div>
  );
};

export default Support;
