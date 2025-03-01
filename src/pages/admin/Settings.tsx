
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Save, 
  Mail, 
  Settings as SettingsIcon, 
  BellRing, 
  Shield, 
  Users,
  CircleDollarSign
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const handleSaveSettings = () => {
    toast.success("Setările au fost salvate");
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Setări Admin</h1>
              <p className="text-gray-600">
                Administrează și configurează sistemul
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="mb-8">
              <TabsTrigger value="general" className="flex items-center gap-1">
                <SettingsIcon className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1">
                <BellRing className="h-4 w-4" />
                <span>Notificări</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Utilizatori</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Securitate</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-1">
                <CircleDollarSign className="h-4 w-4" />
                <span>Facturare</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Setări Generale</CardTitle>
                  <CardDescription>
                    Configurează setările generale ale platformei
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Numele Companiei</Label>
                    <Input id="company-name" defaultValue="WebCreator" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Contact</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      defaultValue="contact@webcreator.com"
                      icon={Mail} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descriere Companie</Label>
                    <Textarea 
                      id="description" 
                      rows={4}
                      defaultValue="WebCreator - Platformă de creare și gestionare a proiectelor web."
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveSettings}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvează Setările
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Setări Notificări</CardTitle>
                  <CardDescription>
                    Configurează cum și când primești notificări
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notif">Notificări Email</Label>
                      <p className="text-sm text-gray-500">
                        Primește notificări prin email pentru activități importante
                      </p>
                    </div>
                    <Switch 
                      id="email-notif" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="sms-notif">Notificări SMS</Label>
                      <p className="text-sm text-gray-500">
                        Primește notificări prin SMS pentru activități urgente
                      </p>
                    </div>
                    <Switch 
                      id="sms-notif" 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveSettings}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvează Setările
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionare Utilizatori</CardTitle>
                  <CardDescription>
                    Administrează utilizatorii și permisiunile lor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Setări de Securitate</CardTitle>
                  <CardDescription>
                    Configurează opțiunile de securitate ale platformei
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Funcționalitate în dezvoltare</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Setări de Facturare</CardTitle>
                  <CardDescription>
                    Configurează opțiunile de facturare și plăți
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CircleDollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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

export default AdminSettings;
