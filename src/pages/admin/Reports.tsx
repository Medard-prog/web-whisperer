import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProjectStatusChartData, getProjectsByPaymentStatus, getTotalRevenueData, getPopularFeaturesData, fetchProjectsForReports } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { BarChart, PieChart, LineChart, ResponsiveContainer, Bar, Pie, Line, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Cell } from "recharts";
import { BarChart2, FileText, DollarSign, TrendingUp, Download, CalendarRange, Filter } from "lucide-react";
import { Project } from "@/types";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#228B22', '#8A2BE2'];

const Reports = () => {
  const { user } = useAuth();
  const [projectStatusData, setProjectStatusData] = useState<{ name: string; value: number; }[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<{ name: string; value: number; }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; total: number; collected: number; }[]>([]);
  const [popularFeaturesData, setPopularFeaturesData] = useState<{ name: string; value: any; }[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date; }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("monthly");
  
  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        
        const statusData = await getProjectStatusChartData();
        setProjectStatusData(statusData);
        
        const paymentData = await getProjectsByPaymentStatus();
        setPaymentStatusData(paymentData);
        
        const revenue = await getTotalRevenueData();
        setRevenueData(revenue);
        
        const features = await getPopularFeaturesData();
        setPopularFeaturesData(features);
        
        const fetchedProjects = await fetchProjectsForReports(dateRange);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error loading report data:", error);
        toast.error("Eroare la încărcarea datelor pentru raport", {
          description: "Încercați din nou mai târziu"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadReportData();
  }, [dateRange]);
  
  const downloadReport = () => {
    // Implement report download logic here
    toast.info("Se descarcă raportul...", {
      description: "Această funcționalitate va fi implementată în curând"
    });
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Rapoarte</h1>
              <p className="text-gray-600">
                Analizează datele proiectelor și performanța generală
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              <Select onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tip raport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Lunar</SelectItem>
                  <SelectItem value="quarterly">Trimestrial</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={downloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Descarcă Raport
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 mr-1" />
                Prezentare generală
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FileText className="h-4 w-4 mr-1" />
                Proiecte
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 mr-1" />
                Venituri
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                Tendințe
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 mr-1" />
                      Status Proiecte
                    </CardTitle>
                    <CardDescription>Distribuția proiectelor după status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center">
                        <Skeleton className="w-40 h-8" />
                      </div>
                    ) : projectStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={projectStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {projectStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">Nu există date</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 mr-1" />
                      Status Plăți
                    </CardTitle>
                    <CardDescription>Distribuția proiectelor după statusul plăților</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center">
                        <Skeleton className="w-40 h-8" />
                      </div>
                    ) : paymentStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={paymentStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#82ca9d"
                            label
                          >
                            {paymentStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">Nu există date</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Funcții Populare
                    </CardTitle>
                    <CardDescription>Cele mai solicitate funcții în proiecte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center">
                        <Skeleton className="w-40 h-8" />
                      </div>
                    ) : popularFeaturesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={popularFeaturesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">Nu există date</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4 mr-1" />
                    Lista Proiecte
                  </CardTitle>
                  <CardDescription>Toate proiectele în intervalul selectat</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center">
                      <Skeleton className="w-40 h-8" />
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Titlu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Creat la
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Preț
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projects.map((project) => (
                            <tr key={project.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {project.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {project.status}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(project.createdAt), "dd/MM/yyyy")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {project.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">Nu există proiecte în intervalul selectat</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Venituri Lunare
                  </CardTitle>
                  <CardDescription>Venituri totale și încasate lunar</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center">
                      <Skeleton className="w-40 h-8" />
                    </div>
                  ) : revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="collected" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8">Nu există date despre venituri</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Tendințe
                  </CardTitle>
                  <CardDescription>Analiza tendințelor pe baza datelor colectate</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center">
                      <Skeleton className="w-40 h-8" />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Graficele și analiza tendințelor vor fi implementate în curând.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </div>
  );
};

export default Reports;
