
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthCardProps {
  defaultTab: string;
  loginForm: ReactNode;
  registerForm: ReactNode;
}

const AuthCard = ({ defaultTab, loginForm, registerForm }: AuthCardProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4 p-0 text-primary hover:text-primary/80"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Înapoi la pagina principală
      </Button>
      
      <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            WebCraft
          </CardTitle>
          <CardDescription className="text-center">
            Intră în cont sau creează un cont nou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue={defaultTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Autentificare</TabsTrigger>
              <TabsTrigger value="register">Înregistrare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              {loginForm}
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              {registerForm}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-500 text-center mt-2">
            Continuând, ești de acord cu 
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 mx-1">
              Termenii și Condițiile
            </Link>
            și
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800 ml-1">
              Politica de Confidențialitate
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default AuthCard;
