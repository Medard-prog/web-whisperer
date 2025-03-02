
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Lock, 
  BellRing, 
  Globe,
  CreditCard,
  KeyRound
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const ProfileSection = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        company: formData.company
      });
      
      toast.success("Profil actualizat cu succes");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Eroare la actualizarea profilului");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nume complet
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <User className="h-4 w-4" />
            </span>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              id="email"
              type="email"
              value={formData.email}
              className="pl-10"
              disabled
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Telefon
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Phone className="h-4 w-4" />
            </span>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Companie
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Building2 className="h-4 w-4" />
            </span>
            <Input
              id="company"
              value={formData.company}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {loading ? "Se salvează..." : "Salvează modificările"}
        </Button>
      </div>
    </form>
  );
};

const SecuritySection = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Schimbă parola</h3>
        <p className="text-sm text-gray-500">
          Actualizează parola contului tău pentru securitate sporită
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
            Parola curentă
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Lock className="h-4 w-4" />
            </span>
            <Input
              id="current-password"
              type="password"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
            Parola nouă
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <KeyRound className="h-4 w-4" />
            </span>
            <Input
              id="new-password"
              type="password"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
            Confirmă parola nouă
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <KeyRound className="h-4 w-4" />
            </span>
            <Input
              id="confirm-password"
              type="password"
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => toast.info("Funcționalitate în dezvoltare")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Actualizează parola
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Sesiunile active</h3>
        <p className="text-sm text-gray-500">
          Gestionează dispozitivele conectate la contul tău
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Acest dispozitiv</p>
            <p className="text-sm text-gray-500">Chrome pe Windows • Acum</p>
          </div>
          <Button variant="outline" size="sm">Deconectează</Button>
        </div>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Setări administrator</h1>
            <p className="text-gray-600">
              Gestionează setările contului și preferințele pentru platformă
            </p>
          </div>
          
          <div className="max-w-4xl">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-8 border-b w-full rounded-none bg-transparent p-0 justify-start space-x-8">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 bg-transparent rounded-none pb-3 pt-1 px-1"
                >
                  Profil administrator
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 bg-transparent rounded-none pb-3 pt-1 px-1"
                >
                  Securitate
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 bg-transparent rounded-none pb-3 pt-1 px-1"
                >
                  Facturare
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 bg-transparent rounded-none pb-3 pt-1 px-1"
                >
                  Notificări
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil administrator</CardTitle>
                    <CardDescription>
                      Actualizează informațiile profilului tău de administrator
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileSection />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Securitate</CardTitle>
                    <CardDescription>
                      Gestionează setările de securitate ale contului
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SecuritySection />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Facturare</CardTitle>
                    <CardDescription>
                      Gestionează metodele de plată și istoricul facturărilor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-8 text-center">
                      <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Setări facturare în dezvoltare</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Funcționalitatea de facturare este în curs de dezvoltare și va fi disponibilă în curând.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => toast.info("Funcționalitate în dezvoltare")}
                      >
                        Contactează suportul
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificări</CardTitle>
                    <CardDescription>
                      Configurează preferințele pentru notificări
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-8 text-center">
                      <BellRing className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Setări notificări în dezvoltare</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Funcționalitatea de configurare a notificărilor este în curs de dezvoltare și va fi disponibilă în curând.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => toast.info("Funcționalitate în dezvoltare")}
                      >
                        Activează notificările implicite
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default AdminSettings;
