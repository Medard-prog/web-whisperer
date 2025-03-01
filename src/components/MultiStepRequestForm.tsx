
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StepOne from "./request-form/StepOne";
import StepTwo from "./request-form/StepTwo";
import StepThree from "./request-form/StepThree";
import StepFour from "./request-form/StepFour";

const formSchema = z.object({
  // Step 1: Personal Info
  name: z.string().min(2, { message: "Numele trebuie să aibă minim 2 caractere" }),
  email: z.string().email({ message: "Adresa de email nu este validă" }),
  phone: z.string().min(10, { message: "Numărul de telefon trebuie să aibă minim 10 caractere" }),
  company: z.string().optional(),
  
  // Step 2: Project Basics
  projectName: z.string().min(2, { message: "Numele proiectului trebuie să aibă minim 2 caractere" }),
  projectType: z.string({ required_error: "Selectează tipul proiectului" }),
  
  // Step 3: Project Details
  description: z.string().min(10, { message: "Descrierea trebuie să aibă minim 10 caractere" }),
  budget: z.string({ required_error: "Selectează bugetul estimat" }),
  deadline: z.date().optional(),
  
  // Step 4: Features & Confirmation
  features: z.array(z.string()).optional(),
  terms: z.boolean().refine(val => val === true, { message: "Trebuie să fii de acord cu termenii și condițiile" }),
  
  // Additional fields to store URL parameters
  pageCount: z.number().optional(),
  designComplexity: z.string().optional(),
  hasCms: z.boolean().optional(),
  hasEcommerce: z.boolean().optional(),
  hasSeo: z.boolean().optional(),
  hasMaintenance: z.boolean().optional(),
  price: z.number().optional(),
});

export type RequestFormValues = z.infer<typeof formSchema>;

interface MultiStepRequestFormProps {
  initialValues?: Partial<RequestFormValues>;
  onSubmit: (data: RequestFormValues) => Promise<void>;
}

const stepLabels = [
  "Informații Personale",
  "Informații Proiect",
  "Detalii Proiect",
  "Funcționalități & Confirmare"
];

const MultiStepRequestForm = ({ initialValues, onSubmit }: MultiStepRequestFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, loading, refreshUser } = useAuth();
  
  // Form setup
  const methods = useForm<RequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      company: initialValues?.company || "",
      projectName: initialValues?.projectName || "",
      projectType: initialValues?.projectType || "",
      description: initialValues?.description || "",
      budget: initialValues?.budget || "",
      deadline: initialValues?.deadline,
      features: initialValues?.features || [],
      terms: initialValues?.terms || false,
      // Additional fields from URL
      pageCount: initialValues?.pageCount,
      designComplexity: initialValues?.designComplexity,
      hasCms: initialValues?.hasCms,
      hasEcommerce: initialValues?.hasEcommerce,
      hasSeo: initialValues?.hasSeo,
      hasMaintenance: initialValues?.hasMaintenance,
      price: initialValues?.price,
    },
  });
  
  const { handleSubmit, trigger, getValues, setValue } = methods;
  
  // Update form with user data when authenticated
  useEffect(() => {
    if (user && !loading) {
      setValue("name", user.name || getValues("name"));
      setValue("email", user.email || getValues("email"));
      setValue("phone", user.phone || getValues("phone"));
      setValue("company", user.company || getValues("company"));
    }
  }, [user, loading, setValue, getValues]);
  
  // Handle step navigation
  const nextStep = async () => {
    // Validate current step fields
    const fieldsToValidate = {
      0: ["name", "email", "phone"],
      1: ["projectName", "projectType"],
      2: ["description", "budget"],
      3: ["terms"]
    }[currentStep as 0 | 1 | 2 | 3];
    
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Last step - check if user is logged in
        if (!user && !loading) {
          setLoginDialogOpen(true);
          const formValues = getValues();
          setSignupName(formValues.name);
          setSignupEmail(formValues.email);
          setLoginEmail(formValues.email);
        } else {
          // User is logged in, submit form
          handleFormSubmit();
        }
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle login
  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) throw error;
      
      await refreshUser();
      setLoginDialogOpen(false);
      toast.success("Ați fost conectat cu succes", { description: "Vă mulțumim pentru conectare." });
      // Submit the form after successful login
      setTimeout(() => handleFormSubmit(), 500);
      
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error("Eroare la conectare", { description: error.message || "Nu s-a putut realiza conectarea" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle signup
  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: signupName,
          },
        },
      });
      
      if (error) throw error;
      
      setLoginDialogOpen(false);
      toast.success("Cont creat cu succes!", { description: "Verificați email-ul pentru a confirma" });
      
      // For development, we'll proceed with the form submission without email verification
      setTimeout(() => handleFormSubmit(), 500);
      
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error("Eroare la crearea contului", { description: error.message || "Nu s-a putut crea contul" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = () => {
    handleSubmit(async (data) => {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Eroare la trimiterea cererii", { description: "Vă rugăm să încercați din nou" });
      } finally {
        setIsSubmitting(false);
      }
    })();
  };
  
  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0
    })
  };
  
  return (
    <FormProvider {...methods}>
      <Card className="bg-white shadow-xl border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Solicită un Proiect</CardTitle>
          <CardDescription>
            Completează formularul pentru a ne spune despre proiectul tău
          </CardDescription>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between">
              {stepLabels.map((label, index) => (
                <div 
                  key={index}
                  className={`flex-1 text-center ${index === currentStep ? 'text-purple-700 font-medium' : 'text-gray-500'}`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2 ${
                      index < currentStep 
                        ? 'bg-purple-100 border-purple-500 text-purple-700' 
                        : index === currentStep 
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs hidden sm:block">{label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded transition-all duration-300"
                style={{ width: `${(currentStep / (stepLabels.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form id="request-form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
            <AnimatePresence custom={currentStep} mode="wait">
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <StepOne />}
                {currentStep === 1 && <StepTwo />}
                {currentStep === 2 && <StepThree />}
                {currentStep === 3 && <StepFour />}
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'opacity-0' : ''}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Înapoi
          </Button>
          
          <Button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {currentStep === stepLabels.length - 1 ? (
              isSubmitting ? 'Se trimite...' : 'Trimite Cererea'
            ) : (
              <>
                Continuă
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Authentication Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Conectare cont' : 'Creează un cont nou'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Conectează-te pentru a trimite cererea de proiect' 
                : 'Creează un cont pentru a trimite cererea și a urmări proiectul tău'}
            </DialogDescription>
          </DialogHeader>
          
          {authMode === 'login' ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parolă</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nume complet</label>
                <input 
                  type="text" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parolă</label>
                <input 
                  type="password" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="flex-1"
            >
              {authMode === 'login' ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Creează cont nou
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Am deja un cont
                </>
              )}
            </Button>
            <Button 
              onClick={authMode === 'login' ? handleLogin : handleSignup} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Se procesează...' : (authMode === 'login' ? 'Conectare' : 'Creează cont')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default MultiStepRequestForm;
