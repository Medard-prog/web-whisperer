
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { getProjectStatusChartData, getProjectsByPaymentStatus, getTotalRevenueData, getPopularFeaturesData, fetchProjectsForReports } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectStatusData, setProjectStatusData] = useState<any[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date()
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    loadReportData();
  }, [dateRange, statusFilter]);
  
  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Get chart data
      const [statusData, paymentData, revData, featData, projectsData] = await Promise.all([
        getProjectStatusChartData(),
        getProjectsByPaymentStatus(),
        getTotalRevenueData(),
        getPopularFeaturesData(),
        fetchProjectsForReports()
      ]);
      
      setProjectStatusData(statusData);
      setPaymentStatusData(paymentData);
      setRevenueData(revData);
      setFeaturesData(featData);
      
      // Apply filters to projects
      let filteredProjects = projectsData;
      
      // Date filter
      if (dateRange && dateRange.from) {
        filteredProjects = filteredProjects.filter(project => {
          const projectDate = new Date(project.created_at);
          
          if (dateRange.from && dateRange.to) {
            return projectDate >= dateRange.from && projectDate <= dateRange.to;
          } else if (dateRange.from) {
            return projectDate >= dateRange.from;
          }
          
          return true;
        });
      }
      
      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
      }
      
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const getTotalRevenue = () => {
    return projects.reduce((sum, project) => sum + Number(project.price || 0), 0);
  };
  
  const getTotalCollected = () => {
    return projects.reduce((sum, project) => sum + Number(project.amount_paid || 0), 0);
  };
  
  const getProjectsByStatus = () => {
    const result: Record<string, number> = {};
    
    projects.forEach(project => {
      const status = project.status || 'unknown';
      result[status] = (result[status] || 0) + 1;
    });
    
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };
  
  if (loading) {
    return <div className="container mx-auto p-8">Loading reports...</div>;
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalCollected())}</div>
            <p className="text-xs text-gray-500">
              {Math.round((getTotalCollected() / (getTotalRevenue() || 1)) * 100)}% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <Label>Date Range</Label>
          <DateRangePicker 
            value={dateRange}
            onChange={(range) => setDateRange(range)}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <Label>Status Filter</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>
                  Distribution of projects by their current status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getProjectsByStatus()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getProjectsByStatus().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>
                  Distribution of projects by payment status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Popular Features</CardTitle>
                <CardDescription>
                  Most requested features across all projects
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featuresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Projects" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue and payments collected
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="collected" name="Amount Collected" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Project</CardTitle>
              <CardDescription>
                Individual project revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Project</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Paid</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id} className="border-b">
                        <td className="py-2">{project.title}</td>
                        <td className="py-2">{formatCurrency(project.price || 0)}</td>
                        <td className="py-2">{formatCurrency(project.amount_paid || 0)}</td>
                        <td className="py-2">
                          <Badge
                            variant={
                              project.payment_status === 'paid' ? 'default' : 
                              project.payment_status === 'partial' ? 'secondary' : 
                              project.payment_status === 'overdue' ? 'destructive' : 
                              'outline'
                            }
                          >
                            {project.payment_status || 'pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
              <CardDescription>
                All projects with their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Project</th>
                      <th className="text-left py-2">Created</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Revenue</th>
                      <th className="text-left py-2">Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id} className="border-b">
                        <td className="py-2">{project.title}</td>
                        <td className="py-2">{format(new Date(project.created_at), 'MMM dd, yyyy')}</td>
                        <td className="py-2">
                          <Badge
                            variant={
                              project.status === 'completed' ? 'default' : 
                              project.status === 'in_progress' ? 'secondary' : 
                              project.status === 'cancelled' ? 'destructive' : 
                              'outline'
                            }
                          >
                            {project.status}
                          </Badge>
                        </td>
                        <td className="py-2">{formatCurrency(project.price || 0)}</td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {project.has_ecommerce && <Badge variant="outline">E-commerce</Badge>}
                            {project.has_cms && <Badge variant="outline">CMS</Badge>}
                            {project.has_seo && <Badge variant="outline">SEO</Badge>}
                            {project.has_maintenance && <Badge variant="outline">Maintenance</Badge>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
