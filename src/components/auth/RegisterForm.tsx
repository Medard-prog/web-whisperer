
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Mail, Lock, User, Building, Phone, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, name: string, company: string, phone: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const RegisterForm = ({ onSubmit, error, loading }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, name, company, phone);
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
        <Label htmlFor="register-name">Nume</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="register-name"
            type="text"
            placeholder="Nume complet"
            className="pl-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="register-email"
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
        <Label htmlFor="register-password">Parolă</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="register-password"
            type="password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Companie (opțional)</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="company"
            type="text"
            placeholder="Numele companiei"
            className="pl-10"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon (opțional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="Număr de telefon"
            className="pl-10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
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
          'Creează cont'
        }
      </Button>
    </form>
  );
};

export default RegisterForm;
