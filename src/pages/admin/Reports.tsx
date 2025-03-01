
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Line,
  Pie,
  Cell
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { addDays, format, subDays, subMonths, differenceInDays, addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/LoadingScreen';

interface ProjectsByStatusData {
  name: string;
  value: number;
}

interface ProjectsByMonthData {
  month: string;
  count: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  projected: number;
}

interface PaymentStatusData {
  name: string;
  value: number;
}

interface MostPopularFeaturesData {
  name: string;
  count: number;
}

interface ProjectsRequest {
  id: string;
  project_name: string;
  status: string;
  price: number;
  created_at: string;
  has_ecommerce: boolean;
  has_cms: boolean;
  has_seo: boolean;
  has_maintenance: boolean;
  payment_status: string;
  amount_paid: number;
}

interface ProjectsData {
  id: string;
  title: string;
  status: string;
  price: number;
  created_at: string;
  has_ecommerce: boolean;
  has_cms: boolean;
  has_seo: boolean;
  has_maintenance: boolean;
  payment_status: string;
  amount_paid: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminReports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [projectsByStatus, setProjectsByStatus] = useState<ProjectsByStatusData[]>([]);
  const [projectsByMonth, setProjectsByMonth] = useState<ProjectsByMonthData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<PaymentStatusData[]>([]);
  const [popularFeatures, setPopularFeatures] = useState<MostPopularFeaturesData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 6),
    to: new Date()
  });
  
  // Load report data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Combined projects and project requests
        let allProjects: Array<any> = [];
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, status, price, created_at, has_ecommerce, has_cms, has_seo, has_maintenance, payment_status, amount_paid');
          
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }
        
        // Fetch project requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('project_requests')
          .select('id, project_name, status, price, created_at, has_ecommerce, has_cms, has_seo, has_maintenance, payment_status, amount_paid');
          
        if (requestsError) {
          console.error('Error fetching project requests:', requestsError);
          throw requestsError;
        }
        
        // Map project requests to match project structure
        const mappedRequests = (requestsData || []).map((request: ProjectsRequest) => ({
          id: request.id,
          title: request.project_name,
          status: request.status === 'new' ? 'pending' : request.status,
          price: request.price || 0,
          created_at: request.created_at,
          has_ecommerce: request.has_ecommerce || false,
          has_cms: request.has_cms || false,
          has_seo: request.has_seo || false,
          has_maintenance: request.has_maintenance || false,
          payment_status: request.payment_status || 'pending',
          amount_paid: request.amount_paid || 0
        }));
        
        // Combine both data sources
        allProjects = [...(projectsData || []), ...mappedRequests];
        
        // Filter by date range
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        allProjects = allProjects.filter(project => {
          const projectDate = new Date(project.created_at);
          return projectDate >= dateRange.from && projectDate <= dateRange.to;
        });
        
        // Process data for different charts
        processProjectsByStatus(allProjects);
        processProjectsByMonth(allProjects);
        processRevenueData(allProjects);
        processPaymentStatusData(allProjects);
        processPopularFeatures(allProjects);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading report data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast, dateRange]);
  
  // Process data for projects by status chart
  const processProjectsByStatus = (projects: ProjectsData[]) => {
    const statusCounts: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    projects.forEach(project => {
      const status = project.status as string;
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });
    
    const chartData: ProjectsByStatusData[] = Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value
    }));
    
    setProjectsByStatus(chartData);
  };
  
  // Process data for projects by month chart
  const processProjectsByMonth = (projects: ProjectsData[]) => {
    const months: Record<string, number> = {};
    
    // Initialize months in range
    let currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to) {
      const monthKey = format(currentDate, 'MMM yyyy');
      months[monthKey] = 0;
      currentDate = addMonths(currentDate, 1);
    }
    
    // Count projects by month
    projects.forEach(project => {
      const date = new Date(project.created_at);
      const monthKey = format(date, 'MMM yyyy');
      if (months[monthKey] !== undefined) {
        months[monthKey]++;
      }
    });
    
    const chartData: ProjectsByMonthData[] = Object.entries(months).map(([month, count]) => ({
      month,
      count
    }));
    
    setProjectsByMonth(chartData);
  };
  
  // Process data for revenue chart
  const processRevenueData = (projects: ProjectsData[]) => {
    const monthlyRevenue: Record<string, { actual: number; projected: number }> = {};
    
    // Initialize months in range
    let currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to) {
      const monthKey = format(currentDate, 'MMM yyyy');
      monthlyRevenue[monthKey] = { actual: 0, projected: 0 };
      currentDate = addMonths(currentDate, 1);
    }
    
    // Calculate revenue by month
    projects.forEach(project => {
      const date = new Date(project.created_at);
      const monthKey = format(date, 'MMM yyyy');
      
      if (monthlyRevenue[monthKey]) {
        // Add actual received payments
        monthlyRevenue[monthKey].actual += (project.amount_paid || 0);
        
        // Add total price to projected revenue
        monthlyRevenue[monthKey].projected += (project.price || 0);
      }
    });
    
    const chartData: RevenueData[] = Object.entries(monthlyRevenue).map(([month, data]) => ({
      month,
      revenue: data.actual,
      projected: data.projected
    }));
    
    setRevenueData(chartData);
  };
  
  // Process data for payment status chart
  const processPaymentStatusData = (projects: ProjectsData[]) => {
    const paymentStatusCounts: Record<string, number> = {
      pending: 0,
      partial: 0,
      paid: 0,
      overdue: 0
    };
    
    projects.forEach(project => {
      const status = project.payment_status || 'pending';
      if (paymentStatusCounts[status] !== undefined) {
        paymentStatusCounts[status]++;
      } else {
        paymentStatusCounts[status] = 1;
      }
    });
    
    const chartData: PaymentStatusData[] = Object.entries(paymentStatusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    setPaymentStatusData(chartData);
  };
  
  // Process data for popular features chart
  const processPopularFeatures = (projects: ProjectsData[]) => {
    const featureCounts = {
      'E-commerce': 0,
      'CMS': 0,
      'SEO': 0,
      'Maintenance': 0
    };
    
    projects.forEach(project => {
      if (project.has_ecommerce) featureCounts['E-commerce']++;
      if (project.has_cms) featureCounts['CMS']++;
      if (project.has_seo) featureCounts['SEO']++;
      if (project.has_maintenance) featureCounts['Maintenance']++;
    });
    
    const chartData: MostPopularFeaturesData[] = Object.entries(featureCounts).map(([name, count]) => ({
      name,
      count
    }));
    
    setPopularFeatures(chartData);
  };
  
  // Set date range presets
  const handleDatePreset = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date()
    });
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View and analyze your project data</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">Date Range</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDatePreset(30)}>Last 30 Days</Button>
            <Button variant="outline" size="sm" onClick={() => handleDatePreset(90)}>Last 3 Months</Button>
            <Button variant="outline" size="sm" onClick={() => handleDatePreset(180)}>Last 6 Months</Button>
            <Button variant="outline" size="sm" onClick={() => handleDatePreset(365)}>Last Year</Button>
          </div>
        </div>
        
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Distribution of projects by their current status</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projects by Month</CardTitle>
            <CardDescription>Number of new projects created each month</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                  <Legend />
                  <Bar dataKey="count" name="Projects" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Actual vs projected revenue by month</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="projected" name="Projected Revenue" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Distribution of projects by payment status</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Most Popular Features</CardTitle>
            <CardDescription>Features most requested by clients</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularFeatures} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                  <Legend />
                  <Bar dataKey="count" name="Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
