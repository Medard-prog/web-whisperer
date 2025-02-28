
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
import { Project } from "@/types";
import { PlusCircle, Contact2, CreditCard, Calendar, Bell, LayoutDashboard } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca proiectele. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user, toast]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Salut, {user?.name || 'Client'}!</h1>
              <p className="text-gray-500">Bine ai revenit în contul tău WebCreator</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Proiecte active
                  </CardTitle>
                  <LayoutDashboard className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Proiecte în lucru
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Mesaje noi
                  </CardTitle>
                  <Bell className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Din ultimele 7 zile
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Facturi scadente
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Plăți în așteptare
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Întâlniri programate
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Pentru următoarele 30 zile
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="projects" className="space-y-4">
              <TabsList>
                <TabsTrigger value="projects">Proiectele mele</TabsTrigger>
                <TabsTrigger value="messages">Mesaje recente</TabsTrigger>
                <TabsTrigger value="invoices">Facturi</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Proiectele mele recente</h2>
                  <Link to="/dashboard/projects">
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
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <PlusCircle className="h-12 w-12 text-gray-300 mb-4" />
                      <CardTitle className="text-xl mb-2">Niciun proiect activ</CardTitle>
                      <CardDescription className="mb-6">
                        Nu ai creat încă niciun proiect. Solicită o ofertă pentru a începe.
                      </CardDescription>
                      <Link to="/request-project">
                        <Button className="bg-brand-600 hover:bg-brand-700">
                          Solicită ofertă
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="messages" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mesaje recente</CardTitle>
                    <CardDescription>
                      Nu ai mesaje noi în ultimele 7 zile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Contact2 className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Comunicarea cu echipa noastră se face prin secțiunea de mesaje a fiecărui proiect.
                    </p>
                    {projects.length > 0 && (
                      <Link to={`/dashboard/projects/${projects[0].id}`}>
                        <Button variant="outline">
                          Vezi proiectul recent
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Facturi</CardTitle>
                    <CardDescription>
                      Nu ai facturi în așteptare.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Facturile și plățile pentru proiectele tale vor apărea aici.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Dashboard;
