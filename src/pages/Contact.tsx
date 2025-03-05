
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const contactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mesaj trimis", {
      description: "Vă vom contacta în cel mai scurt timp posibil."
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 md:pt-32">
          {/* Hero Section */}
          <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                    Contact
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    Discută cu <span className="text-purple-600 dark:text-purple-400">echipa noastră</span>
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Ai întrebări sau ești gata să începi proiectul tău? Contactează-ne și îți vom răspunde în cel mai scurt timp.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Contact Cards Section */}
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <a href="mailto:contact@webcreator.ro" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    contact@webcreator.ro
                  </a>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                  <a href="tel:+40723456789" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    +40 723 456 789
                  </a>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Program</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Luni - Vineri: 9:00 - 18:00
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Contact Form and Map Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Trimite-ne un mesaj</h2>
                    
                    <form onSubmit={contactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nume</Label>
                          <Input 
                            id="name" 
                            placeholder="Numele tău" 
                            required 
                            className="border-gray-300 dark:border-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="email@exemplu.com" 
                            required 
                            className="border-gray-300 dark:border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subiect</Label>
                        <Input 
                          id="subject" 
                          placeholder="Subiectul mesajului" 
                          required 
                          className="border-gray-300 dark:border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Mesaj</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Mesajul tău..." 
                          rows={5} 
                          required 
                          className="border-gray-300 dark:border-gray-700"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto rounded-full flex items-center gap-2"
                      >
                        Trimite mesaj
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Adresa noastră</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Str. Exemplu nr. 123<br />
                          București, România
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow rounded-xl overflow-hidden shadow-sm bg-white">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91158.06235207669!2d26.02329355!3d44.439319300000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucharest%2C%20Romania!5e0!3m2!1sen!2s!4v1695290483173!5m2!1sen!2s" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, minHeight: '300px' }} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Întrebări frecvente</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Răspunsuri la întrebările pe care le primim frecvent.
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Cât durează realizarea unui website?</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Durata depinde de complexitatea proiectului. Un website de prezentare simplu poate fi realizat în 
                      2-3 săptămâni, în timp ce proiectele mai complexe, precum magazinele online sau aplicațiile web, 
                      pot necesita 1-3 luni.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Ce informații trebuie să furnizez pentru a începe un proiect?</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Pentru a începe, avem nevoie de informații despre afacerea ta, obiectivele tale, publicul țintă, 
                      preferințele de design și conținut (texte, imagini). Vom discuta toate acestea în detaliu în 
                      consultarea inițială.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Oferiți servicii de mentenanță după finalizarea proiectului?</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Da, oferim pachete de mentenanță care includ actualizări de securitate, backup-uri regulate, 
                      mici modificări de conținut și suport tehnic. Acestea pot fi personalizate în funcție de nevoile tale.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Care sunt modalitățile de plată acceptate?</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Acceptăm plăți prin transfer bancar și carduri de credit. Pentru proiecte, de obicei lucrăm cu un 
                      avans de 50% la începerea proiectului și restul la finalizare, dar putem discuta și alte modalități.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Pregătit să începi proiectul tău?</h2>
                <p className="text-xl mb-8 text-purple-100">
                  Solicită acum o ofertă gratuită și personalizată pentru proiectul tău.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full"
                    onClick={() => window.location.href = "/request"}
                  >
                    Solicită o ofertă
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
