
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  ChevronsUpDown,
  GanttChartSquare,
  LayoutDashboard,
  Lightbulb,
  Mail,
  Phone,
  User,
  FileText,
  ShoppingCart,
  Search,
  Settings,
  Loader2
} from "lucide-react";

const formSteps = [
  {
    id: "step-1",
    name: "Informații de bază",
    fields: ["title", "description"],
    icon: LayoutDashboard,
  },
  {
    id: "step-2",
    name: "Detalii proiect",
    fields: ["websiteType", "designComplexity", "pageCount"],
    icon: Lightbulb,
  },
  {
    id: "step-3",
    name: "Funcționalități",
    fields: ["hasCMS", "hasEcommerce", "hasSEO", "hasMaintenance"],
    icon: GanttChartSquare,
  },
  {
    id: "step-4",
    name: "Informații de contact",
    fields: ["contactName", "contactEmail", "contactPhone", "companyName"],
    icon: User,
  },
];

const formSchema = z.object({
  title: z.string().min(3, "Titlul trebuie să conțină minim 3 caractere"),
  description: z.string().min(10, "Descrierea trebuie să conțină minim 10 caractere"),
  websiteType: z.string().min(1, "Selectați tipul de website"),
  designComplexity: z.string().min(1, "Selectați complexitatea design-ului"),
  pageCount: z.number().min(1),
  hasCMS: z.boolean().default(false),
  hasEcommerce: z.boolean().default(false),
  hasSEO: z.boolean().default(false),
  hasMaintenance: z.boolean().default(false),
  contactName: z.string().min(3, "Numele trebuie să conțină minim 3 caractere"),
  contactEmail: z.string().email("Adresa de email este invalidă"),
  contactPhone: z.string().optional(),
  companyName: z.string().optional(),
  referenceUrls: z.string().optional(),
  budget: z.number().optional(),
  timeline: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RequestProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load calculator state if available
  const calculatorState = sessionStorage.getItem("calculatorState");
  const initialData = calculatorState ? JSON.parse(calculatorState) : {};

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      websiteType: "",
      designComplexity: initialData.designComplexity || "standard",
      pageCount: initialData.pageCount || 5,
      hasCMS: initialData.hasCMS || false,
      hasEcommerce: initialData.hasEcommerce || false,
      hasSEO: initialData.hasSEO || false,
      hasMaintenance: initialData.maintenance || false,
      contactName: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: user?.phone || "",
      companyName: user?.company || "",
      referenceUrls: "",
      budget: initialData.totalPrice || 0,
      timeline: "",
    },
  });

  const nextStep = async () => {
    const formStep = formSteps[currentStep];
    
    const stepValid = await form.trigger(formStep.fields as any);
    
    if (stepValid) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await onSubmit(form.getValues());
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Trebuie să fii autentificat",
        description: "Pentru a solicita un proiect, trebuie să fii autentificat.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("project_requests")
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          website_type: data.websiteType,
          design_complexity: data.designComplexity,
          page_count: data.pageCount,
          has_cms: data.hasCMS,
          has_ecommerce: data.hasEcommerce,
          has_seo: data.hasSEO,
          has_maintenance: data.hasMaintenance,
          contact_name: data.contactName,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone,
          company_name: data.companyName,
          reference_urls: data.referenceUrls ? [data.referenceUrls] : [],
          budget: data.budget,
          timeline: data.timeline,
        });

      if (error) throw error;

      toast({
        title: "Cerere trimisă cu succes!",
        description: "Vom reveni cu o ofertă personalizată în cel mai scurt timp.",
      });

      // Clear calculator state from session storage
      sessionStorage.removeItem("calculatorState");
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "A apărut o eroare. Încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageTransition>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Solicită o ofertă personalizată</h1>
              <p className="text-gray-600 md:text-lg">
                Completează formularul de mai jos și vom reveni cu o ofertă adaptată nevoilor tale.
              </p>
            </div>
            
            <Card className="border-2 border-brand-100 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {formSteps[currentStep].name}
                    </CardTitle>
                    <CardDescription>
                      Pasul {currentStep + 1} din {formSteps.length}
                    </CardDescription>
                  </div>
                  <div className="hidden md:block">
                    {React.createElement(formSteps[currentStep].icon, { className: "h-8 w-8 text-brand-500" })}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    {formSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center"
                      >
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-medium
                            ${index < currentStep
                              ? "bg-brand-600 text-white"
                              : index === currentStep
                              ? "bg-brand-100 text-brand-600 border-2 border-brand-500"
                              : "bg-gray-100 text-gray-500 border border-gray-300"}
                          `}
                        >
                          {index < currentStep ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < formSteps.length - 1 && (
                          <div
                            className={`
                              hidden md:block h-1 w-12 mx-2
                              ${index < currentStep ? "bg-brand-600" : "bg-gray-200"}
                            `}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...form}>
                  <form className="space-y-6">
                    {currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Titlul proiectului</FormLabel>
                              <FormControl>
                                <Input placeholder="ex: Site web pentru compania mea" {...field} />
                              </FormControl>
                              <FormDescription>
                                Oferă un titlu scurt și descriptiv pentru proiectul tău.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrierea proiectului</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descrie pe scurt proiectul tău și ce obiective urmărești să atingi."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Detaliază nevoile și așteptările tale legate de acest proiect.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="websiteType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipul website-ului</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selectează tipul website-ului" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="presentation">Website de prezentare</SelectItem>
                                  <SelectItem value="ecommerce">Magazin online</SelectItem>
                                  <SelectItem value="blog">Blog</SelectItem>
                                  <SelectItem value="portfolio">Portofoliu</SelectItem>
                                  <SelectItem value="custom">Website personalizat</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Alege tipul de website care se potrivește cel mai bine nevoilor tale.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="designComplexity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Complexitate design</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="simple" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Simplu - Design basic, funcțional
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="standard" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Standard - Design modern, cu elemente interactive
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="premium" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Premium - Design complex, personalizat, cu animații
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pageCount"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Număr de pagini (aproximativ)</FormLabel>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 text-sm">Pagini: {value}</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[value]}
                                    onValueChange={(vals) => onChange(vals[0])}
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormDescription>
                                Estimează numărul de pagini diferite pentru website-ul tău.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="hasCMS"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-brand-500" />
                                  <FormLabel className="text-base">Sistem de administrare conținut (CMS)</FormLabel>
                                </div>
                                <FormDescription>
                                  Administrează conținutul site-ului (text, imagini) fără cunoștințe tehnice.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hasEcommerce"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center">
                                  <ShoppingCart className="h-5 w-5 mr-2 text-brand-500" />
                                  <FormLabel className="text-base">Magazin online (eCommerce)</FormLabel>
                                </div>
                                <FormDescription>
                                  Vinde produse online, gestionează stocuri, primește comenzi și plăți.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hasSEO"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center">
                                  <Search className="h-5 w-5 mr-2 text-brand-500" />
                                  <FormLabel className="text-base">Optimizare SEO</FormLabel>
                                </div>
                                <FormDescription>
                                  Optimizare pentru motoarele de căutare și strategie de cuvinte cheie.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hasMaintenance"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center">
                                  <Settings className="h-5 w-5 mr-2 text-brand-500" />
                                  <FormLabel className="text-base">Mentenanță lunară</FormLabel>
                                </div>
                                <FormDescription>
                                  Actualizări, backup-uri și suport tehnic lunar.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nume complet</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10" placeholder="Nume complet" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10" placeholder="email@exemplu.com" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon (opțional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10" placeholder="+40 712 345 678" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Companie (opțional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10" placeholder="Numele companiei" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-full md:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Înapoi
                </Button>
                
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se procesează...
                    </>
                  ) : currentStep === formSteps.length - 1 ? (
                    <>
                      Trimite cererea
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Continuă
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default RequestProject;
