
// Update import only
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { fetchUsers, fetchProjectMessages } from "@/integrations/supabase/client";
import { User, Message } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { SearchIcon, MessageSquare, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminMessages = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const allUsers = await fetchUsers();
        
        // Filter out admins for client list
        const clientUsers = allUsers.filter(u => !u.isAdmin);
        setClients(clientUsers);
        
        // Fetch all support messages (those without project_id)
        // This would need to be implemented in the supabase client
        // For now, we'll show a placeholder
        setAllMessages([]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Eroare la încărcarea datelor", {
          description: "Încercați din nou mai târziu"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mesaje</h1>
              <p className="text-gray-600">
                Gestionează mesajele de la clienți și răspunde la întrebări
              </p>
            </div>
            
            <div className="relative flex-1 sm:flex-initial">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Caută în mesaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[260px]"
              />
            </div>
          </div>
          
          <Tabs defaultValue="support">
            <TabsList className="mb-6">
              <TabsTrigger value="support" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                Mesaje Suport
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Clienți
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="support">
              {loading ? (
                <div className="text-center py-12">
                  <p>Se încarcă mesajele...</p>
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Mesaje de Suport Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>Funcționalitate în dezvoltare</p>
                      <p className="text-sm">Mesajele de suport vor fi afișate aici.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="clients">
              {loading ? (
                <div className="text-center py-12">
                  <p>Se încarcă clienții...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.slice(0, 9).map(client => (
                    <Card key={client.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{client.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{client.name || 'Unnamed Client'}</h3>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => toast.info("Funcționalitate în dezvoltare")}
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Mesaje
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminMessages;
