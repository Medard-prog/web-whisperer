
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import PageTransition from "@/components/PageTransition";

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_admin: boolean;
  user_id: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Nu s-au putut încărca mesajele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `user_id=eq.${user?.id}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          user_id: user?.id,
          is_admin: false
        });
        
      if (error) throw error;
      
      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Nu s-a putut trimite mesajul", {
        description: error.message || "Te rugăm să încerci din nou."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10 flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Mesaje</h1>
            <p className="text-gray-600">
              Discuții cu echipa noastră de suport
            </p>
          </div>
          
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Conversația ta cu Echipa WebWhisperer</h2>
            </div>
            
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
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.is_admin 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.is_admin ? 'text-gray-500' : 'text-purple-100'}`}>
                        {format(new Date(message.created_at), 'dd MMM yyyy, HH:mm', { locale: ro })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            
            <div className="p-4 border-t mt-auto">
              <form onSubmit={sendMessage} className="flex gap-2">
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
                  disabled={isSending || !newMessage.trim()}
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

export default Messages;
