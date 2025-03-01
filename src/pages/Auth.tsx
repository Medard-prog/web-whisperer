
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import WavyBackground from "@/components/WavyBackground";

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(6, { message: "Parola trebuie să aibă minim 6 caractere" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Numele trebuie să aibă minim 2 caractere" }),
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(6, { message: "Parola trebuie să aibă minim 6 caractere" }),
  confirmPassword: z.string().min(6, { message: "Confirmarea parolei trebuie să aibă minim 6 caractere" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parolele nu corespund",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const from = location.state?.from?.pathname || "/dashboard";

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Autentificare reușită", {
        description: "Bine ai revenit!",
      });
      
      // The navigation happens in AuthContext after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Autentificare eșuată", {
        description: error.message || "Verifică email-ul și parola",
      });
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      const { error } = await signUp(values.email, values.password, {
        name: values.name,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Înregistrare reușită", {
        description: "Un email de confirmare a fost trimis.",
      });
      
      navigate("/verify-email", { state: { email: values.email } });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Înregistrare eșuată", {
        description: error.message || "Încearcă din nou",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <WavyBackground className="absolute inset-0 z-0" />
      
      <div className="container relative z-10 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader className="space-y-1 text-center">
              <Link to="/" className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-10 w-10 rounded-md flex items-center justify-center">
                  <span className="font-bold text-xl">W</span>
                </div>
              </Link>
              <CardTitle className="text-2xl font-bold">WebWhisperer</CardTitle>
              <CardDescription>
                Autentifică-te sau creează un cont nou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Autentificare</TabsTrigger>
                  <TabsTrigger value="register">Înregistrare</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="exemplu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parolă</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Se procesează...
                          </>
                        ) : (
                          "Autentificare"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume complet</FormLabel>
                            <FormControl>
                              <Input placeholder="Nume Prenume" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="exemplu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parolă</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmă parola</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Se procesează...
                          </>
                        ) : (
                          "Înregistrare"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-500">
                {activeTab === "login" ? (
                  <>
                    Nu ai un cont?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                      Înregistrează-te
                    </Button>
                  </>
                ) : (
                  <>
                    Ai deja un cont?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                      Autentifică-te
                    </Button>
                  </>
                )}
              </div>
              <div className="text-xs text-center text-gray-500">
                Prin continuare, ești de acord cu{" "}
                <Link to="/terms" className="underline underline-offset-2">
                  Termenii și Condițiile
                </Link>{" "}
                și{" "}
                <Link to="/privacy" className="underline underline-offset-2">
                  Politica de Confidențialitate
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
