import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, LogIn } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Adresa de email trebuie să fie validă.",
  }),
  password: z.string().min(8, {
    message: "Parola trebuie să aibă cel puțin 8 caractere.",
  }),
});

const registerFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Numele trebuie să aibă cel puțin 2 caractere.",
    }),
    email: z.string().email({
      message: "Adresa de email trebuie să fie validă.",
    }),
    password: z.string().min(8, {
      message: "Parola trebuie să aibă cel puțin 8 caractere.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ["confirmPassword"],
  });

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error("Eroare la autentificare", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRegister = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, values.name);
      setMode("login");
      toast.success("Cont creat cu succes", {
        description: "Verifică-ți emailul pentru a confirma contul."
      });
    } catch (error: any) {
      toast.error("Eroare la înregistrare", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("type", "reset-password");
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const isResetPassword = location.search.includes("type=reset-password");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {mode === "login" ? "Autentificare" : "Înregistrare"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 text-center">
              {mode === "login"
                ? "Autentifică-te pentru a accesa contul tău"
                : "Creează un cont nou"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {mode === "login" ? (
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm">Email</Label>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="adresa@email.com"
                              type="email"
                              className="pl-9"
                              {...field}
                            />
                          </div>
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
                        <Label className="text-sm">Parola</Label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Parola"
                              type="password"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Se autentifică..." : "Autentificare"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onSubmitRegister)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm">Nume</Label>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Numele tău"
                              type="text"
                              className="pl-9"
                              {...field}
                            />
                          </div>
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
                        <Label className="text-sm">Email</Label>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="adresa@email.com"
                              type="email"
                              className="pl-9"
                              {...field}
                            />
                          </div>
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
                        <Label className="text-sm">Parola</Label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Parola"
                              type="password"
                              className="pl-9"
                              {...field}
                            />
                          </div>
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
                        <Label className="text-sm">Confirmă parola</Label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Confirmă parola"
                              type="password"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Se înregistrează..." : "Înregistrare"}
                  </Button>
                </form>
              </Form>
            )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Sau
                </span>
              </div>
            </div>
            <Button variant="outline" disabled>
              <LogIn className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>
          <div className="p-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Nu ai un cont?{" "}
                <Link
                  to="/auth?mode=register"
                  className="font-semibold text-purple-600 hover:underline"
                  onClick={() => setMode("register")}
                >
                  Înregistrează-te
                </Link>
              </>
            ) : (
              <>
                Ai deja un cont?{" "}
                <Link
                  to="/auth?mode=login"
                  className="font-semibold text-purple-600 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Autentifică-te
                </Link>
              </>
            )}
          </div>
        </Card>
        {isResetPassword && (
          <div className="text-center">
            <Button variant="link" size="sm" onClick={resetPassword}>
              Resetează parola
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
