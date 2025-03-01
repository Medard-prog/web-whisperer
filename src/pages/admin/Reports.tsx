
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminReports = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Rapoarte</h1>
              <p className="text-gray-600">
                Analizează statistici și generează rapoarte despre activitate
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => toast.info("Funcționalitate în dezvoltare")}
            >
              <Download className="h-4 w-4" />
              Exportă raport
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Proiecte Active</p>
                    <h3 className="text-2xl font-bold mt-1">24</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 flex items-center justify-center rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>24% creștere față de luna trecută</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Venituri (Luna)</p>
                    <h3 className="text-2xl font-bold mt-1">€12,580</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 flex items-center justify-center rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>18% creștere față de luna trecută</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clienți Noi</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 flex items-center justify-center rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>9% creștere față de luna trecută</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Proiecte Finalizate</p>
                    <h3 className="text-2xl font-bold mt-1">8</h3>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 flex items-center justify-center rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>33% creștere față de luna trecută</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Privire generală</TabsTrigger>
              <TabsTrigger value="projects">Proiecte</TabsTrigger>
              <TabsTrigger value="clients">Clienți</TabsTrigger>
              <TabsTrigger value="finances">Finanțe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Proiecte după Stare</CardTitle>
                    <CardDescription>Distribuția proiectelor după stare</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="text-center py-12">
                      <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Venituri Lunare</CardTitle>
                    <CardDescription>Veniturile obținute în ultimele 6 luni</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="text-center py-12">
                      <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Statistici Proiecte</CardTitle>
                  <CardDescription>Detalii despre toate proiectele</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Statistici Clienți</CardTitle>
                  <CardDescription>Detalii despre clienți și interacțiuni</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="finances">
              <Card>
                <CardHeader>
                  <CardTitle>Raport Financiar</CardTitle>
                  <CardDescription>Statistici despre venituri și cheltuieli</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminReports;
