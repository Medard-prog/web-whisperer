
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "@/integrations/supabase/client";
import { Project } from "@/types";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { PlusCircle, Search, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";

// Utility function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get status color based on project status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'new':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'pending':
    default:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.websiteType?.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query)
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);
  
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <main className="flex-1 p-6">
        <PageTransition>
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                <p className="text-gray-500">Manage your client projects</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button onClick={() => navigate("/admin/projects/new")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Projects</CardTitle>
                <CardDescription>View and manage all client projects from one place</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              {project.title}
                            </TableCell>
                            <TableCell>{project.userId || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {project.websiteType || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`capitalize ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(project.createdAt)}</TableCell>
                            <TableCell>€{project.price}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/project/${project.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium">No projects found</h3>
                    <p className="mt-1 text-gray-500">
                      {searchQuery ? "Try a different search query" : "Create a new project to get started"}
                    </p>
                    {!searchQuery && (
                      <Button className="mt-4" onClick={() => navigate("/admin/projects/new")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default AdminProjects;
