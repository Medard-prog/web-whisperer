
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckCircle, Laptop, PaintBucket, FileText, Building, Send, ArrowLeft, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Updated background with smoother waves
const SmoothWavyBackground = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-950", className)}>
      <svg 
        className="absolute inset-0 w-full h-full z-0 opacity-30 dark:opacity-20 text-purple-200 dark:text-purple-950"
        xmlns="http://www.w3.org/2000/svg" 
        width="100%" 
        height="100%" 
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <path 
          fill="currentColor"
          d="M 0 300 Q 200 250 400 300 Q 600 350 800 300 Q 1000 250 1200 300 L 1200 800 L 0 800 Z"
        >
          <animate 
            attributeName="d" 
            values="
              M 0 300 Q 200 250 400 300 Q 600 350 800 300 Q 1000 250 1200 300 L 1200 800 L 0 800 Z;
              M 0 300 Q 200 350 400 300 Q 600 250 800 300 Q 1000 350 1200 300 L 1200 800 L 0 800 Z;
              M 0 300 Q 200 250 400 300 Q 600 350 800 300 Q 1000 250 1200 300 L 1200 800 L 0 800 Z
            " 
            dur="20s" 
            repeatCount="indefinite"
          />
        </path>
        <path 
          fill="currentColor"
          d="M 0 400 Q 150 350 300 400 Q 450 450 600 400 Q 750 350 900 400 Q 1050 450 1200 400 L 1200 800 L 0 800 Z"
          opacity="0.7"
        >
          <animate 
            attributeName="d" 
            values="
              M 0 400 Q 150 350 300 400 Q 450 450 600 400 Q 750 350 900 400 Q 1050 450 1200 400 L 1200 800 L 0 800 Z;
              M 0 400 Q 150 450 300 400 Q 450 350 600 400 Q 750 450 900 400 Q 1050 350 1200 400 L 1200 800 L 0 800 Z;
              M 0 400 Q 150 350 300 400 Q 450 450 600 400 Q 750 350 900 400 Q 1050 450 1200 400 L 1200 800 L 0 800 Z
            "
            dur="15s"
            repeatCount="indefinite"
          />
        </path>
        <path 
          fill="currentColor"
          d="M 0 500 Q 150 450 300 500 Q 450 550 600 500 Q 750 450 900 500 Q 1050 550 1200 500 L 1200 800 L 0 800 Z"
          opacity="0.5"
        >
          <animate 
            attributeName="d" 
            values="
              M 0 500 Q 100 450 200 500 Q 300 550 400 500 Q 500 450 600 500 Q 700 550 800 500 Q 900 450 1000 500 Q 1100 550 1200 500 L 1200 800 L 0 800 Z;
              M 0 500 Q 100 550 200 500 Q 300 450 400 500 Q 500 550 600 500 Q 700 450 800 500 Q 900 550 1000 500 Q 1100 450 1200 500 L 1200 800 L 0 800 Z;
              M 0 500 Q 100 450 200 500 Q 300 550 400 500 Q 500 450 600 500 Q 700 550 800 500 Q 900 450 1000 500 Q 1100 550 1200 500 L 1200 800 L 0 800 Z
            "
            dur="25s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const formSteps = [
  {
    id: "design",
    name: "Design",
    fields: ["websiteType", "designComplexity", "pageCount"],
    icon: PaintBucket,
  },
  {
    id: "features",
    name: "Funcționalități",
    fields: ["hasCMS", "hasEcommerce", "hasSEO", "hasMaintenance"],
    icon: Laptop,
  },
  {
    id: "details",
    name: "Detalii",
    fields: ["title", "description", "exampleUrls"],
    icon: FileText,
  },
  {
    id: "contact",
    name: "Contact",
    fields: ["companyName", "contactName", "contactEmail", "contactPhone"],
    icon: Building,
  },
];

