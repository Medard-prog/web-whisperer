
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types";
import { PlusCircle, Search, Filter } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const DashboardProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
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
  
  const filteredProjects = projects.filter((project) => {
    // Filter by search term
    const matchesSearch = 
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    
    // Filter by status
    if (filter === "all") return matchesSearch;
    return matchesSearch && project.status === filter;
  });
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Proiectele mele</h1>
                <p className="text-gray-500">Gestionează și vizualizează proiectele tale</p>
              </div>
              <Link to="/request-project">
                <Button className="bg-brand-600 hover:bg-brand-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Solicită proiect nou
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Caută proiecte..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrează după status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate proiectele</SelectItem>
                    <SelectItem value="pending">În așteptare</SelectItem>
                    <SelectItem value="in_progress">În progres</SelectItem>
                    <SelectItem value="completed">Finalizate</SelectItem>
                    <SelectItem value="cancelled">Anulate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
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
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 p-6 rounded-full">
                  <PlusCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">Niciun proiect găsit</h2>
                <p className="mt-2 text-gray-500">
                  {search || filter !== "all"
                    ? "Niciun proiect nu corespunde criteriilor selectate"
                    : "Nu ai creat încă niciun proiect"}
                </p>
                <Button 
                  className="mt-6 bg-brand-600 hover:bg-brand-700"
                  asChild
                >
                  <Link to="/request-project">Solicită primul tău proiect</Link>
                </Button>
              </div>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default DashboardProjects;
