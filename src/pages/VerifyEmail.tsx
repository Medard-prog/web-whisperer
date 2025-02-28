
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Envelope, ArrowLeft, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/PageTransition";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get email from location state
  const email = location.state?.email || "";
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);
  
  // Handle resend email verification
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Nu există email pentru verificare");
      return;
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        toast.error("Eroare la retrimiterea emailului", {
          description: error.message
        });
        return;
      }
      
      toast.success("Email trimis cu succes", {
        description: "Te rugăm să verifici căsuța de email"
      });
    } catch (error: any) {
      toast.error("Eroare neașteptată", {
        description: error.message
      });
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="mb-4 p-0 text-primary hover:text-primary/80"
            onClick={() => navigate('/auth')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la autentificare
          </Button>
          
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <Envelope className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Verifică-ți emailul</CardTitle>
              <CardDescription className="text-center">
                {email ? (
                  <>
                    Am trimis un email de verificare la <span className="font-medium">{email}</span>
                  </>
                ) : (
                  "Am trimis un email de verificare la adresa ta de email"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-gray-500">
                Verifică-ți căsuța de email și urmează instrucțiunile pentru a-ți confirma contul.
                Dacă nu găsești emailul, verifică și în folderul de spam.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleResendVerification}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retrimite emailul de verificare
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Înapoi la autentificare
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyEmail;
