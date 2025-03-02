
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardSidebar from '@/components/DashboardSidebar';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Building, Shield, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Numele trebuie să conțină cel puțin 3 caractere' }),
  email: z.string().email({ message: 'Adresa de email nu este validă' }),
  phone: z.string().optional(),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Settings = () => {
  const { user, updateProfile, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });
  
  // Update form when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user, form]);
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await updateProfile(values);
      toast.success('Profil actualizat', {
        description: 'Datele tale au fost actualizate cu succes.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Eroare', {
        description: 'Nu am putut actualiza profilul. Încearcă din nou.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Deconectare reușită');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Eroare la deconectare');
    }
  };
  
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p>Se încarcă informațiile profilului...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <PageTransition>
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Setări cont</h1>
              <p className="text-gray-500">Gestionează detaliile contului tău</p>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="security">Securitate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Profilul tău</CardTitle>
                    <CardDescription>
                      Vizualizează și actualizează informațiile tale personale
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20 border-2 border-purple-100">
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xl">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-medium">{user?.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          {user?.email}
                        </p>
                        {user?.isAdmin && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                            <Shield className="h-3 w-3 mr-1" />
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nume complet</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Numele tău" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Email" className="pl-10" {...field} disabled />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Adresa de email nu poate fi modificată
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Număr de telefon" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Companie</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Numele companiei" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Se actualizează...' : 'Salvează modificările'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <KeyRound className="h-5 w-5 mr-2 text-purple-600" />
                        Securitate
                      </CardTitle>
                      <CardDescription>
                        Gestionează opțiunile de securitate pentru contul tău
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Schimbă parola</Label>
                        <p className="text-sm text-gray-500">
                          Poți solicita resetarea parolei prin email
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = '/auth?type=reset-password'}
                      >
                        Resetează parola
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-red-600" />
                        Zonă periculoasă
                      </CardTitle>
                      <CardDescription>
                        Acțiuni ireversibile legate de contul tău
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Deconectare</Label>
                        <p className="text-sm text-gray-500">
                          Deconectează-te de pe acest dispozitiv
                        </p>
                      </div>
                      
                      <Button
                        variant="destructive"
                        onClick={handleSignOut}
                      >
                        Deconectare
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Settings;
