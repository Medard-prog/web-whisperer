
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import DashboardSidebar from "@/components/DashboardSidebar";
import AdminRecentActivity from "@/components/AdminRecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  getProjectStatusChartData, 
  getProjectsByPaymentStatus, 
  getPopularFeaturesData 
} from "@/integrations/supabase/services/analyticsService";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  ListFilter, 
  LayoutDashboard, 
  PlusCircle,
  FileStack,
  CreditCard,
  Construction,
  Activity,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const { data: projectStatusCounts, isLoading: loadingStatusCounts } = useQuery({
    queryKey: ['projectStatusCounts'],
    queryFn: getProjectStatusChartData
  });
  
  const { data: paymentStatusCounts, isLoading: loadingPaymentCounts } = useQuery({
    queryKey: ['paymentStatusCounts'],
    queryFn: getProjectsByPaymentStatus
  });
  
  const { data: featuresData, isLoading: loadingFeaturesData } = useQuery({
    queryKey: ['featuresData'],
    queryFn: getPopularFeaturesData
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Noi',
      pending: 'În așteptare',
      in_progress: 'În progres',
      completed: 'Finalizate',
      cancelled: 'Anulate',
      paid: 'Plătite',
      partial: 'Plătite parțial',
      overdue: 'Întârziate'
    };
    
    return labels[status] || status;
  };
  
  const getFeatureLabel = (featureName: string) => {
    const labels: Record<string, string> = {
      'E-commerce': 'E-commerce',
      'CMS': 'CMS',
      'SEO': 'SEO',
      'Mentenanță': 'Mentenanță'
    };
    
    return labels[featureName] || featureName;
  };
  
  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'CMS': return <FileStack className="h-4 w-4" />;
      case 'E-commerce': return <CreditCard className="h-4 w-4" />;
      case 'SEO': return <BarChart3 className="h-4 w-4" />;
      case 'Mentenanță': return <Construction className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button 
              onClick={() => navigate('/admin/projects/new')}
              className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Proiect Nou
            </Button>
          </div>
          
          {/* Stats cards in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Project Status */}
            <Card className="shadow-md border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between bg-indigo-50">
                <CardTitle className="text-sm font-medium flex items-center text-indigo-700">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Statistici Proiecte
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/admin/reports')}>
                  <BarChart3 className="h-4 w-4" />
                  <span className="sr-only">Vezi rapoarte</span>
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {loadingStatusCounts ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    Array.isArray(projectStatusCounts) && projectStatusCounts.map((item: {name: string, value: number}) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className={getStatusColor(item.name)}>
                            {item.name === 'new' && <PlusCircle className="mr-1 h-3 w-3" />}
                            {item.name === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                            {item.name === 'in_progress' && <Activity className="mr-1 h-3 w-3" />}
                            {item.name === 'completed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {item.name === 'cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                            {getStatusLabel(item.name)}
                          </Badge>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Status */}
            <Card className="shadow-md border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between bg-green-50">
                <CardTitle className="text-sm font-medium flex items-center text-green-700">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Statistici Plăți
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {loadingPaymentCounts ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    Array.isArray(paymentStatusCounts) && paymentStatusCounts.map((item: {name: string, value: number}) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className={getPaymentStatusColor(item.name)}>
                            {item.name === 'paid' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {item.name === 'partial' && <Activity className="mr-1 h-3 w-3" />}
                            {item.name === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                            {item.name === 'overdue' && <Activity className="mr-1 h-3 w-3" />}
                            {getStatusLabel(item.name)}
                          </Badge>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Website Types */}
            <Card className="shadow-md border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between bg-blue-50">
                <CardTitle className="text-sm font-medium flex items-center text-blue-700">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Tipuri de Website
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {loadingFeaturesData ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    Array.isArray(featuresData) && featuresData.map((item: {name: string, value: number}) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {getFeatureIcon(item.name)}
                            <span className="ml-1">{getFeatureLabel(item.name)}</span>
                          </Badge>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity below stats */}
          <AdminRecentActivity />
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminDashboard;
