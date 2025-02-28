
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    termsAccepted: false,
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!loginForm.email || !loginForm.password) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile.",
      });
      return;
    }

    // Mock login - in a real app, this would call an API
    toast({
      title: "Autentificare reușită",
      description: "Te-ai conectat cu succes!",
    });

    // Redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.passwordConfirm
    ) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
      });
      return;
    }

    if (registerForm.password !== registerForm.passwordConfirm) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Parolele nu coincid.",
      });
      return;
    }

    if (!registerForm.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Trebuie să accepți termenii și condițiile.",
      });
      return;
    }

    // Mock registration - in a real app, this would call an API
    toast({
      title: "Înregistrare reușită",
      description: "Contul tău a fost creat cu succes!",
    });

    // Redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!loginForm.email) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Te rugăm să introduci adresa de email.",
      });
      return;
    }

    toast({
      title: "Email trimis",
      description: "Instrucțiunile pentru resetarea parolei au fost trimise pe adresa ta de email.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {activeTab === "login" ? "Autentificare" : "Creează un cont nou"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? "Conectează-te pentru a-ți gestiona proiectele"
                  : "Completează formularul pentru a crea un cont nou"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Autentificare</TabsTrigger>
                  <TabsTrigger value="register">Înregistrare</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="exemplu@email.com"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Parolă</Label>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={handleForgotPassword}
                        >
                          Ai uitat parola?
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Autentificare
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nume complet</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="Nume și prenume"
                          value={registerForm.name}
                          onChange={handleRegisterChange}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="exemplu@email.com"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Parolă</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirm">Confirmă parola</Label>
                      <div className="relative">
                        <Input
                          id="passwordConfirm"
                          name="passwordConfirm"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerForm.passwordConfirm}
                          onChange={handleRegisterChange}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        checked={registerForm.termsAccepted}
                        onChange={handleRegisterChange}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <Label htmlFor="termsAccepted" className="text-sm">
                        Sunt de acord cu{" "}
                        <a
                          href="/termeni-conditii"
                          className="text-brand-600 hover:underline"
                          target="_blank"
                        >
                          termenii și condițiile
                        </a>
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Creează cont
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
              {activeTab === "login" ? (
                <p>
                  Nu ai cont?{" "}
                  <button
                    type="button"
                    className="text-brand-600 hover:underline"
                    onClick={() => setActiveTab("register")}
                  >
                    Înregistrează-te
                  </button>
                </p>
              ) : (
                <p>
                  Ai deja un cont?{" "}
                  <button
                    type="button"
                    className="text-brand-600 hover:underline"
                    onClick={() => setActiveTab("login")}
                  >
                    Autentifică-te
                  </button>
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