const formSchema = z.object({
  websiteType: z.string(),
  designComplexity: z.string(),
  pageCount: z.coerce.number().min(1).max(50),
  hasCMS: z.boolean().default(false),
  hasEcommerce: z.boolean().default(false),
  hasSEO: z.boolean().default(false),
  hasMaintenance: z.boolean().default(false),
  title: z.string().min(3, {
    message: "Titlul trebuie să conțină cel puțin 3 caractere",
  }),
  description: z.string().min(10, {
    message: "Descrierea trebuie să conțină cel puțin 10 caractere",
  }),
  exampleUrls: z.string().optional(),
  companyName: z.string().min(2, {
    message: "Numele companiei trebuie să conțină cel puțin 2 caractere",
  }),
  contactName: z.string().min(2, {
    message: "Numele de contact trebuie să conțină cel puțin 2 caractere",
  }),
  contactEmail: z.string().email({
    message: "Vă rugăm să introduceți o adresă de email validă",
  }),
  contactPhone: z.string().min(10, {
    message: "Numărul de telefon trebuie să conțină cel puțin 10 caractere",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Auth form schema
const authSchema = z.object({
  email: z.string().email({
    message: "Vă rugăm să introduceți o adresă de email validă",
  }),
  password: z.string().min(6, {
    message: "Parola trebuie să conțină cel puțin 6 caractere",
  }),
  name: z.string().min(2, {
    message: "Numele trebuie să conțină cel puțin 2 caractere",
  }).optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

const RequestProject = () => {
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Get pre-filled values from location state if they exist
  const prefilledValues = location.state || {};

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteType: prefilledValues.websiteType || "business",
      designComplexity: prefilledValues.designComplexity || "standard",
      pageCount: prefilledValues.pageCount || 5,
      hasCMS: prefilledValues.hasCMS || false,
      hasEcommerce: prefilledValues.hasEcommerce || false,
      hasSEO: prefilledValues.hasSEO || false,
      hasMaintenance: prefilledValues.hasMaintenance || false,
      title: prefilledValues.title || "",
      description: prefilledValues.description || "",
      exampleUrls: prefilledValues.exampleUrls || "",
      companyName: prefilledValues.companyName || "",
      contactName: user?.name || prefilledValues.contactName || "",
      contactEmail: user?.email || prefilledValues.contactEmail || "",
      contactPhone: prefilledValues.contactPhone || "",
    },
    mode: "onChange",
  });

  // Form for auth dialog
  const authForm = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleNext = async () => {
    const fields = formSteps[currentStep].fields;
    const output = await form.trigger(fields as any);

    if (!output) return;

    if (currentStep < formSteps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      // Save form data to location state
      const formData = { ...data };
      navigate(".", { state: formData, replace: true });
      
      // Show auth dialog
      setShowAuthDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse example URLs into an array if provided
      let exampleUrlsArray: string[] | null = null;
      if (data.exampleUrls) {
        exampleUrlsArray = data.exampleUrls
          .split(/[\n,]/)
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
      }

      // Use from() method with insert() instead of REST API approach
      const { error } = await supabase
        .from('projects')
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
          example_urls: exampleUrlsArray,
          additional_info: `Company: ${data.companyName}, Contact: ${data.contactName}, Phone: ${data.contactPhone}, Email: ${data.contactEmail}`,
          status: "pending",
        });

      if (error) throw error;

      toast("Cerere trimisă cu succes!", {
        description: "Vă vom contacta în curând."
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting project request:", error);
      toast("Eroare la trimiterea cererii", {
        description: error.message || "Vă rugăm să încercați din nou.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (data: AuthFormData) => {
    try {
      if (isSignUp) {
        if (!data.name) {
          toast("Eroare la înregistrare", {
            description: "Numele este obligatoriu.",
            variant: "destructive"
          });
          return;
        }
        await signUp(data.email, data.password, data.name, "/request-project");
      } else {
        await signIn(data.email, data.password, "/request-project");
      }
      // Close dialog after auth
      setShowAuthDialog(false);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  // Pre-fill form with user data if available
  React.useEffect(() => {
    if (user && !authLoading) {
      form.setValue("contactName", user.name || form.getValues("contactName"));
      form.setValue("contactEmail", user.email || form.getValues("contactEmail"));
      form.setValue("contactPhone", user.phone || form.getValues("contactPhone"));
      form.setValue("companyName", user.company || form.getValues("companyName"));
    }
  }, [user, authLoading, form]);

  return (
    <SmoothWavyBackground className="min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-400 dark:to-indigo-400 text-transparent bg-clip-text mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Solicită un proiect nou
          </motion.h1>
          <motion.p
            className="text-lg text-violet-800 dark:text-violet-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Completează formularul de mai jos și vom reveni cu o estimare
          </motion.p>
        </div>

        <motion.div
          className="mb-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {formSteps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  currentStep > i
                    ? "border-purple-500 bg-purple-500 text-white"
                    : currentStep === i
                    ? "border-purple-500 text-purple-600"
                    : "border-gray-300 text-gray-500"
                )}
              >
                {currentStep > i ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  i + 1
                )}
              </div>
              <div className="mt-2 hidden text-center text-xs md:block">
                <span
                  className={cn(
                    "font-medium",
                    currentStep >= i ? "text-purple-600 dark:text-purple-400" : "text-gray-500"
                  )}
                >
                  {step.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-purple-100 dark:border-purple-900 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-purple-800 dark:text-purple-300">
                          {formSteps[currentStep].name}
                        </CardTitle>
                        <CardDescription className="text-purple-600 dark:text-purple-400">
                          Pasul {currentStep + 1} din {formSteps.length}
                        </CardDescription>
                      </div>
                      <div className="hidden md:block">
                        {React.createElement(formSteps[currentStep].icon, { className: "h-8 w-8 text-purple-500" })}
                      </div>
                    </div>
                  </CardHeader>
                  <div className="mt-4">
                    <Separator className="bg-purple-100 dark:bg-purple-800" />
                  </div>
                  <CardContent className="pt-6">
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="websiteType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-purple-700 dark:text-purple-300">Tipul website-ului</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="business" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Website de prezentare
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="ecommerce" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Magazin online
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="blog" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Blog / Știri
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="portfolio" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Portofoliu
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="custom" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Aplicație web personalizată
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
                          name="designComplexity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-purple-700 dark:text-purple-300">Complexitatea designului</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="simple" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Simplu
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="standard" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Standard
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value="premium" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Premium
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700 dark:text-purple-300">Număr de pagini</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value.toString()}
                                >
                                  <SelectTrigger className="border-purple-200 dark:border-purple-800">
                                    <SelectValue placeholder="Selectează numărul de pagini" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 pagină</SelectItem>
                                    <SelectItem value="5">5 pagini</SelectItem>
                                    <SelectItem value="10">10 pagini</SelectItem>
                                    <SelectItem value="15">15 pagini</SelectItem>
                                    <SelectItem value="20">20+ pagini</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="hasCMS"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-purple-700 dark:text-purple-300">
                                  Sistem de administrare conținut (CMS)
                                </FormLabel>
                                <FormDescription className="text-purple-600/80 dark:text-purple-400/80">
                                  Permite editarea conținutului fără cunoștințe tehnice
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hasEcommerce"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-purple-700 dark:text-purple-300">Funcționalități e-commerce</FormLabel>
                                <FormDescription className="text-purple-600/80 dark:text-purple-400/80">
                                  Coș de cumpărături, plăți online, gestionare produse
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hasSEO"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-purple-700 dark:text-purple-300">Optimizare SEO</FormLabel>
                                <FormDescription className="text-purple-600/80 dark:text-purple-400/80">
                                  Optimizare pentru motoarele de căutare
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hasMaintenance"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-100 dark:border-purple-800 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-purple-700 dark:text-purple-300">Plan de mentenanță</FormLabel>
                                <FormDescription className="text-purple-600/80 dark:text-purple-400/80">
                                  Actualizări, backup-uri și suport tehnic
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700 dark:text-purple-300">Titlul proiectului</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Website pentru compania mea"
                                  {...field}
                                  className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                />
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
                              <FormLabel className="text-purple-700 dark:text-purple-300">Descrierea proiectului</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descrieți proiectul și obiectivele acestuia"
                                  className="min-h-[120px] border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="exampleUrls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700 dark:text-purple-300">Website-uri de referință (opțional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Introduceți adrese URL separate prin virgulă sau linie nouă"
                                  className="min-h-[80px] border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-purple-600/80 dark:text-purple-400/80">
                                Exemplu de website-uri care vă plac sau vă inspiră
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700 dark:text-purple-300">Numele companiei</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduceți numele companiei"
                                  {...field}
                                  className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-700 dark:text-purple-300">Nume complet</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Introduceți numele dvs."
                                    {...field}
                                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                  />
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
                                <FormLabel className="text-purple-700 dark:text-purple-300">Telefon</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Introduceți numărul de telefon"
                                    {...field}
                                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700 dark:text-purple-300">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduceți adresa de email"
                                  {...field}
                                  className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Show account status and sign-in prompt if not logged in */}
                        {!user && !authLoading && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4 border border-purple-200 dark:border-purple-800">
                            <p className="text-purple-800 dark:text-purple-300 font-medium mb-2">
                              Cont de utilizator
                            </p>
                            <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                              Pentru a trimite cererea, vă puteți autentifica sau crea un cont nou. 
                              Astfel veți putea urmări statusul cererii.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsSignUp(false);
                                  setShowAuthDialog(true);
                                }}
                                className="text-purple-700 border-purple-200 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
                              >
                                <LogIn className="h-4 w-4 mr-2" />
                                Autentificare
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  setIsSignUp(true);
                                  setShowAuthDialog(true);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Creare cont
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
                    >
                      <ArrowLeft className="h-4 w-4" /> Înapoi
                    </Button>
                    {currentStep === formSteps.length - 1 ? (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        {isSubmitting ? "Se trimite..." : "Trimite cererea"}
                        <Send className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Continuă <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
        
        {/* Auth dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-800 dark:text-purple-300 text-center">
                {isSignUp ? "Creează cont nou" : "Autentificare"}
              </DialogTitle>
              <DialogDescription className="text-center text-purple-600 dark:text-purple-400">
                {isSignUp 
                  ? "Creează un cont pentru a putea urmări statusul cererii tale."
                  : "Autentifică-te pentru a continua cu cererea ta."
                }
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue={isSignUp ? "signup" : "signin"} onValueChange={(value) => setIsSignUp(value === "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Autentificare</TabsTrigger>
                <TabsTrigger value="signup">Cont nou</TabsTrigger>
              </TabsList>
              
              <Form {...authForm}>
                <form onSubmit={authForm.handleSubmit(handleAuthSubmit)} className="space-y-4">
                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <FormField
                        control={authForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 dark:text-purple-300">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="nume@exemplu.com"
                                type="email"
                                {...field}
                                className="border-purple-200 dark:border-purple-800"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={authForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 dark:text-purple-300">Parolă</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="••••••••"
                                type="password"
                                {...field}
                                className="border-purple-200 dark:border-purple-800"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <FormField
                        control={authForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 dark:text-purple-300">Nume complet</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Numele și prenumele"
                                {...field}
                                className="border-purple-200 dark:border-purple-800"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={authForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 dark:text-purple-300">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="nume@exemplu.com"
                                type="email"
                                {...field}
                                className="border-purple-200 dark:border-purple-800"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={authForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 dark:text-purple-300">Parolă</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Minim 6 caractere"
                                type="password"
                                {...field}
                                className="border-purple-200 dark:border-purple-800"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      {isSignUp ? "Creare cont" : "Autentificare"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </SmoothWavyBackground>
  );
};

export default RequestProject;
