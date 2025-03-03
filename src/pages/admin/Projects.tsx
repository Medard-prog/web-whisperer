
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProjects, fetchProjectRequests } from "@/integrations/supabase/client";
import { Project } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, FileText, ExternalLink, Filter } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusTranslations: Record<string, { label: string; color: string }> = {
  pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "În lucru", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Finalizat", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Anulat", color: "bg-red-100 text-red-800" },
  new: { label: "Nou", color: "bg-purple-100 text-purple-800" }
};

const AdminProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectRequests, setProjectRequests] = useState<Project[]>([]);
  const [allItems, setAllItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both projects and project requests
        // Pass undefined as userId to fetch all project requests for admin
        const [projectsData, requestsData] = await Promise.all([
          fetchProjects(),
          fetchProjectRequests(undefined)
        ]);
        
        setProjects(projectsData);
        setProjectRequests(requestsData);
        setAllItems([...projectsData, ...requestsData]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Nu s-au putut încărca proiectele");
        toast.error("Nu s-au putut încărca proiectele", {
          description: "Te rugăm să reîncerci mai târziu."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Filter items when tab or search changes
    let filtered = [];
    
    if (activeTab === "all") {
      filtered = [...projects, ...projectRequests];
    } else if (activeTab === "projects") {
      filtered = [...projects];
    } else if (activeTab === "requests") {
      filtered = [...projectRequests];
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.websiteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setAllItems(filtered);
  }, [activeTab, searchQuery, projects, projectRequests]);

  const renderProjectCard = (item: Project) => (
    <Card key={item.id} className={`overflow-hidden ${item.type === 'request' ? 'border-dashed border-purple-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {item.title}
              {item.type === 'request' && (
                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                  Cerere
                </Badge>
              )}
            </CardTitle>
          </div>
          <Badge className={statusTranslations[item.status]?.color || "bg-gray-100"}>
            {statusTranslations[item.status]?.label || item.status}
          </Badge>
        </div>
        <CardDescription>
          {item.createdAt && format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: ro })}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {item.description || "Fără descriere"}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Tip:</span>{" "}
            <span className="text-gray-600">{item.websiteType || "Website"}</span>
          </div>
          <div>
            <span className="font-medium">Preț:</span>{" "}
            <span className="text-gray-600">{item.price ? `${item.price} €` : "La cerere"}</span>
          </div>
          {item.pageCount && (
            <div>
              <span className="font-medium">Pagini:</span>{" "}
              <span className="text-gray-600">{item.pageCount}</span>
            </div>
          )}
          {item.dueDate && (
            <div>
              <span className="font-medium">Termen:</span>{" "}
              <span className="text-gray-600">
                {format(new Date(item.dueDate), 'dd MMM yyyy', { locale: ro })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/admin/project/${item.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Vezi Detalii
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10 w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proiecte</h1>
              <p className="text-gray-600">
                Vezi toate proiectele și statusul lor
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Caută proiecte..."
                  className="px-4 py-2 pl-10 border rounded-md w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Link to="/admin/request">
                  <Plus className="mr-2 h-4 w-4" />
                  Proiect Nou
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="all">Toate ({projects.length + projectRequests.length})</TabsTrigger>
              <TabsTrigger value="projects">Proiecte ({projects.length})</TabsTrigger>
              <TabsTrigger value="requests">Cereri ({projectRequests.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Se încarcă proiectele...</p>
            </div>
          ) : error ? (
            <Card className="border-dashed border-2 bg-red-50 border-red-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Încearcă din nou</Button>
              </CardContent>
            </Card>
          ) : allItems.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nu există proiecte</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Nu există proiecte în baza de date.
                </p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Link to="/admin/request">
                    <Plus className="mr-2 h-4 w-4" />
                    Creează un Proiect
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allItems.map(item => renderProjectCard(item))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminProjects;
