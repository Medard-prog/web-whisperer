
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, User } from "@/types";
import { BarChart3, Users, FolderKanban, Clock, MessageSquare, DollarSign } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (projectsError) throw projectsError;
        
        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_admin', false)
          .limit(5);
          
        if (clientsError) throw clientsError;
        
        setProjects(projectsData || []);
        setClients(clientsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca datele. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Panou Administrator</h1>
              <p className="text-gray-500">Bine ai revenit, {user?.name || 'Admin'}!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Proiecte active
                  </CardTitle>
                  <FolderKanban className="h-4 w-4 text-brand-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      projects.filter(p => p.status === 'in_progress').length
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Proiecte în dezvoltare
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Clienți
                  </CardTitle>
                  <Users className="h-4 w-4 text-brand-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      clients.length
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Total clienți
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Sarcini active
                  </CardTitle>
                  <Clock className="h-4 w-4 text-brand-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <p className="text-xs text-gray-500">
                    De finalizat săptămâna aceasta
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Venituri
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-brand-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Luna aceasta
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="projects" className="space-y-4">
              <TabsList>
                <TabsTrigger value="projects">Proiecte recente</TabsTrigger>
                <TabsTrigger value="clients">Clienți</TabsTrigger>
                <TabsTrigger value="tasks">Sarcini</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Proiecte recente</h2>
                  <Link to="/admin/projects">
                    <Button variant="outline">Vezi toate proiectele</Button>
                  </Link>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <Skeleton className="h-6 w-24 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-28 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.status as any}
                        date={project.createdAt}
                        dueDate={project.dueDate}
                        price={project.price}
                        messagesCount={0} // This would need to be fetched separately
                        isAdmin={true}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <FolderKanban className="h-12 w-12 text-gray-300 mb-4" />
                      <CardTitle className="text-xl mb-2">Niciun proiect</CardTitle>
                      <CardDescription className="mb-6">
                        Nu există proiecte active în sistem.
                      </CardDescription>
                      <Button className="bg-brand-600 hover:bg-brand-700">
                        Adaugă proiect nou
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="clients" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Clienți recenți</h2>
                  <Link to="/admin/clients">
                    <Button variant="outline">Vezi toți clienții</Button>
                  </Link>
                </div>
                
                {loading ? (
                  <Card>
                    <CardContent className="py-6">
                      <Skeleton className="h-10 w-full mb-4" />
                      <Skeleton className="h-10 w-full mb-4" />
                      <Skeleton className="h-10 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ) : clients.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {clients.map((client) => (
                          <div key={client.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                                {client.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Vezi detalii
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <Users className="h-12 w-12 text-gray-300 mb-4" />
                      <CardTitle className="text-xl mb-2">Niciun client</CardTitle>
                      <CardDescription>
                        Nu există clienți înregistrați în sistem.
                      </CardDescription>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Sarcini active</h2>
                  <Link to="/admin/tasks">
                    <Button variant="outline">Vezi toate sarcinile</Button>
                  </Link>
                </div>
                
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Clock className="h-12 w-12 text-gray-300 mb-4" />
                    <CardTitle className="text-xl mb-2">Nicio sarcină activă</CardTitle>
                    <CardDescription className="mb-6">
                      Nu există sarcini active în sistem.
                    </CardDescription>
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      Adaugă sarcină nouă
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Activity Feed or Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Mesaje recente</CardTitle>
                <CardDescription>
                  Ultimele mesaje de la clienți
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Nu există mesaje recente de la clienți.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default AdminDashboard;
