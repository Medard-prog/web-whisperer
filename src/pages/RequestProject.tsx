
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiStepRequestForm, { RequestFormValues } from "@/components/MultiStepRequestForm";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const RequestProject = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState<Partial<RequestFormValues> | null>(null);
  
  useEffect(() => {
    // Parse URL search parameters
    const searchParams = new URLSearchParams(location.search);
    
    // If we have URL parameters, prepare them for the form
    const urlParams: Partial<RequestFormValues> = {};
    
    // Handle numeric parameters
    if (searchParams.has('pageCount')) {
      urlParams.pageCount = parseInt(searchParams.get('pageCount') || '0');
    }
    
    if (searchParams.has('price')) {
      urlParams.price = parseInt(searchParams.get('price') || '0');
    }
    
    // Handle string parameters
    if (searchParams.has('designComplexity')) {
      urlParams.designComplexity = searchParams.get('designComplexity') || '';
    }
    
    // Handle boolean parameters
    if (searchParams.has('hasCms')) {
      urlParams.hasCms = searchParams.get('hasCms') === 'true';
    }
    
    if (searchParams.has('hasEcommerce')) {
      urlParams.hasEcommerce = searchParams.get('hasEcommerce') === 'true';
    }
    
    if (searchParams.has('hasSeo')) {
      urlParams.hasSeo = searchParams.get('hasSeo') === 'true';
    }
    
    if (searchParams.has('hasMaintenance')) {
      urlParams.hasMaintenance = searchParams.get('hasMaintenance') === 'true';
    }
    
    // Check if we have initial data from state (e.g., if navigated from home page)
    if (location.state?.initialData) {
      setInitialValues({
        ...urlParams,
        ...location.state.initialData,
        name: user?.name || location.state.initialData.name || "",
        email: user?.email || location.state.initialData.email || "",
        phone: user?.phone || location.state.initialData.phone || "",
        company: user?.company || location.state.initialData.company || "",
      });
    } else if (user && !loading) {
      // If no initial data but user is logged in, pre-fill with user data
      setInitialValues({
        ...urlParams,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
      });
    } else {
      // Just use the URL parameters if nothing else is available
      if (Object.keys(urlParams).length > 0) {
        setInitialValues(urlParams);
      } else {
        // Provide empty initial values to prevent form from waiting for values
        setInitialValues({});
      }
    }
  }, [user, loading, location.state, location.search]);
  
  const handleSubmit = async (formData: RequestFormValues) => {
    try {
      console.log("Starting submission with data:", formData);
      
      // Map our form data to match the Supabase project_requests table structure
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        project_name: formData.projectName,
        project_type: formData.projectType,
        description: formData.description,
        budget: formData.budget || "medium",
        timeline: formData.deadline ? "custom" : "2-3 months", // Set default or use custom timeline
        communication_preference: "email", // Default communication preference
        user_id: user?.id,
        status: 'new',
        // Map the additional fields that were just added to the database
        design_complexity: formData.designComplexity || "standard",
        has_cms: formData.hasCms || false,
        has_ecommerce: formData.hasEcommerce || false,
        has_seo: formData.hasSeo || false,
        has_maintenance: formData.hasMaintenance || false,
        page_count: formData.pageCount || 5,
        price: formData.price || 0
      };
      
      console.log("Prepared request data:", requestData);
      
      const { data, error } = await supabase
        .from('project_requests')
        .insert([requestData]);
        
      if (error) {
        throw error;
      }
      
      toast.success("Cerere trimisă cu succes!", {
        description: "Te vom contacta în curând pentru a discuta despre proiectul tău.",
      });
      
      // Redirect to dashboard after successful submission if logged in,
      // otherwise to home page
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error submitting project request:", error);
      toast.error("Eroare la trimiterea cererii", {
        description: error.message || "Te rugăm să încerci din nou sau să ne contactezi direct.",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition>
        <main className="flex-grow bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Solicită un Proiect
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Spune-ne despre proiectul tău, iar noi te vom ajuta să îl transformi în realitate.
              </p>
            </div>
            
            {initialValues && <MultiStepRequestForm onSubmit={handleSubmit} initialValues={initialValues} />}
          </div>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default RequestProject;
