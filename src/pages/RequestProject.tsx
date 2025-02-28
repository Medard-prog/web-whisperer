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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState<Partial<RequestFormValues> | null>(null);
  
  useEffect(() => {
    // Check if we have initial data from state (e.g., if navigated from home page)
    if (location.state?.initialData) {
      setInitialValues({
        ...location.state.initialData,
        name: user?.name || location.state.initialData.name || "",
        email: user?.email || location.state.initialData.email || "",
        phone: user?.phone || location.state.initialData.phone || "",
        company: user?.company || location.state.initialData.company || "",
      });
    } else if (user && !loading) {
      // If no initial data but user is logged in, pre-fill with user data
      setInitialValues({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
      });
    }
  }, [user, loading, location.state]);
  
  const handleSubmit = async (formData: RequestFormValues) => {
    try {
      // Add the user_id if the user is logged in
      const requestData = {
        ...formData,
        user_id: user?.id,
        status: 'new'
      };
      
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
