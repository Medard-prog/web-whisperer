
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateProjectPrice } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectDetailsStep from "@/components/request-project/ProjectDetailsStep";
import ProjectFeaturesStep from "@/components/request-project/ProjectFeaturesStep";
import AdditionalInfoStep from "@/components/request-project/AdditionalInfoStep";
import ContactInfoStep from "@/components/request-project/ContactInfoStep";
import StepIndicator from "@/components/request-project/StepIndicator";
import StepNavigator from "@/components/request-project/StepNavigator";

const RequestProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const steps = ["Detalii", "Specificații", "Exemple", "Finalizare"];
  
  // Load calculator state from sessionStorage if available
  const savedState = sessionStorage.getItem('calculatorState');
  const calculatorState = savedState ? JSON.parse(savedState) : null;
  
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    websiteType: "presentation",
    pageCount: calculatorState?.pageCount || 5,
    designComplexity: calculatorState?.designComplexity || "standard",
    hasCMS: calculatorState?.hasCMS || false,
    hasEcommerce: calculatorState?.hasEcommerce || false,
    hasSEO: calculatorState?.hasSEO || false,
    hasMaintenance: calculatorState?.hasMaintenance || false,
    exampleUrls: [] as string[],
    additionalInfo: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
  });
  
  // Update price when form values change
  const [price, setPrice] = useState(calculatorState?.totalPrice || 0);
  
  useEffect(() => {
    const calculatedPrice = calculateProjectPrice(
      formValues.pageCount,
      formValues.designComplexity,
      formValues.hasCMS,
      formValues.hasEcommerce,
      formValues.hasSEO,
      formValues.hasMaintenance
    );
    setPrice(calculatedPrice);
  }, [formValues]);
  
  // Prefill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormValues(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        company: user.company || prev.company,
      }));
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormValues({ ...formValues, [name]: checked });
  };
  
  const handleAddUrl = (url: string) => {
    setFormValues({
      ...formValues,
      exampleUrls: [...formValues.exampleUrls, url],
    });
  };
  
  const handleRemoveUrl = (indexToRemove: number) => {
    setFormValues({
      ...formValues,
      exampleUrls: formValues.exampleUrls.filter((_, index) => index !== indexToRemove),
    });
  };
  
  const validateStep = () => {
    if (step === 1) {
      if (!formValues.title || !formValues.description || !formValues.websiteType) {
        toast({
          variant: "destructive",
          title: "Câmpuri obligatorii",
          description: "Te rugăm să completezi toate câmpurile obligatorii.",
        });
        return false;
      }
    }
    
    if (step === 4) {
      if (!formValues.name || !formValues.email) {
        toast({
          variant: "destructive",
          title: "Câmpuri obligatorii",
          description: "Te rugăm să completezi numele și email-ul.",
        });
        return false;
      }
      
      if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        toast({
          variant: "destructive",
          title: "Email invalid",
          description: "Te rugăm să introduci o adresă de email validă.",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (!validateStep()) return;
    
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Register new user if not logged in
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formValues.email,
          password: Math.random().toString(36).slice(-10), // Random password
          options: {
            data: { name: formValues.name },
          },
        });
        
        if (authError) throw authError;
        
        if (authData.user) {
          await supabase.from('profiles').update({
            phone: formValues.phone,
            company: formValues.company,
          }).eq('id', authData.user.id);
          
          await supabase.from('projects').insert({
            user_id: authData.user.id,
            title: formValues.title,
            description: formValues.description,
            website_type: formValues.websiteType,
            page_count: formValues.pageCount,
            design_complexity: formValues.designComplexity,
            has_cms: formValues.hasCMS,
            has_ecommerce: formValues.hasEcommerce,
            has_seo: formValues.hasSEO,
            has_maintenance: formValues.hasMaintenance,
            price: price,
            example_urls: formValues.exampleUrls,
            additional_info: formValues.additionalInfo,
          });
          
          toast({
            title: "Cerere trimisă cu succes",
            description: "Ți-am trimis un email pentru a confirma contul tău.",
          });
          
          navigate('/auth/verify-email');
        }
      } else {
        // User is logged in
        await supabase.from('projects').insert({
          user_id: session.user.id,
          title: formValues.title,
          description: formValues.description,
          website_type: formValues.websiteType,
          page_count: formValues.pageCount,
          design_complexity: formValues.designComplexity,
          has_cms: formValues.hasCMS,
          has_ecommerce: formValues.hasEcommerce,
          has_seo: formValues.hasSEO,
          has_maintenance: formValues.hasMaintenance,
          price: price,
          example_urls: formValues.exampleUrls,
          additional_info: formValues.additionalInfo,
        });
        
        // Update profile if needed
        if (formValues.phone !== user?.phone || formValues.company !== user?.company) {
          await supabase.from('profiles').update({
            phone: formValues.phone,
            company: formValues.company,
          }).eq('id', session.user.id);
        }
        
        toast({
          title: "Cerere trimisă cu succes",
          description: "Cererea ta de proiect a fost trimisă cu succes!",
        });
        
        navigate('/dashboard');
      }
      
      // Clear calculator state from sessionStorage
      sessionStorage.removeItem('calculatorState');
    } catch (error: any) {
      console.error('Error submitting project:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: error.message || "A apărut o eroare. Încearcă din nou.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="min-h-screen bg-gray-50 py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Solicită ofertă personalizată</CardTitle>
                    <CardDescription>
                      Completează formularul pentru a primi o ofertă personalizată
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-brand-600">
                    {price.toLocaleString()} RON
                  </div>
                </div>
                
                <StepIndicator currentStep={step} steps={steps} />
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 1 && (
                      <ProjectDetailsStep
                        title={formValues.title}
                        description={formValues.description}
                        websiteType={formValues.websiteType}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                      />
                    )}
                    
                    {step === 2 && (
                      <ProjectFeaturesStep
                        pageCount={formValues.pageCount}
                        designComplexity={formValues.designComplexity}
                        hasCMS={formValues.hasCMS}
                        hasEcommerce={formValues.hasEcommerce}
                        hasSEO={formValues.hasSEO}
                        hasMaintenance={formValues.hasMaintenance}
                        handleSelectChange={handleSelectChange}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    )}
                    
                    {step === 3 && (
                      <AdditionalInfoStep
                        exampleUrls={formValues.exampleUrls}
                        additionalInfo={formValues.additionalInfo}
                        handleChange={handleChange}
                        addUrl={handleAddUrl}
                        removeUrl={handleRemoveUrl}
                      />
                    )}
                    
                    {step === 4 && (
                      <ContactInfoStep
                        name={formValues.name}
                        email={formValues.email}
                        phone={formValues.phone}
                        company={formValues.company}
                        handleChange={handleChange}
                        userLoggedIn={!!user}
                        price={price}
                        projectInfo={{
                          title: formValues.title,
                          websiteType: formValues.websiteType,
                          pageCount: formValues.pageCount,
                          designComplexity: formValues.designComplexity,
                          hasCMS: formValues.hasCMS,
                          hasEcommerce: formValues.hasEcommerce,
                          hasSEO: formValues.hasSEO,
                          hasMaintenance: formValues.hasMaintenance,
                        }}
                      />
                    )}
                  </motion.div>
                  
                  <StepNavigator
                    currentStep={step}
                    totalSteps={steps.length}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    isSubmitting={loading}
                    isLastStep={step === steps.length}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};

export default RequestProject;
