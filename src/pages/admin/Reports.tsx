import { useState, useEffect } from "react";
import { 
  getProjectStatusChartData, 
  getProjectsByPaymentStatus, 
  getTotalRevenueData, 
  getPopularFeaturesData,
  fetchProjectsForReports
} from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format, subMonths, isWithinInterval } from "date-fns";
import { ro } from "date-fns/locale";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line
} from "recharts";
import { 
  BarChart3, CalendarRange, Download, 
  FileSpreadsheet, Search, SlidersHorizontal 
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#6b7280'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  new: 'bg-purple-100 text-purple-800 border-purple-200',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const Reports = () => {
  const [statusData, setStatusData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [projectsTableData, setProjectsTableData] = useState<any[]>([]);
  const [filteredProjectsData, setFilteredProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string[]>([]);
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string[]>([]);
  
  // Date formatting helper
  const formatDateForDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ro });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [
          projectStatusData,
          projectsPaymentData,
          revenueMetrics,
          popularFeatures,
          allProjects
        ] = await Promise.all([
          getProjectStatusChartData(),
          getProjectsByPaymentStatus(),
          getTotalRevenueData(),
          getPopularFeaturesData(),
          fetchProjectsForReports()
        ]);
        
        setStatusData(projectStatusData);
        setPaymentData(projectsPaymentData);
        setRevenueData(revenueMetrics);
        setFeaturesData(popularFeatures);
        setProjectsTableData(allProjects);
        setFilteredProjectsData(allProjects);
      } catch (error) {
        console.error("Error loading report data:", error);
        toast.error("Nu s-au putut încărca datele pentru rapoarte", {
          description: "Vă rugăm să încercați din nou mai târziu."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    // Apply filters when changed
    filterProjects();
  }, [searchTerm, dateRange, selectedStatusFilter, selectedPaymentFilter, projectsTableData]);
  
  const filterProjects = () => {
    if (!projectsTableData.length) return;
    
    let filteredData = [...projectsTableData];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(project => 
        project.title?.toLowerCase().includes(term) || 
        project.id?.toLowerCase().includes(term)
      );
    }
    
    // Apply date range filter
    if (dateRange?.from) {
      filteredData = filteredData.filter(project => {
        const projectDate = new Date(project.created_at);
        
        // If we only have a "from" date
        if (dateRange.from && !dateRange.to) {
          return projectDate >= dateRange.from;
        }
        
        // If we have both dates
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(projectDate, {
            start: dateRange.from,
            end: dateRange.to
          });
        }
        
        return true;
      });
    }
    
    // Apply status filter
    if (selectedStatusFilter.length > 0) {
      filteredData = filteredData.filter(project => 
        selectedStatusFilter.includes(project.status)
      );
    }
    
    // Apply payment status filter
    if (selectedPaymentFilter.length > 0) {
      filteredData = filteredData.filter(project => 
        selectedPaymentFilter.includes(project.payment_status)
      );
    }
    
    setFilteredProjectsData(filteredData);
  };
  
  const handleExportData = () => {
    // Simple CSV export of the filtered data
    const headers = [
      'ID', 
      'Title', 
      'Status', 
      'Created Date', 
      'Price', 
      'Amount Paid', 
      'Payment Status'
    ].join(',');
    
    const rows = filteredProjectsData.map(project => [
      project.id,
      `"${project.title || 'N/A'}"`, // Wrap in quotes to handle commas in titles
      project.status,
      project.created_at ? format(new Date(project.created_at), 'yyyy-MM-dd') : 'N/A',
      project.price || 0,
      project.amount_paid || 0,
      project.payment_status || 'pending'
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `project_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const toggleFilter = (filter: string, type: 'status' | 'payment') => {
    if (type === 'status') {
      if (selectedStatusFilter.includes(filter)) {
        setSelectedStatusFilter(selectedStatusFilter.filter(f => f !== filter));
      } else {
        setSelectedStatusFilter([...selectedStatusFilter, filter]);
      }
    } else {
      if (selectedPaymentFilter.includes(filter)) {
        setSelectedPaymentFilter(selectedPaymentFilter.filter(f => f !== filter));
      } else {
        setSelectedPaymentFilter([...selectedPaymentFilter, filter]);
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Rapoarte</h1>
                <p className="text-gray-600">
                  Analizează datele proiectelor și performanța afacerii
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtre
                </Button>
                
                <Button
                  onClick={handleExportData}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Date
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Dashboard Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {loading ? "..." : filteredProjectsData.length}
                      </div>
                      <p className="text-sm text-gray-500">Total Proiecte</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {loading ? "..." : `${
                          revenueData.reduce((sum, month) => sum + (Number(month.total) || 0), 0)
                        } RON`}
                      </div>
                      <p className="text-sm text-gray-500">Venituri Totale</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {loading ? "..." : filteredProjectsData.filter(p => p.status === 'completed').length}
                      </div>
                      <p className="text-sm text-gray-500">Proiecte Finalizate</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {loading ? "..." : filteredProjectsData.filter(p => p.status === 'in_progress').length}
                      </div>
                      <p className="text-sm text-gray-500">Proiecte Active</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Proiecte după Status</CardTitle>
                    <CardDescription>Distribuția proiectelor pe status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 flex items-center justify-center">
                        <p>Se încarcă...</p>
                      </div>
                    ) : statusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Nu există date disponibile</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Status Plăți</CardTitle>
                    <CardDescription>Distribuția proiectelor după statusul plății</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 flex items-center justify-center">
                        <p>Se încarcă...</p>
                      </div>
                    ) : paymentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={paymentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Nu există date disponibile</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Funcționalități Populare</CardTitle>
                    <CardDescription>Cele mai cerute funcționalități</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 flex items-center justify-center">
                        <p>Se încarcă...</p>
                      </div>
                    ) : featuresData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={featuresData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Nu există date disponibile</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Venituri Lunare</CardTitle>
                  <CardDescription>Evoluția veniturilor totale și încasate lunar</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <p>Se încarcă...</p>
                    </div>
                  ) : revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} RON`} />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="collected" stroke="#10b981" name="Încasat" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-500">Nu există date disponibile</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Projects Table */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <CardTitle>Lista Proiecte</CardTitle>
                    <CardDescription>Toate proiectele din perioada selectată</CardDescription>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex gap-2 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Caută proiecte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-full sm:w-[260px]"
                      />
                    </div>
                    
                    <DateRangePicker
                      value={dateRange}
                      onChange={(range: DateRange) => setDateRange(range)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-32 flex items-center justify-center">
                      <p>Se încarcă...</p>
                    </div>
                  ) : filteredProjectsData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Proiect</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Preț</TableHead>
                            <TableHead>Plătit</TableHead>
                            <TableHead>Status Plată</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProjectsData.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell>
                                <div className="font-medium">{project.title || "Fără titlu"}</div>
                                <div className="text-sm text-gray-500">{project.id}</div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100'}>
                                  {project.status || 'unknown'}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDateForDisplay(project.created_at)}</TableCell>
                              <TableCell>{project.price.toLocaleString()} RON</TableCell>
                              <TableCell>{(project.amount_paid || 0).toLocaleString()} RON</TableCell>
                              <TableCell>
                                <Badge className={paymentStatusColors[project.payment_status as keyof typeof paymentStatusColors] || 'bg-gray-100'}>
                                  {project.payment_status || 'pending'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nu s-au găsit proiecte</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Nu există proiecte care să corespundă criteriilor de căutare.
                        Încercați să schimbați filtrele sau perioada selectată.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
      
      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrează rezultatele</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Status Proiect</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(statusColors).map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatusFilter.includes(status) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedStatusFilter.includes(status) ? 'bg-primary' : ''}`}
                    onClick={() => toggleFilter(status, 'status')}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Status Plată</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(paymentStatusColors).map((status) => (
                  <Badge
                    key={status}
                    variant={selectedPaymentFilter.includes(status) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedPaymentFilter.includes(status) ? 'bg-primary' : ''}`}
                    onClick={() => toggleFilter(status, 'payment')}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Interval de date</h3>
              <DateRangePicker 
                value={dateRange}
                onChange={(range: DateRange) => setDateRange(range)}
              />
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedStatusFilter([]);
                  setSelectedPaymentFilter([]);
                  setDateRange({
                    from: subMonths(new Date(), 6),
                    to: new Date(),
                  });
                }}
              >
                Resetează
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Aplică filtre
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
