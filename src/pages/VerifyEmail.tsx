
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import WavyBackground from '@/components/WavyBackground';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <WavyBackground className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-indigo-500/20" />
      </WavyBackground>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Verifică-ți adresa de email
              </CardTitle>
              <CardDescription className="text-center">
                Ți-am trimis un link de verificare pe adresa de email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                <Mail className="h-12 w-12 text-indigo-600" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-gray-700">
                  Pentru a-ți verifica contul, te rugăm să deschizi linkul pe care l-ai primit pe email.
                </p>
                <p className="text-sm text-gray-500">
                  Dacă nu găsești emailul, verifică și folderul de spam.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => navigate('/auth')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la autentificare
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
