
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchSupportMessages, sendSupportMessage } from "@/integrations/supabase/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";
import { HelpCircle, Send, Info, ArrowRight } from "lucide-react";

interface SupportMessage {
  id: string;
  content: string;
  created_at: string;
  is_from_user: boolean;
  is_read?: boolean;
}

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadMessages = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      const messagesData = await fetchSupportMessages(user.id);
      setMessages(messagesData.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error("Error loading support messages:", error);
      toast.error("Nu s-au putut încărca mesajele de suport");
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    try {
      setSending(true);
      
      // Optimistically add the message to the UI
      const tempMessage: SupportMessage = {
        id: Date.now().toString(),
        content: message,
        created_at: new Date().toISOString(),
        is_from_user: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setMessage("");
      
      // Send to database
      await sendSupportMessage(user.id, message);
      
      // Auto-response for demo purposes
      setTimeout(() => {
        const autoResponse: SupportMessage = {
          id: (Date.now() + 1).toString(),
          content: "Mulțumim pentru mesaj! Un membru al echipei noastre vă va răspunde în curând.",
          created_at: new Date().toISOString(),
          is_from_user: false
        };
        setMessages(prev => [...prev, autoResponse]);
      }, 1000);
      
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Nu s-a putut trimite mesajul");
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <PageTransition>
        <div className="flex-1 p-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-600" />
                Asistență & Suport
              </h1>
              <p className="text-gray-500 mt-1">
                Echipa noastră de suport îți stă la dispoziție pentru orice întrebare
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar with FAQs */}
            <div className="md:col-span-1">
              <Card className="shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="text-lg font-semibold text-indigo-900">
                    Întrebări frecvente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 mt-2">
                    <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium text-gray-900">Cum pot solicita un proiect nou?</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Accesează pagina "Dashboard" și apasă pe butonul "Solicită Proiect Nou".
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium text-gray-900">Cum pot modifica un proiect?</p>
                      <p className="text-sm text-gray-600 mt-1">
                        În pagina proiectului găsești butonul "Solicită Modificări".
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium text-gray-900">Cum funcționează plățile?</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Plățile se fac conform contractului, de obicei 50% avans și 50% la finalizare.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-800 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Trebuie ajutor urgent?
                    </h3>
                    <p className="text-sm text-gray-700 mt-2">
                      Contactează-ne direct la:
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Email: support@webcreator.com
                    </p>
                    <p className="text-sm font-medium">
                      Telefon: +40 755 123 456
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right side with chat */}
            <Card className="md:col-span-2 shadow-md border-0 flex flex-col">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-indigo-900">
                    Conversație cu echipa de suport
                  </CardTitle>
                  <CardDescription>
                    Timp mediu de răspuns: ~30 minute în timpul programului
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Online
                </Badge>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 max-h-[500px]">
                  {loading ? (
                    <div className="space-y-4 p-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.is_from_user ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${msg.is_from_user ? 'flex-row-reverse' : ''}`}>
                            <Avatar className={`h-9 w-9 ${msg.is_from_user ? 'bg-purple-100' : 'bg-blue-100'}`}>
                              <AvatarFallback className={`${msg.is_from_user ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                                {msg.is_from_user ? user?.name?.charAt(0) || 'U' : 'S'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className={`px-4 py-2 rounded-lg ${
                                msg.is_from_user 
                                  ? 'bg-purple-100 text-purple-900' 
                                  : 'bg-white border border-gray-200 shadow-sm'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatRelativeTime(new Date(msg.created_at))}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-60 text-center p-4">
                      <div className="bg-purple-100 text-purple-700 p-3 rounded-full mb-3">
                        <HelpCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Nicio conversație încă</h3>
                      <p className="text-gray-500 mt-1 max-w-md">
                        Trimite primul tău mesaj pentru a începe o conversație cu echipa noastră de suport.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Scrie un mesaj..."
                      className="flex-1 min-h-[60px] resize-none"
                    />
                    <Button 
                      type="submit" 
                      disabled={!message.trim() || sending}
                      className="self-end bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {sending ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
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

export default Support;
