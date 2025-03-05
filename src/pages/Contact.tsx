
import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Numele trebuie să conțină cel puțin 2 caractere" }),
  email: z.string().email({ message: "Adresa de email nu este validă" }),
  phone: z.string().min(10, { message: "Numărul de telefon trebuie să conțină cel puțin 10 caractere" }),
  subject: z.string().min(5, { message: "Subiectul trebuie să conțină cel puțin 5 caractere" }),
  message: z.string().min(10, { message: "Mesajul trebuie să conțină cel puțin 10 caractere" }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Here you would normally send the data to your backend
    toast.success("Mesajul a fost trimis cu succes! Vă vom contacta în curând.");
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact | WebStudio - Agenție de Web Development</title>
        <meta name="description" content="Contactează echipa WebStudio pentru proiecte de web development, design UI/UX, eCommerce sau alte servicii digitale. Răspundem prompt la toate solicitările." />
        <meta name="keywords" content="contact, web development, telefon, email, locație, formular contact" />
        <link rel="canonical" href="https://web-studio.ro/contact" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-300"
              >
                Contactează-ne
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-700 dark:text-gray-300 text-lg mb-6"
              >
                Suntem aici pentru a răspunde la toate întrebările tale și pentru a discuta despre potențiale colaborări.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Contact details and form */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact details */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Informații de contact</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                      <a href="mailto:contact@webstudio.ro" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        contact@webstudio.ro
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Telefon</h3>
                      <a href="tel:+40723456789" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        +40 723 456 789
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Adresă</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Str. Exemplu nr. 123, București, România
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                      <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Program de lucru</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Luni - Vineri: 9:00 - 18:00<br />
                        Weekend: Închis
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Locația noastră</h3>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087936!2d26.101361415525247!3d44.43635397910151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zQnVjdXJlyJl0aQ!5e0!3m2!1sro!2sro!4v1651233276424!5m2!1sro!2sro"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="WebStudio Location"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trimite-ne un mesaj</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume</FormLabel>
                            <FormControl>
                              <Input placeholder="Numele dvs." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="adresa@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+40 700 000 000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subiect</FormLabel>
                            <FormControl>
                              <Input placeholder="Subiectul mesajului" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesaj</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detaliile mesajului dvs..." 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Trimite mesajul
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
