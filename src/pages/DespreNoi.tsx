
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Target, Award, Users, Smile, CheckCircle, Clock, Settings, Zap } from "lucide-react";

const DespreNoi = () => {
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const teamMembers = [
    {
      name: "Alexandru Popescu",
      role: "CEO & Founder",
      bio: "Cu peste 10 ani de experiență în dezvoltarea web și antreprenoriat tech.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop"
    },
    {
      name: "Maria Ionescu",
      role: "Lead Designer",
      bio: "Specialistă în UX/UI cu un ochi excelent pentru design și experiențe digitale.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop"
    },
    {
      name: "Andrei Dumitrescu",
      role: "Lead Developer",
      bio: "Expert în soluții tehnice avansate și arhitectură software scalabilă.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
    },
    {
      name: "Elena Radu",
      role: "Project Manager",
      bio: "Coordonează cu succes proiectele și asigură livrarea la timp și în buget.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=500&fit=crop"
    },
  ];

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
                    Despre noi
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    Echipa care <span className="text-purple-600 dark:text-purple-400">transformă ideile</span> în realitate
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Suntem o agenție digitală pasionată, dedicată creării de experiențe web 
                    extraordinare care ajută afacerile să crească și să prospere în lumea digitală.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* About Us Section */}
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Misiunea noastră</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        Am fondat WebCreator în 2018 cu o misiune clară: să ajutăm afacerile să prospere în 
                        era digitală prin soluții web personalizate, inovatoare și de înaltă calitate.
                      </p>
                      <p>
                        Credem că fiecare afacere, indiferent de dimensiune, merită o prezență online care să reflecte 
                        cu adevărat valoarea sa și să o conecteze eficient cu clienții. De aceea, abordăm fiecare proiect 
                        cu aceeași dedicare și atenție la detalii.
                      </p>
                      <p>
                        Ne diferențiem prin capacitatea de a înțelege în profunzime nevoile și obiectivele clienților 
                        noștri, pentru a crea soluții personalizate care aduc rezultate concrete și măsurabile.
                      </p>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Link to="/contact">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                          Contactează-ne
                        </Button>
                      </Link>
                      <Link to="/portofoliu">
                        <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">
                          Vezi proiectele noastre
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800" 
                      alt="Echipa WebCreator" 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 dark:bg-purple-800/30 rounded-full z-0"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-200 dark:bg-indigo-800/30 rounded-full z-0"></div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Stats Section */}
          <section 
            ref={statsRef}
            className="py-16 bg-gray-50 dark:bg-gray-900"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Rezultatele noastre</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Cifrele vorbesc de la sine despre dedicarea și pasiunea noastră.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">100+</div>
                  <div className="text-gray-600 dark:text-gray-400">Proiecte finalizate</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">85+</div>
                  <div className="text-gray-600 dark:text-gray-400">Clienți mulțumiți</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">12</div>
                  <div className="text-gray-600 dark:text-gray-400">Premii câștigate</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smile className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">98%</div>
                  <div className="text-gray-600 dark:text-gray-400">Rata de satisfacție</div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Values Section */}
          <section 
            ref={valuesRef}
            className="py-16 bg-white dark:bg-gray-950"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Valorile noastre</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Principiile care ne ghidează în tot ceea ce facem și care definesc cultura noastră organizațională.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={valuesInView ? "visible" : "hidden"}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Excelență în tot ceea ce facem</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Ne străduim constant să depășim așteptările și să livrăm soluții de cea mai înaltă calitate, 
                        cu o atenție deosebită la fiecare detaliu.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={valuesInView ? "visible" : "hidden"}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Respectarea termenelor</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Înțelegem importanța timpului în business, de aceea ne angajăm să livrăm fiecare 
                        proiect la timp, fără compromisuri în ceea ce privește calitatea.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={valuesInView ? "visible" : "hidden"}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Soluții personalizate</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Credem că fiecare afacere este unică, de aceea dezvoltăm soluții 
                        personalizate care răspund perfect nevoilor și obiectivelor specifice ale clienților noștri.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={valuesInView ? "visible" : "hidden"}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Inovație continuă</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Suntem mereu la curent cu cele mai noi tehnologii și tendințe în domeniul web, 
                        pentru a oferi clienților noștri soluții inovatoare și competitive.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Team Section */}
          <section 
            ref={teamRef}
            className="py-16 bg-gray-50 dark:bg-gray-900"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Echipa noastră</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Oamenii pasionați care fac posibil succesul proiectelor noastre.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate={teamInView ? "visible" : "hidden"}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-2">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Hai să lucrăm împreună</h2>
                <p className="text-xl mb-8 text-purple-100">
                  Ai un proiect în minte? Contactează-ne pentru a discuta despre cum te putem ajuta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/request">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full">
                      Solicită o ofertă
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                      Contactează-ne
                    </Button>
                  </Link>
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

export default DespreNoi;
