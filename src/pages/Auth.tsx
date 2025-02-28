
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthCard from "@/components/auth/AuthCard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";

// Define login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(6, { message: "Parola trebuie să aibă minim 6 caractere" }),
});

// Define register schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Numele trebuie să aibă minim 2 caractere" }),
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(6, { message: "Parola trebuie să aibă minim 6 caractere" }),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the default tab from the URL search params or use 'login'
  const defaultTab = new URLSearchParams(location.search).get("tab") || "login";
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);
  
  // Initialize login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Initialize register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      company: "",
      phone: "",
    },
  });
  
  // Handle login submit
  const onLoginSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    try {
      const result = await signIn(data.email, data.password);
      if (!result?.error) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle register submit
  const onRegisterSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    try {
      const result = await signUp(
        data.email, 
        data.password, 
        data.name,
        data.company,
        data.phone
      );
      
      if (!result?.error) {
        // Redirect to verify email page
        navigate('/verify-email', { state: { email: data.email } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se autentifică...
            </>
          ) : (
            "Autentificare"
          )}
        </Button>
      </form>
    </Form>
  );
  
  const renderRegisterForm = () => (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
        <FormField
          control={registerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="email@example.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={registerForm.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companie (opțional)</FormLabel>
              <FormControl>
                <Input placeholder="Numele companiei" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={registerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon (opțional)</FormLabel>
              <FormControl>
                <Input placeholder="+40 xxx xxx xxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se creează contul...
            </>
          ) : (
            "Înregistrare"
          )}
        </Button>
      </form>
    </Form>
  );
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          <AuthCard
            defaultTab={defaultTab}
            loginForm={renderLoginForm()}
            registerForm={renderRegisterForm()}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
