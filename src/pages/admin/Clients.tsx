
// Update import only
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { fetchUsers } from "@/integrations/supabase/client";
import { User } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { toast } from "sonner";
import { SearchIcon, Mail, Phone, Building, UserPlus } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminClients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const allUsers = await fetchUsers();
        
        // Filter out admins for client list
        const clientUsers = allUsers.filter(u => !u.isAdmin);
        
        setClients(clientUsers);
      } catch (error) {
        console.error("Error loading clients:", error);
        toast.error("Eroare la încărcarea clienților", {
          description: "Încercați din nou mai târziu"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadClients();
  }, []);
  
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Clienți</h1>
              <p className="text-gray-600">
                Gestionează și vezi detalii despre toți clienții
              </p>
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Caută clienți..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[260px]"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Client Nou
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Se încarcă clienții...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {searchTerm ? "Nu s-au găsit clienți" : "Nu există clienți"}
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {searchTerm 
                    ? `Nu s-au găsit clienți pentru "${searchTerm}". Încercați alte cuvinte cheie.` 
                    : "Nu există clienți în sistem momentan."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(client => (
                <Card key={client.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{client.name || 'Unnamed Client'}</CardTitle>
                    <CardDescription>{client.company || 'Individual'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.company && (
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{client.company}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toast.info("Funcționalitate în dezvoltare")}
                      >
                        Profilul
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toast.info("Funcționalitate în dezvoltare")}
                      >
                        Mesaje
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminClients;
