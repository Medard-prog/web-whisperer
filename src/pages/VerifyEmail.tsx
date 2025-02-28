
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import WavyBackground from "@/components/WavyBackground";
import PageTransition from "@/components/PageTransition";

const VerifyEmail = () => {
  return (
    <PageTransition>
      <WavyBackground className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-brand-600" />
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
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Verifică și folderul de Spam
                </h3>
                <p className="text-sm text-gray-500">
                  Dacă nu găsești email-ul în Inbox, te rugăm să verifici și folderul de Spam sau Junk.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-brand-600 hover:bg-brand-700">
                Am verificat email-ul
              </Button>
              <div className="text-center text-sm text-gray-500">
                <span>Nu ai primit email-ul? </span>
                <Link to="/auth" className="text-brand-600 hover:text-brand-800 font-medium">
                  Încearcă din nou
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              asChild
              className="text-sm text-gray-600 hover:text-brand-600"
            >
              <Link to="/">Înapoi la pagina principală</Link>
            </Button>
          </div>
        </motion.div>
      </WavyBackground>
    </PageTransition>
  );
};

export default VerifyEmail;
