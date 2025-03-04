import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiStepRequestForm, { RequestFormValues } from "@/components/MultiStepRequestForm";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const RequestProject = () => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState<Partial<RequestFormValues> | null>(null);
  
  useEffect(() => {
    const handleAuthChange = async () => {
      if (user === null && !loading) {
        console.log("User not logged in on request page");
      } else if (user && !loading) {
        console.log("User logged in on request page:", user.id);
        await refreshUser();
      }
    };
    
    handleAuthChange();
  }, [user, loading, refreshUser]);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const urlParams: Partial<RequestFormValues> = {};
    
    if (searchParams.has('pageCount')) {
      urlParams.pageCount = parseInt(searchParams.get('pageCount') || '0');
    }
    
    if (searchParams.has('price')) {
      urlParams.price = parseInt(searchParams.get('price') || '0');
    }
    
    if (searchParams.has('designComplexity')) {
      urlParams.designComplexity = searchParams.get('designComplexity') || '';
    }
    
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
      setInitialValues({
        ...urlParams,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
      });
    } else {
      if (Object.keys(urlParams).length > 0) {
        setInitialValues(urlParams);
      } else {
        setInitialValues({});
      }
    }
  }, [user, loading, location.state, location.search]);
  
  const handleSubmit = async (formData: RequestFormValues) => {
    try {
      console.log("Starting submission with data:", formData);
      
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || user?.id;
      
      console.log("Current user ID for project submission:", currentUserId);
      
      const requestData = {
        title: formData.projectName,
        description: formData.description || '',
        website_type: formData.projectType || '',
        user_id: currentUserId,
        status: 'new',
        type: 'request',
        design_complexity: formData.designComplexity || "standard",
        has_cms: formData.hasCms || false,
        has_ecommerce: formData.hasEcommerce || false,
        has_seo: formData.hasSeo || false,
        has_maintenance: formData.hasMaintenance || false,
        page_count: formData.pageCount || 5,
        price: formData.price || 0,
        example_urls: formData.exampleUrls || [],
        additional_info: formData.additionalInfo || ''
      };
      
      console.log("Prepared project data:", requestData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([requestData]);
        
      if (error) {
        throw error;
      }
      
      toast.success("Cerere trimisă cu succes!", {
        description: "Te vom contacta în curând pentru a discuta despre proiectul tău.",
      });
      
      if (currentUserId) {
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
