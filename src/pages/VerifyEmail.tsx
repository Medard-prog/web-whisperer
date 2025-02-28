
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import WavyBackground from "@/components/WavyBackground";
import PageTransition from "@/components/PageTransition";

const VerifyEmail = () => {
  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <WavyBackground className="h-full w-full absolute inset-0" />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-2 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Verifică-ți email-ul</CardTitle>
                <CardDescription>
                  Ți-am trimis un email cu un link pentru a verifica adresa ta de email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-gray-600">
                  Pentru a finaliza procesul de înregistrare, accesează linkul din email și revino apoi pe această pagină.
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    Verifică și folderul de Spam
                  </h3>
                  <p className="text-sm text-gray-500">
                    Dacă nu găsești email-ul în Inbox, te rugăm să verifici și folderul de Spam sau Junk.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  asChild
                >
                  <Link to="/auth">Am verificat email-ul</Link>
                </Button>
                <div className="text-center text-sm text-gray-500">
                  <span>Nu ai primit email-ul? </span>
                  <Link to="/auth" className="text-purple-600 hover:text-purple-800 font-medium">
                    Încearcă din nou
                  </Link>
                </div>
              </CardFooter>
            </Card>
            
            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                asChild
                className="text-sm text-gray-600 hover:text-purple-600"
              >
                <Link to="/">Înapoi la pagina principală</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyEmail;
