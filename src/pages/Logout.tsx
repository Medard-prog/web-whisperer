
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Logout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        // We'll let AuthContext handle the navigation to home
      } catch (error) {
        console.error('Error during sign out:', error);
        // If there's an error, navigate to home anyway
        navigate('/');
      }
    };
    
    performLogout();
  }, [signOut, navigate]);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="text-center p-8 max-w-md">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <LogOut className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deconectare în curs...</h1>
          <p className="text-gray-600 mb-8">
            Vă mulțumim că ați folosit serviciile noastre. Vă redirecționăm către pagina principală.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Logout;
