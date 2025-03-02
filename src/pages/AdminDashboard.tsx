import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth";
import { supabase, fetchProjects, fetchUsers } from "@/integrations/supabase/client";
import { Project, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { UsersRound, FolderKanban, CheckCircle, Clock, Users, LayoutDashboard, FileText, Mail, Phone, Building, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/ProjectCard";
import PageTransition from "@/components/PageTransition";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects and users using our helper functions
        const projectsData = await fetchProjects();
        const usersData = await fetchUsers();
        
        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut încărca datele. Încearcă din nou.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.websiteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Analytics data
  const statusData = [
    { name: "În curs", value: projects.filter(p => p.status === "in_progress").length },
    { name: "Finalizat", value: projects.filter(p => p.status === "completed").length },
    { name: "În așteptare", value: projects.filter(p => p.status === "pending").length },
    { name: "Anulat", value: projects.filter(p => p.status === "cancelled").length },
  ];
  
  const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444'];
  
  const websiteTypeData = [
    { name: "Landing", value: projects.filter(p => p.websiteType === "landing").length },
    { name: "Blog", value: projects.filter(p => p.websiteType === "blog").length },
    { name: "E-commerce", value: projects.filter(p => p.websiteType === "ecommerce").length },
    { name: "Prezentare", value: projects.filter(p => p.websiteType === "presentation").length },
    { name: "Altele", value: projects.filter(p => p.websiteType && !["landing", "blog", "ecommerce", "presentation"].includes(p.websiteType)).length },
  ].filter(item => item.value > 0);
  
  // Functions to get project statistics
  const getCompletionRate = () => {
    const completed = projects.filter(p => p.status === "completed").length;
    return projects.length ? Math.round((completed / projects.length) * 100) : 0;
  };
  
  const getAverageProjectSize = () => {
    if (!projects.length) return 0;
    const total = projects.reduce((acc, project) => acc + (project.pageCount || 0), 0);
    return Math.round(total / projects.length);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
                <p className="text-gray-500">Gestionează proiectele și utilizatorii</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Caută proiecte sau utilizatori..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FolderKanban className="h-5 w-5 mr-2 text-blue-500" />
                    Proiecte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-bold">{projects.length}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Proiecte totale</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    Utilizatori
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-bold">{users.length}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Clienți înregistrați</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    Finalizare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-bold">{getCompletionRate()}%</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Rata de finalizare</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                    Pagini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-bold">{getAverageProjectSize()}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Media paginilor per proiect</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LayoutDashboard className="h-5 w-5 mr-2 text-indigo-500" />
                    Statistici proiecte
                  </CardTitle>
                  <CardDescription>Distribuția proiectelor după status</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-500" />
                    Tipuri de website
                  </CardTitle>
                  <CardDescription>Distribuția proiectelor după tip</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-48 w-full" />
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={websiteTypeData}
                          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Latest Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FolderKanban className="h-5 w-5 mr-2 text-blue-500" />
                  Proiecte recente
                </CardTitle>
                <CardDescription>
                  {filteredProjects.length} proiecte în total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.slice(0, 6).map((project) => (
                      <ProjectCard key={project.id} project={project} onClick={() => navigate(`/project/${project.id}`)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FolderKanban className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Nu există proiecte</h3>
                    <p className="text-gray-500">Nu a fost găsit niciun proiect care să corespundă criteriilor de căutare.</p>
                  </div>
                )}
                
                {filteredProjects.length > 6 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => navigate('/projects')}>
                      Vezi toate proiectele
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UsersRound className="h-5 w-5 mr-2 text-green-500" />
                  Utilizatori recenți
                </CardTitle>
                <CardDescription>
                  {filteredUsers.length} utilizatori în total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUsers.slice(0, 5).map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name || "Utilizator"}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {user.isAdmin && (
                            <Badge variant="outline" className="mb-1 text-purple-700 border-purple-200 bg-purple-50">
                              Admin
                            </Badge>
                          )}
                          <div className="flex space-x-2">
                            {user.phone && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Phone className="h-4 w-4 text-gray-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4 text-gray-500" />
                            </Button>
                            {user.company && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Building className="h-4 w-4 text-gray-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <UsersRound className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Nu există utilizatori</h3>
                    <p className="text-gray-500">Nu a fost găsit niciun utilizator care să corespundă criteriilor de căutare.</p>
                  </div>
                )}
                
                {filteredUsers.length > 5 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => navigate('/users')}>
                      Vezi toți utilizatorii
                    </Button>
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

export default AdminDashboard;
