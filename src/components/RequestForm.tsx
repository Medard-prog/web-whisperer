import { useState } from "react";
import { zodResolver } from "zod-form-data";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitProjectRequest } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// Define the form schema
const formSchema = z.object({
  // Contact info
  name: z.string().min(2, { message: "Numele trebuie să aibă minim 2 caractere" }),
  email: z.string().email({ message: "Email invalid" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  communication_preference: z.enum(["email", "phone", "whatsapp", "custom"], {
    required_error: "Selectează o metodă de comunicare",
  }),
  custom_communication: z.string().optional(),

  // Project details
  project_type: z.enum(["website", "e-commerce", "application", "other"], {
    required_error: "Selectează tipul de proiect",
  }),
  specific_type: z.string().optional(),
  project_name: z.string().min(2, { message: "Numele proiectului trebuie să aibă minim 2 caractere" }),
  description: z.string().min(10, { message: "Descrierea trebuie să aibă minim 10 caractere" }),
  business_goal: z.string().optional(),
  target_audience: z.string().optional(),

  // Budget and timeline
  budget: z.enum(["small", "medium", "large", "custom"], {
    required_error: "Selectează un buget",
  }),
  custom_budget: z.string().optional(),
  timeline: z.enum(["urgent", "normal", "flexible", "custom"], {
    required_error: "Selectează un termen",
  }),
  custom_timeline: z.string().optional(),

  // Files
  has_files: z.boolean().default(false),
  file_description: z.string().optional(),

  // Consent
  newsletter_consent: z.boolean().default(false),
});

const RequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
      communication_preference: "email",
      custom_communication: "",
      project_type: "website",
      specific_type: "",
      project_name: "",
      description: "",
      business_goal: "",
      target_audience: "",
      budget: "medium",
      custom_budget: "",
      timeline: "normal",
      custom_timeline: "",
      has_files: false,
      file_description: "",
      newsletter_consent: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Add user_id if authenticated
      const requestData = {
        ...values,
        user_id: user?.id,
      };
      
      await submitProjectRequest(requestData);
      
      // Show success message
      toast.success("Cerere trimisă cu succes!", {
        description: "Te vom contacta în curând pe baza preferințelor tale."
      });
      
      // Redirect to thank you page or dashboard
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/", { state: { requestSubmitted: true } });
      }
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error("Eroare la trimiterea cererii", {
        description: error.message || "Te rugăm să încerci din nou."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle step navigation
  const handleStepChange = async (direction: "next" | "prev") => {
    if (direction === "next") {
      // Validate only the fields in the current step
      const fieldsToValidate = 
        step === 1 
          ? ["name", "email", "phone", "company", "communication_preference", "custom_communication"]
          : step === 2
          ? ["project_type", "specific_type", "project_name", "description", "business_goal", "target_audience"]
          : ["budget", "custom_budget", "timeline", "custom_timeline", "has_files", "file_description"];
      
      const isValid = await form.trigger(fieldsToValidate as any);
      
      if (isValid) {
        setStep(Math.min(step + 1, totalSteps));
        window.scrollTo(0, 0);
      }
    } else {
      setStep(Math.max(step - 1, 1));
      window.scrollTo(0, 0);
    }
  };

  // Render steps indicators
  const renderStepIndicators = () => (
    <div className="flex justify-center mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step > index + 1
                ? "bg-green-100 text-green-600"
                : step === index + 1
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {step > index + 1 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-10 h-1 ${
                step > index + 1 ? "bg-green-200" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Solicită o ofertă</CardTitle>
        <CardDescription>
          Completează formularul și vom reveni cu o ofertă personalizată.
        </CardDescription>
        {renderStepIndicators()}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informații de contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume complet <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="+40 xxx xxx xxx" {...field} />
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
                          <Input placeholder="Numele companiei" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="communication_preference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Metoda preferată de comunicare <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="email" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Email
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="phone" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Telefon
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="whatsapp" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              WhatsApp
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Altă metodă (specifică mai jos)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("communication_preference") === "custom" && (
                  <FormField
                    control={form.control}
                    name="custom_communication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifică metoda de comunicare</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Skype, Telegram, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Step 2: Project Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalii proiect</h3>
                <FormField
                  control={form.control}
                  name="project_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipul proiectului <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează tipul de proiect" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="e-commerce">
                            Magazin online
                          </SelectItem>
                          <SelectItem value="application">Aplicație</SelectItem>
                          <SelectItem value="other">Altul</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("project_type") === "other" && (
                  <FormField
                    control={form.control}
                    name="specific_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifică tipul de proiect</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="project_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numele proiectului <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="WebCraft Project" {...field} />
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
                      <FormLabel>Descrierea proiectului <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie pe scurt ce dorești să realizezi..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include detalii despre funcționalitățile dorite și cerințele specifice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obiectivul de afaceri</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ce dorești să obții cu ajutorul acestui proiect?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explică cum va ajuta acest proiect afacerea sau organizația ta.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publicul țintă</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Tineri profesioniști, 25-40 ani"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Descrie cine sunt utilizatorii finali ai produsului tău.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Budget and Timeline */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buget și termen</h3>
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Buget estimat <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="small" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mic (sub 1.000€)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mediu (1.000€ - 5.000€)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="large" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mare (peste 5.000€)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Personalizat (specifică mai jos)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("budget") === "custom" && (
                  <FormField
                    control={form.control}
                    name="custom_budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifică bugetul</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Flexibil, 7.000€, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Termen de implementare <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="urgent" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Urgent (sub 1 lună)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="normal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Normal (1-3 luni)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="flexible" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Flexibil (peste 3 luni)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Personalizat (specifică mai jos)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("timeline") === "custom" && (
                  <FormField
                    control={form.control}
                    name="custom_timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifică termenul</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 2 săptămâni, depinde de etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="has_files"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Am fișiere sau documente relevante</FormLabel>
                        <FormDescription>
                          Schiţe, specificații, design-uri, exemple, referințe
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("has_files") && (
                  <FormField
                    control={form.control}
                    name="file_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrie fișierele disponibile</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrie ce fișiere ai și cum pot ajuta la realizarea proiectului..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Vom organiza un mod de transfer al fișierelor după trimiterea cererii.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="newsletter_consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Abonează-mă la newsletter</FormLabel>
                        <FormDescription>
                          Primește sfaturi, noutăți și oferte speciale. Te poți dezabona oricând.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleStepChange("prev")}
                >
                  Înapoi
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Anulează
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => handleStepChange("next")}
                >
                  Continuă
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    "Trimite cererea"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500 mt-4">
          * Câmpurile marcate cu <span className="text-red-500">*</span> sunt obligatorii
        </p>
      </CardFooter>
    </Card>
  );
};

export default RequestForm;
