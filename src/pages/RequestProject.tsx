
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import WavyBackground from '@/components/WavyBackground';
import { ArrowLeft, Phone, Mail, Building, Globe, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Titlul trebuie să conțină cel puțin 3 caractere' }),
  description: z.string().min(10, { message: 'Descrierea trebuie să conțină cel puțin 10 caractere' }),
  name: z.string().min(3, { message: 'Numele trebuie să conțină cel puțin 3 caractere' }),
  email: z.string().email({ message: 'Adresa de email nu este validă' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  website_type: z.string().min(1, { message: 'Selectează tipul de website' }),
  page_count: z.number().min(1, { message: 'Numărul de pagini trebuie să fie cel puțin 1' }),
  design_complexity: z.string().min(1, { message: 'Selectează complexitatea design-ului' }),
  has_cms: z.boolean().default(false),
  has_ecommerce: z.boolean().default(false),
  has_seo: z.boolean().default(false),
  has_maintenance: z.boolean().default(false),
  example_urls: z.string().optional(),
  additional_info: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const websiteTypes = [
  { value: 'business', label: 'Website de afaceri' },
  { value: 'ecommerce', label: 'Magazin online' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portofoliu' },
  { value: 'landing', label: 'Pagină de aterizare' },
  { value: 'app', label: 'Aplicație web' },
  { value: 'other', label: 'Altele' },
];

const RequestProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parse URL parameters
  const initialValues = {
    page_count: parseInt(searchParams.get('pageCount') || '5'),
    design_complexity: searchParams.get('designComplexity') || 'standard',
    has_cms: searchParams.get('hasCms') === 'true',
    has_ecommerce: searchParams.get('hasEcommerce') === 'true',
    has_seo: searchParams.get('hasSeo') === 'true',
    has_maintenance: searchParams.get('hasMaintenance') === 'true',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      website_type: '',
      page_count: initialValues.page_count,
      design_complexity: initialValues.design_complexity,
      has_cms: initialValues.has_cms,
      has_ecommerce: initialValues.has_ecommerce,
      has_seo: initialValues.has_seo,
      has_maintenance: initialValues.has_maintenance,
      example_urls: '',
      additional_info: '',
    },
  });
  
  // Update form when user data becomes available
  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.phone || '');
      form.setValue('company', user.company || '');
    }
  }, [user, form]);
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Process example_urls to convert to array
      const exampleUrls = values.example_urls
        ? values.example_urls.split('\n').filter(url => url.trim().length > 0)
        : [];
      
      // Submit project request to Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: values.title,
          description: values.description,
          user_id: user?.id, // Will be null for non-authenticated users
          website_type: values.website_type,
          page_count: values.page_count,
          design_complexity: values.design_complexity,
          has_cms: values.has_cms,
          has_ecommerce: values.has_ecommerce,
          has_seo: values.has_seo,
          has_maintenance: values.has_maintenance,
          example_urls: exampleUrls,
          additional_info: values.additional_info,
          // Store contact info in project if user is not logged in
          contact_name: !user ? values.name : undefined,
          contact_email: !user ? values.email : undefined,
          contact_phone: !user ? values.phone : undefined,
          contact_company: !user ? values.company : undefined,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast.success("Solicitare trimisă", {
        description: "Cererea ta a fost trimisă cu succes. Te vom contacta în curând."
      });
      
      // Redirect to thank you page or dashboard
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/thank-you');
      }
    } catch (error: any) {
      console.error('Error submitting project request:', error);
      setError(error.message || 'A apărut o eroare la trimiterea cererii');
      
      toast.error("Eroare", {
        description: "Nu am putut trimite cererea. Te rugăm să încerci din nou."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <WavyBackground className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-indigo-500/20" />
      </WavyBackground>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Button
            variant="ghost"
            className="mb-4 p-0"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la pagina principală
          </Button>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Solicită un proiect
              </CardTitle>
              <CardDescription className="text-center">
                Completează formularul de mai jos pentru a solicita o ofertă personalizată
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue={user ? "project" : "contact"} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contact">Informații de contact</TabsTrigger>
                  <TabsTrigger value="project">Detalii proiect</TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <TabsContent value="contact" className="space-y-4 pt-2">
                      {!user && (
                        <div className="rounded-md bg-blue-50 p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">Ai deja un cont?</h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  <Link to="/auth?redirect=/request" className="font-medium underline">
                                    Autentifică-te
                                  </Link>{' '}
                                  pentru a completa automat datele de contact și a urmări proiectul tău.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nume complet</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Numele tău" {...field} className="pl-10" />
                                </FormControl>
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <User size={16} />
                                </div>
                              </div>
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
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Email" {...field} className="pl-10" />
                                </FormControl>
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <Mail size={16} />
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon (opțional)</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Număr de telefon" {...field} className="pl-10" />
                                </FormControl>
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <Phone size={16} />
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Companie (opțional)</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Numele companiei" {...field} className="pl-10" />
                                </FormControl>
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <Building size={16} />
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button
                          type="button"
                          onClick={() => {
                            const tab = document.querySelector('[data-value="project"]');
                            if (tab instanceof HTMLElement) {
                              tab.click();
                            }
                          }}
                        >
                          Următorul pas
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="project" className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titlul proiectului</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Website pentru afacerea mea" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descriere</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descrie pe scurt ce fel de website îți dorești"
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="website_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipul de website</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {websiteTypes.map((type) => (
                                <Button
                                  key={type.value}
                                  type="button"
                                  variant={field.value === type.value ? "default" : "outline"}
                                  onClick={() => form.setValue("website_type", type.value)}
                                  className="text-sm"
                                >
                                  {type.label}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-6 pt-4">
                        <Separator />
                        
                        <FormField
                          control={form.control}
                          name="page_count"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between">
                                <FormLabel>Număr de pagini: {field.value}</FormLabel>
                              </div>
                              <FormControl>
                                <Slider
                                  min={1}
                                  max={20}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => form.setValue("page_count", value[0])}
                                  className="cursor-pointer"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="design_complexity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complexitate design</FormLabel>
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  type="button"
                                  variant={field.value === 'standard' ? 'default' : 'outline'} 
                                  onClick={() => form.setValue("design_complexity", 'standard')}
                                  className="text-sm"
                                >
                                  Standard
                                </Button>
                                <Button
                                  type="button"
                                  variant={field.value === 'premium' ? 'default' : 'outline'}
                                  onClick={() => form.setValue("design_complexity", 'premium')}
                                  className="text-sm"
                                >
                                  Premium
                                </Button>
                                <Button
                                  type="button"
                                  variant={field.value === 'custom' ? 'default' : 'outline'}
                                  onClick={() => form.setValue("design_complexity", 'custom')}
                                  className="text-sm"
                                >
                                  Custom
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-4">
                          <FormLabel>Funcționalități adiționale</FormLabel>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="has_cms"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center p-3 border rounded-md">
                                  <div>
                                    <FormLabel className="text-base">Sistem de administrare (CMS)</FormLabel>
                                    <FormDescription>Gestionează conținutul site-ului</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="has_ecommerce"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center p-3 border rounded-md">
                                  <div>
                                    <FormLabel className="text-base">Funcționalități E-commerce</FormLabel>
                                    <FormDescription>Vinzi produse online</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="has_seo"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center p-3 border rounded-md">
                                  <div>
                                    <FormLabel className="text-base">Optimizare SEO</FormLabel>
                                    <FormDescription>Apari mai sus în rezultatele Google</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="has_maintenance"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center p-3 border rounded-md">
                                  <div>
                                    <FormLabel className="text-base">Mentenanță</FormLabel>
                                    <FormDescription>Suport tehnic și actualizări</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <FormField
                          control={form.control}
                          name="example_urls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site-uri de referință (opțional)</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Textarea
                                    placeholder="Introdu adresele site-urilor care îți plac sau care te inspiră (un URL pe linie)"
                                    className="min-h-24 pl-10"
                                    {...field}
                                  />
                                </FormControl>
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <Globe size={16} />
                                </div>
                              </div>
                              <FormDescription>
                                Aceste exemple ne vor ajuta să înțelegem mai bine preferințele tale de design
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional_info"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Informații suplimentare (opțional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Orice alte informații relevante pentru proiect"
                                  className="min-h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const tab = document.querySelector('[data-value="contact"]');
                            if (tab instanceof HTMLElement) {
                              tab.click();
                            }
                          }}
                        >
                          Înapoi
                        </Button>
                        
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RequestProject;
