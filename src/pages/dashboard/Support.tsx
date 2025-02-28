
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HelpCircle, LifeBuoy, Phone, Mail } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Support = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Mesajul nu poate fi gol", {
        description: "Te rugăm să scrii un mesaj înainte de a trimite."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user?.id,
          is_admin: false
        });
        
      if (error) throw error;
      
      toast.success("Mesaj trimis cu succes", {
        description: "Îți vom răspunde în cel mai scurt timp posibil."
      });
      
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Eroare la trimiterea mesajului", {
        description: error.message || "Te rugăm să încerci din nou."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <PageTransition>
        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Suport & Asistență</h1>
            <p className="text-gray-600 mb-8">
              Ai întrebări sau ai nevoie de ajutor? Contactează-ne și îți vom răspunde cât mai curând.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-purple-600" />
                    Telefon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">+40 722 123 456</p>
                  <p className="text-sm text-gray-500">Luni-Vineri: 9:00 - 18:00</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-purple-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">suport@webwhisperer.ro</p>
                  <p className="text-sm text-gray-500">Răspundem în 24 de ore</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <LifeBuoy className="mr-2 h-5 w-5 text-purple-600" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">Chat Live</p>
                  <p className="text-sm text-gray-500">Disponibil în timpul programului</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Trimite un mesaj către echipa de suport
                </CardTitle>
                <CardDescription>
                  Completează formularul de mai jos și te vom contacta în cel mai scurt timp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Mesajul tău
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Descrie problema ta sau întrebarea pe care o ai..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  {isSubmitting ? "Se trimite..." : "Trimite Mesajul"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Întrebări Frecvente</CardTitle>
                <CardDescription>
                  Răspunsuri la cele mai comune întrebări
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-1">Cât durează realizarea unui proiect?</h3>
                    <p className="text-gray-600">
                      Durata variază în funcție de complexitatea proiectului. Un website simplu poate fi gata în 1-2 săptămâni,
                      în timp ce un proiect complex poate dura 2-3 luni sau mai mult.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-1">Cum pot modifica proiectul după ce a fost lansat?</h3>
                    <p className="text-gray-600">
                      După lansare, poți solicita modificări prin intermediul dashboard-ului tău sau contactând echipa de suport.
                      Modificările minore sunt incluse în pachetul de mentenanță, iar cele majore pot necesita costuri suplimentare.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-1">Ce include pachetul de mentenanță?</h3>
                    <p className="text-gray-600">
                      Pachetul de mentenanță include actualizări de securitate, backup-uri regulate, rezolvarea problemelor tehnice,
                      asistență prin email și telefon, și modificări minore de conținut.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Support;
