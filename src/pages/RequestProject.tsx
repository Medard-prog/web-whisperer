
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequestForm from "@/components/RequestForm";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const RequestProject = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);
  
  useEffect(() => {
    // If the user is logged in, pre-fill the form with their info
    if (user && !loading) {
      setInitialValues({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
      });
    }
  }, [user, loading]);
  
  const handleSubmit = async (formData: any) => {
    try {
      // Add the user_id if the user is logged in
      if (user) {
        formData.user_id = user.id;
      }
      
      const { data, error } = await supabase
        .from('project_requests')
        .insert([formData]);
        
      if (error) {
        throw error;
      }
      
      toast.success("Cerere trimisă cu succes!", {
        description: "Te vom contacta în curând pentru a discuta despre proiectul tău.",
      });
      
      // Redirect to home after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error submitting project request:", error);
      toast.error("Eroare la trimiterea cererii", {
        description: "Te rugăm să încerci din nou sau să ne contactezi direct.",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition>
        <main className="flex-grow bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Solicită un Proiect
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Spune-ne despre proiectul tău, iar noi te vom ajuta să îl transformi în realitate.
              </p>
            </div>
            
            <RequestForm onSubmit={handleSubmit} initialValues={initialValues} />
          </div>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default RequestProject;
