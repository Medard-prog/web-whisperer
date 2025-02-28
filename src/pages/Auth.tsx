
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import WavyBackground from "@/components/WavyBackground";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const validateLogin = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    
    if (!email) newErrors.email = "Email-ul este obligatoriu";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalid";
    
    if (!password) newErrors.password = "Parola este obligatorie";
    else if (password.length < 6) newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere";
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };
  
  const validateSignup = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    
    if (!name) newErrors.name = "Numele este obligatoriu";
    
    if (!email) newErrors.email = "Email-ul este obligatoriu";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalid";
    
    if (!password) newErrors.password = "Parola este obligatorie";
    else if (password.length < 6) newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Parolele nu coincid";
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  const handleForgotPassword = () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email necesar",
        description: "Te rugăm să introduci adresa de email pentru a reseta parola.",
      });
      return;
    }
    
    // Reset password functionality would go here
    toast({
      title: "Email trimis",
      description: "Verifică emailul pentru instrucțiuni de resetare a parolei.",
    });
  };
  
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
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-14 h-14 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">W</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">
                  {activeTab === "login" ? "Autentificare" : "Creează un cont nou"}
                </CardTitle>
                <CardDescription className="text-center">
                  {activeTab === "login" 
                    ? "Intră în contul tău pentru a-ți gestiona proiectele" 
                    : "Completează datele pentru a crea un cont nou"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Autentificare</TabsTrigger>
                    <TabsTrigger value="register">Înregistrare</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="login-email" 
                            type="email" 
                            placeholder="nume@exemplu.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Parola</Label>
                          <button 
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-purple-600 hover:text-purple-800"
                          >
                            Ai uitat parola?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="login-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Se încarcă...
                          </div>
                        ) : (
                          <span>Autentificare</span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Nume complet</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="signup-name" 
                            type="text" 
                            placeholder="Nume și prenume" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="nume@exemplu.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Parola</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="signup-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirmă parola</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="signup-confirm-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Se încarcă...
                          </div>
                        ) : (
                          <span>Creează cont</span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm text-gray-500">
                  <span>sau continuă cu</span>
                </div>
                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="w-full">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                    </svg>
                    Facebook
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    <Link to="/">Înapoi la pagina principală</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
