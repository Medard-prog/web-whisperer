
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getProjectStatusChartData, 
  getProjectsByPaymentStatus, 
  getTotalRevenueData, 
  getPopularFeaturesData,
  fetchProjectsForReports 
} from '@/integrations/supabase/services/analyticsService';
import DashboardSidebar from '@/components/DashboardSidebar';
import PageTransition from '@/components/PageTransition';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, 
  Area, AreaChart
} from 'recharts';
import { LayoutDashboard, FileText, CreditCard, Users, Calendar, ArrowUpRight } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-gray-700">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Reports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  
  const [statusData, setStatusData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statusChartData = await getProjectStatusChartData();
        const paymentStatusData = await getProjectsByPaymentStatus();
        const revenueChartData = await getTotalRevenueData();
        const featuresChartData = await getPopularFeaturesData();
        const projectsData = await fetchProjectsForReports(dateRange);
        
        setStatusData(statusChartData);
        setPaymentData(paymentStatusData);
        setRevenueData(revenueChartData);
        setFeaturesData(featuresChartData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const avgRevenuePerProject = projects.length > 0 ? totalRevenue / projects.length : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <PageTransition>
        <div className="flex-1 p-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                Rapoarte și Analiză
              </h1>
              <p className="text-gray-500 mt-1">
                Monitorizează performanța proiectelor și veniturile
              </p>
            </div>
            <DateRangePicker 
              value={dateRange} 
              onChange={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
              className="mt-4 md:mt-0"
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Se încarcă datele...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-md border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-3 rounded-lg text-white">
                          <LayoutDashboard className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-700">Total Proiecte</p>
                          <h3 className="text-3xl font-bold text-indigo-900">{projects.length}</h3>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-indigo-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-3 rounded-lg text-white">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700">Venit Total</p>
                          <h3 className="text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</h3>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-600 p-3 rounded-lg text-white">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700">Venit Mediu / Proiect</p>
                          <h3 className="text-3xl font-bold text-purple-900">${avgRevenuePerProject.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</h3>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-600 p-3 rounded-lg text-white">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-700">Proiecte Finalizate</p>
                          <h3 className="text-3xl font-bold text-amber-900">
                            {statusData.find(item => item.name === 'completed')?.value || 0}
                          </h3>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card className="shadow-md border-0 col-span-1">
                  <CardHeader className="bg-indigo-50 border-b">
                    <CardTitle>Distribuție Statusuri Proiecte</CardTitle>
                    <CardDescription>Distribuția proiectelor după status curent</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend layout="vertical" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 col-span-1">
                  <CardHeader className="bg-green-50 border-b">
                    <CardTitle>Distribuție Status Plăți</CardTitle>
                    <CardDescription>Distribuția proiectelor după statusul plății</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend layout="vertical" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 col-span-1">
                  <CardHeader className="bg-amber-50 border-b">
                    <CardTitle>Funcționalități Populare</CardTitle>
                    <CardDescription>Cele mai solicitate funcționalități în proiecte</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featuresData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {featuresData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="shadow-md border-0 mb-6">
                <CardHeader className="bg-purple-50 border-b">
                  <CardTitle>Venituri în Timp</CardTitle>
                  <CardDescription>Tendințe lunare ale veniturilor</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Venit']}
                          content={<CustomTooltip />}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          activeDot={{ r: 8 }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default Reports;
