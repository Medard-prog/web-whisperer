
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { LogIn, Home } from 'lucide-react';

const Logout = () => {
  useEffect(() => {
    // We can add any cleanup logic here if needed
    document.title = 'Logged Out - WebCreator';
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Deconectat cu succes
            </h1>
            <p className="mt-2 text-gray-600">
              Ți-ai închis sesiunea în siguranță. Mulțumim că ai folosit serviciile noastre!
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Îți mulțumim pentru vizită</CardTitle>
              <CardDescription>
                Te-ai deconectat cu succes din contul tău.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Conectează-te din nou
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Înapoi la pagina principală
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Logout;
