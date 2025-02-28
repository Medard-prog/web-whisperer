
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import WavyBackground from "@/components/WavyBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Upload, X, Check, FileText, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const projectTypeSchema = z.object({
  projectType: z.enum(["website", "ecommerce", "web-app", "graphic", "seo", "marketing", "other"]),
  specificType: z.string().optional(),
});

const budgetSchema = z.object({
  budget: z.enum(["under-500", "500-1000", "1000-2500", "2500-5000", "5000-plus"]),
  customBudget: z.string().optional(),
});

const timelineSchema = z.object({
  timeline: z.enum(["urgent", "1-month", "3-months", "6-months", "flexible"]),
  customTimeline: z.string().optional(),
});

const detailsSchema = z.object({
  projectName: z.string().min(3, "Numele proiectului trebuie să aibă cel puțin 3 caractere"),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
  businessGoal: z.string().optional(),
  targetAudience: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(3, "Numele trebuie să aibă cel puțin 3 caractere"),
  email: z.string().email("Adresa de email trebuie să fie validă"),
  phone: z.string().optional(),
  company: z.string().optional(),
  communication: z.enum(["email", "phone", "whatsapp", "telegram", "other"]).default("email"),
  customCommunication: z.string().optional(),
});

const filesSchema = z.object({
  hasFiles: z.boolean().default(false),
  fileDescription: z.string().optional(),
});

// Modified schema to fix the type error: use boolean() instead of literal(true)
const termsSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Trebuie să accepți termenii și condițiile pentru a continua",
  }),
  newsletter: z.boolean().default(false),
});

const formSchema = z.object({
  ...projectTypeSchema.shape,
  ...budgetSchema.shape,
  ...timelineSchema.shape,
  ...detailsSchema.shape,
  ...contactSchema.shape,
  ...filesSchema.shape,
  ...termsSchema.shape,
});

type FormValues = z.infer<typeof formSchema>;

const RequestProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: shadowToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("project-type");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "website",
      budget: "500-1000",
      timeline: "1-month",
      projectName: "",
      description: "",
      businessGoal: "",
      targetAudience: "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
      communication: "email",
      hasFiles: false,
      fileDescription: "",
      acceptTerms: false,
      newsletter: false,
    },
  });

  const projectType = form.watch("projectType");
  const budget = form.watch("budget");
  const timeline = form.watch("timeline");
  const hasFiles = form.watch("hasFiles");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const onSubmitStep = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const fileList = e.dataTransfer.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getBudgetLabel = (value: string) => {
    switch (value) {
      case "under-500":
        return "Sub 500 EUR";
      case "500-1000":
        return "500 - 1000 EUR";
      case "1000-2500":
        return "1000 - 2500 EUR";
      case "2500-5000":
        return "2500 - 5000 EUR";
      case "5000-plus":
        return "Peste 5000 EUR";
      default:
        return value;
    }
  };

  const getTimelineLabel = (value: string) => {
    switch (value) {
      case "urgent":
        return "Urgent (sub 2 săptămâni)";
      case "1-month":
        return "În maxim o lună";
      case "3-months":
        return "În maxim 3 luni";
      case "6-months":
        return "În maxim 6 luni";
      case "flexible":
        return "Flexibil / Nu sunt grăbit";
      default:
        return value;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log("Form data:", data);

      // Upload files if any
      const fileUrls: string[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `project-files/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('project-requests')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw new Error(`Eroare la încărcarea fișierului: ${uploadError.message}`);
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('project-requests')
            .getPublicUrl(filePath);
            
          fileUrls.push(publicUrlData.publicUrl);
        }
      }

      // Save project request to the database
      const requestData = {
        user_id: user?.id || null, // null if not logged in
        project_type: data.projectType,
        specific_type: data.specificType,
        budget: data.budget,
        custom_budget: data.customBudget,
        timeline: data.timeline,
        custom_timeline: data.customTimeline,
        project_name: data.projectName,
        description: data.description,
        business_goal: data.businessGoal,
        target_audience: data.targetAudience,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        communication_preference: data.communication,
        custom_communication: data.customCommunication,
        has_files: data.hasFiles && files.length > 0,
        file_description: data.fileDescription,
        file_urls: fileUrls.length > 0 ? fileUrls : null,
        newsletter_consent: data.newsletter
      };

      const { error } = await supabase
        .from('project_requests')
        .insert(requestData);

      if (error) {
        console.error('Error saving project request:', error);
        throw new Error(`Eroare la salvarea cererii: ${error.message}`);
      }

      // Show success message
      toast.success("Cerere trimisă cu succes!", {
        description: "Te vom contacta în cel mai scurt timp pentru a discuta despre proiectul tău.",
      });

      // Navigate to confirmation page or dashboard
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/request-confirmation');
      }

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'A apărut o eroare la trimiterea formularului. Încearcă din nou.');
      
      toast.error("Eroare", {
        description: error.message || "A apărut o eroare la trimiterea formularului. Încearcă din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <WavyBackground className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-indigo-500/10" />
      </WavyBackground>
      
      <div className="flex-1 flex justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </Button>
          
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl font-bold">Solicită o ofertă pentru proiectul tău</CardTitle>
              <CardDescription className="text-gray-100">
                Completează formularul de mai jos și te vom contacta în cel mai scurt timp
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {!user && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Ai deja un cont?</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        <Link to="/auth?redirect=/request" className="font-medium underline hover:text-blue-600">
                          Autentifică-te
                        </Link>{" "}
                        pentru a completa automat datele de contact și a urmări proiectul tău.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={activeTab} className="w-full">
                    <div className="flex items-center justify-between mb-8">
                      <TabsList className="grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-0">
                        <TabsTrigger
                          value="project-type"
                          onClick={() => handleTabClick("project-type")}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          1. Tip Proiect
                        </TabsTrigger>
                        <TabsTrigger
                          value="budget-timeline"
                          onClick={() => handleTabClick("budget-timeline")}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          2. Buget
                        </TabsTrigger>
                        <TabsTrigger
                          value="details"
                          onClick={() => handleTabClick("details")}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          3. Detalii
                        </TabsTrigger>
                        <TabsTrigger
                          value="contact"
                          onClick={() => handleTabClick("contact")}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          4. Contact
                        </TabsTrigger>
                        <TabsTrigger
                          value="files"
                          onClick={() => handleTabClick("files")}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          5. Finalizare
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Project Type Tab */}
                    <TabsContent value="project-type" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg font-medium">Ce tip de proiect dorești să realizezi?</FormLabel>
                              <FormDescription>
                                Selectează tipul de proiect pe care dorești să-l dezvolți
                              </FormDescription>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <Label
                                    htmlFor="website"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "website" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="website" id="website" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Website de prezentare</span>
                                      <span className="text-sm text-muted-foreground">
                                        Site pentru a prezenta afacerea, serviciile sau portofoliul tău
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="ecommerce"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "ecommerce" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="ecommerce" id="ecommerce" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Magazin online</span>
                                      <span className="text-sm text-muted-foreground">
                                        Platformă pentru vânzarea produselor sau serviciilor tale online
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="web-app"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "web-app" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="web-app" id="web-app" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Aplicație web</span>
                                      <span className="text-sm text-muted-foreground">
                                        Aplicație personalizată pentru nevoile specifice ale afacerii tale
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="graphic"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "graphic" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="graphic" id="graphic" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Design grafic</span>
                                      <span className="text-sm text-muted-foreground">
                                        Logo, branding, materiale de marketing sau alte elemente vizuale
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="seo"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "seo" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="seo" id="seo" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Optimizare SEO</span>
                                      <span className="text-sm text-muted-foreground">
                                        Îmbunătățirea vizibilității site-ului tău în motoarele de căutare
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="marketing"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "marketing" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="marketing" id="marketing" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Marketing digital</span>
                                      <span className="text-sm text-muted-foreground">
                                        Campanii de marketing, social media, email marketing etc.
                                      </span>
                                    </div>
                                  </Label>
                                  <Label
                                    htmlFor="other"
                                    className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                      field.value === "other" ? "border-primary bg-primary/5" : "border-input"
                                    }`}
                                  >
                                    <RadioGroupItem value="other" id="other" className="mt-1" />
                                    <div className="space-y-1.5">
                                      <span className="font-medium block">Alt tip de proiect</span>
                                      <span className="text-sm text-muted-foreground">
                                        Specificați mai jos despre ce tip de proiect este vorba
                                      </span>
                                    </div>
                                  </Label>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {projectType === "other" && (
                          <FormField
                            control={form.control}
                            name="specificType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specificați tipul de proiect</FormLabel>
                                <FormControl>
                                  <Input placeholder="Descrieți tipul de proiect" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button 
                          type="button" 
                          onClick={() => onSubmitStep("budget-timeline")} 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          Pasul următor <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Budget and Timeline Tab */}
                    <TabsContent value="budget-timeline" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-lg font-medium">Care este bugetul estimat pentru proiect?</FormLabel>
                            <FormDescription>
                              Selectează intervalul bugetar în care se încadrează proiectul tău
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                <Label
                                  htmlFor="under-500"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "under-500" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="under-500" id="under-500" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">Sub 500 EUR</span>
                                    <span className="text-sm text-muted-foreground">
                                      Buget limitat, potrivit pentru proiecte mici
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="500-1000"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "500-1000" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="500-1000" id="500-1000" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">500 - 1000 EUR</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru site-uri simple și proiecte de bază
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="1000-2500"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "1000-2500" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="1000-2500" id="1000-2500" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">1000 - 2500 EUR</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru site-uri complexe și funcționalități personalizate
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="2500-5000"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "2500-5000" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="2500-5000" id="2500-5000" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">2500 - 5000 EUR</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru magazine online și aplicații web complexe
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="5000-plus"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "5000-plus" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="5000-plus" id="5000-plus" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">Peste 5000 EUR</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru sisteme complexe și aplicații enterprise
                                    </span>
                                  </div>
                                </Label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem className="space-y-3 mt-8">
                            <FormLabel className="text-lg font-medium">Care este perioada de timp în care ai dori să fie finalizat proiectul?</FormLabel>
                            <FormDescription>
                              Selectează intervalul de timp estimat pentru finalizarea proiectului
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                <Label
                                  htmlFor="urgent"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "urgent" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="urgent" id="urgent" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">Urgent (sub 2 săptămâni)</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru proiecte care necesită livrare rapidă
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="1-month"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "1-month" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="1-month" id="1-month" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">În maxim o lună</span>
                                    <span className="text-sm text-muted-foreground">
                                      Timp suficient pentru majoritatea proiectelor simple
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="3-months"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "3-months" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="3-months" id="3-months" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">În maxim 3 luni</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru proiecte complexe care necesită planificare
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="6-months"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "6-months" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="6-months" id="6-months" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">În maxim 6 luni</span>
                                    <span className="text-sm text-muted-foreground">
                                      Pentru proiecte de amploare cu dezvoltare extinsă
                                    </span>
                                  </div>
                                </Label>
                                <Label
                                  htmlFor="flexible"
                                  className={`flex items-start space-x-3 border p-4 rounded-md hover:border-primary cursor-pointer transition-colors ${
                                    field.value === "flexible" ? "border-primary bg-primary/5" : "border-input"
                                  }`}
                                >
                                  <RadioGroupItem value="flexible" id="flexible" className="mt-1" />
                                  <div className="space-y-1.5">
                                    <span className="font-medium block">Flexibil / Nu sunt grăbit</span>
                                    <span className="text-sm text-muted-foreground">
                                      Nu există o dată limită specifică pentru acest proiect
                                    </span>
                                  </div>
                                </Label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => onSubmitStep("project-type")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => onSubmitStep("details")} 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          Pasul următor <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Project Details Tab */}
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Numele proiectului</FormLabel>
                            <FormDescription>
                              Dă un nume proiectului tău pentru a fi mai ușor de identificat
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="ex: Site de prezentare pentru firma XYZ" {...field} />
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
                            <FormLabel className="text-lg font-medium">Descrierea proiectului</FormLabel>
                            <FormDescription>
                              Descrie pe scurt ce îți dorești să realizezi cu acest proiect
                            </FormDescription>
                            <FormControl>
                              <Textarea
                                placeholder="Detaliază aici despre ce ar trebui să conțină proiectul tău..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Obiectivul de afaceri (opțional)</FormLabel>
                            <FormDescription>
                              Care este scopul principal pentru realizarea acestui proiect?
                            </FormDescription>
                            <FormControl>
                              <Textarea
                                placeholder="ex: Creșterea vânzărilor, atragerea de noi clienți, etc."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publicul țintă (opțional)</FormLabel>
                            <FormDescription>
                              Descrie profilul clienților sau utilizatorilor pentru care este destinat proiectul
                            </FormDescription>
                            <FormControl>
                              <Textarea
                                placeholder="ex: Tineri profesioniști din mediul urban, companii mici și mijlocii, etc."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => onSubmitStep("budget-timeline")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => onSubmitStep("contact")} 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          Pasul următor <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Contact Information Tab */}
                    <TabsContent value="contact" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Numele tău</FormLabel>
                            <FormDescription>
                              Numele complet al persoanei de contact
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="ex: Ion Popescu" {...field} />
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
                            <FormLabel className="text-lg font-medium">Email</FormLabel>
                            <FormDescription>
                              Adresa de email la care te putem contacta
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="ex: nume@exemplu.com" {...field} />
                            </FormControl>
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
                            <FormDescription>
                              Numărul de telefon la care te putem contacta
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="ex: 0712 345 678" {...field} />
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
                            <FormLabel>Companie (opțional)</FormLabel>
                            <FormDescription>
                              Numele companiei sau organizației pe care o reprezinți
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="ex: Compania SRL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="communication"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metoda preferată de comunicare</FormLabel>
                            <FormDescription>
                              Cum preferi să te contactăm pentru detalii despre proiect?
                            </FormDescription>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează metoda preferată" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="phone">Telefon</SelectItem>
                                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                  <SelectItem value="telegram">Telegram</SelectItem>
                                  <SelectItem value="other">Altă metodă</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("communication") === "other" && (
                        <FormField
                          control={form.control}
                          name="customCommunication"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specificați metoda de comunicare</FormLabel>
                              <FormControl>
                                <Input placeholder="ex: Skype, Zoom, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => onSubmitStep("details")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => onSubmitStep("files")} 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          Pasul următor <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Files and Finalization Tab */}
                    <TabsContent value="files" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="hasFiles"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Doresc să atașez fișiere relevante pentru proiect
                              </FormLabel>
                              <FormDescription>
                                Poți încărca schițe, exemple, mockup-uri sau alte documente relevante
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {hasFiles && (
                        <>
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onClick={handleBrowseClick}
                          >
                            <input
                              type="file"
                              multiple
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-lg font-medium">
                              Trage și plasează fișierele aici sau <span className="text-primary">încarcă manual</span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Poți încărca până la 5 fișiere (max. 10MB fiecare)
                            </p>
                          </div>

                          {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="font-medium">Fișiere încărcate:</h4>
                              <div className="space-y-2">
                                {files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md"
                                  >
                                    <div className="flex items-center">
                                      <FileText className="h-5 w-5 text-primary mr-2" />
                                      <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                    >
                                      <X className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name="fileDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Detalii despre fișierele încărcate (opțional)</FormLabel>
                                <FormDescription>
                                  Oferă o scurtă descriere a fișierelor încărcate și relevanța lor pentru proiect
                                </FormDescription>
                                <FormControl>
                                  <Textarea
                                    placeholder="ex: Am atașat un exemplu de design care îmi place, specificațiile tehnice pentru proiect, etc."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Rezumatul cererii</h3>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Tip proiect</p>
                              <p className="font-medium">
                                {projectType === "other"
                                  ? form.watch("specificType") || "Alt tip de proiect"
                                  : projectType === "website"
                                  ? "Website de prezentare"
                                  : projectType === "ecommerce"
                                  ? "Magazin online"
                                  : projectType === "web-app"
                                  ? "Aplicație web"
                                  : projectType === "graphic"
                                  ? "Design grafic"
                                  : projectType === "seo"
                                  ? "Optimizare SEO"
                                  : projectType === "marketing"
                                  ? "Marketing digital"
                                  : projectType}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Buget estimat</p>
                              <p className="font-medium">{getBudgetLabel(budget)}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Termen finalizare</p>
                              <p className="font-medium">{getTimelineLabel(timeline)}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Fișiere atașate</p>
                              <p className="font-medium">{files.length > 0 ? `${files.length} fișiere` : "Nu"}</p>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Accept termenii și condițiile
                                </FormLabel>
                                <FormDescription>
                                  Am citit și sunt de acord cu{" "}
                                  <Link to="/terms" className="text-primary hover:underline" target="_blank">
                                    Termenii și Condițiile
                                  </Link>{" "}
                                  și{" "}
                                  <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                                    Politica de Confidențialitate
                                  </Link>
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="newsletter"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Abonează-mă la newsletter
                                </FormLabel>
                                <FormDescription>
                                  Vreau să primesc noutăți și oferte personalizate pe email
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {submitError && (
                        <Alert variant="destructive" className="mt-4">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => onSubmitStep("contact")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          disabled={isSubmitting || !form.watch("acceptTerms")}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se procesează...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" /> Trimite cererea
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RequestProject;

