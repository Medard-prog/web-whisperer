
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Search, UserPlus, Mail, Phone, ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

const AdminClients = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_admin', false)
          .order('name', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca clienții. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [toast]);
  
  const filteredClients = clients.filter((client) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.phone && client.phone.includes(search)) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Clienți</h1>
                <p className="text-gray-500">Gestionează și vizualizează toți clienții</p>
              </div>
              <Button className="bg-brand-600 hover:bg-brand-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Adaugă client nou
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Caută clienți după nume, email sau companie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : filteredClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center">
                          Nume
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Companie</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold mr-2">
                              {client.name.charAt(0)}
                            </div>
                            {client.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a 
                            href={`mailto:${client.email}`} 
                            className="flex items-center text-brand-600 hover:underline"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            {client.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {client.phone ? (
                            <a 
                              href={`tel:${client.phone}`} 
                              className="flex items-center text-brand-600 hover:underline"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              {client.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">Nespecificat</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {client.company || (
                            <span className="text-gray-400">Nespecificat</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            Vezi detalii
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full">
                    <UserPlus className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">Niciun client găsit</h2>
                  <p className="mt-2 text-gray-500">
                    {search
                      ? "Niciun client nu corespunde criteriilor de căutare"
                      : "Nu există încă niciun client în sistem"}
                  </p>
                  <Button 
                    className="mt-6 bg-brand-600 hover:bg-brand-700"
                  >
                    Adaugă primul client
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default AdminClients;
