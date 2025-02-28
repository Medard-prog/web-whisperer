
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
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
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle, Laptop, PaintBucket, FileText, Building, Send, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import WavyBackground from "@/components/WavyBackground";

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

const RequestProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      companyName: "",
      contactName: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: "",
    },
    mode: "onChange",
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
      toast({
        title: "Trebuie să fiți autentificat",
        description: "Vă rugăm să vă autentificați pentru a trimite cererea",
        variant: "destructive",
      });
      navigate("/auth", { state: { returnUrl: "/request-project" } });
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

      // Instead of using the from() method with "project_requests" directly
      // We'll use the REST API approach which doesn't depend on TypeScript types
      const { error } = await supabase.rest.post('/project_requests', {
        user_id: user.id,
        title: data.title,
        description: data.description,
        company_name: data.companyName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        website_type: data.websiteType,
        design_complexity: data.designComplexity,
        page_count: data.pageCount,
        has_cms: data.hasCMS,
        has_ecommerce: data.hasEcommerce,
        has_seo: data.hasSEO,
        has_maintenance: data.hasMaintenance,
        reference_urls: exampleUrlsArray,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Cerere trimisă cu succes!",
        description: "Vă vom contacta în curând.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting project request:", error);
      toast({
        title: "Eroare la trimiterea cererii",
        description: error.message || "Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WavyBackground className="min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Solicită un proiect nou
          </motion.h1>
          <motion.p
            className="text-lg text-brand-700 dark:text-brand-200"
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
                    ? "border-brand-500 bg-brand-500 text-white"
                    : currentStep === i
                    ? "border-brand-500 text-brand-500"
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
                    currentStep >= i ? "text-brand-500" : "text-gray-500"
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
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-brand-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-brand-900 dark:text-white">
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
                </CardHeader>
                <div className="mt-4">
                  <Separator />
                </div>
                <CardContent className="pt-6">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="websiteType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Tipul website-ului</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="business" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Website de prezentare
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="ecommerce" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Magazin online
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="blog" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Blog / Știri
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="portfolio" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Portofoliu
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
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
                            <FormLabel>Complexitatea designului</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="simple" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Simplu
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="standard" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Standard
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
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
                            <FormLabel>Număr de pagini</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value.toString()}
                              >
                                <SelectTrigger>
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Sistem de administrare conținut (CMS)
                              </FormLabel>
                              <FormDescription>
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Funcționalități e-commerce</FormLabel>
                              <FormDescription>
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Optimizare SEO</FormLabel>
                              <FormDescription>
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Plan de mentenanță</FormLabel>
                              <FormDescription>
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
                            <FormLabel>Titlul proiectului</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: Website pentru compania mea"
                                {...field}
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
                            <FormLabel>Descrierea proiectului</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descrieți proiectul și obiectivele acestuia"
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
                        name="exampleUrls"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website-uri de referință (opțional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Introduceți adrese URL separate prin virgulă sau linie nouă"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
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
                            <FormLabel>Numele companiei</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Introduceți numele companiei"
                                {...field}
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
                              <FormLabel>Nume complet</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduceți numele dvs."
                                  {...field}
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
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduceți numărul de telefon"
                                  {...field}
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Introduceți adresa de email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Înapoi
                  </Button>
                  {currentStep === formSteps.length - 1 ? (
                    <Button type="submit" disabled={isSubmitting} className="gap-1">
                      {isSubmitting ? "Se trimite..." : "Trimite cererea"}
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNext} className="gap-1">
                      Continuă <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </form>
        </Form>
      </div>
    </WavyBackground>
  );
};

export default RequestProject;
