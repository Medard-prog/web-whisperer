
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const LoginForm = ({ onSubmit, error, loading }: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="nume@exemplu.com"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Parolă</Label>
          <Button
            variant="link"
            className="p-0 h-auto font-normal text-xs text-primary"
            onClick={() => navigate('/reset-password')}
            type="button"
          >
            Ai uitat parola?
          </Button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        disabled={loading}
      >
        {loading ? 
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se procesează...</> : 
          'Autentificare'
        }
      </Button>
    </form>
  );
};

export default LoginForm;
