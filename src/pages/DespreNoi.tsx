
import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, Award, Users, Coffee, Clock, Globe } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CtaSection from "@/components/CtaSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const StatItem = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
};

const TeamMember = ({ 
  name, 
  role, 
  image, 
  description 
}: { 
  name: string; 
  role: string; 
  image: string; 
  description: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{role}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const DespreNoi = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Despre Noi | WebStudio - Agenție de Web Development</title>
        <meta name="description" content="Suntem o echipă pasionată de experți în dezvoltare web, dedicați să transformăm ideile tale în experiențe digitale excepționale." />
        <meta name="keywords" content="despre noi, echipă web development, agenție digitală, web studio, dezvoltare web" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Despre Noi
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Suntem o echipă pasionată de experți în dezvoltare web, dedicați să transformăm ideile tale în experiențe digitale excepționale.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Povestea noastră
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Cum a început totul
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    WebStudio a fost fondată în 2015 de o echipă de dezvoltatori și designeri pasionați, cu viziunea de a crea experiențe digitale excepționale pentru afaceri de toate dimensiunile.
                  </p>
                  <p>
                    De-a lungul anilor, am crescut constant, ne-am îmbunătățit serviciile și ne-am extins echipa, păstrând mereu aceeași pasiune pentru calitate și inovație.
                  </p>
                  <p>
                    Astăzi, suntem mândri să fi ajutat peste 200 de afaceri să își dezvolte prezența online și să își atingă obiectivele prin soluții digitale adaptate nevoilor lor specifice.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/placeholder.svg" 
                    alt="Echipa WebStudio" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-600 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                <StatItem 
                  value="200+" 
                  label="Clienți mulțumiți" 
                  icon={<Users className="h-6 w-6" />}
                />
                <StatItem 
                  value="350+" 
                  label="Proiecte livrate" 
                  icon={<Briefcase className="h-6 w-6" />}
                />
                <StatItem 
                  value="15+" 
                  label="Premii câștigate" 
                  icon={<Award className="h-6 w-6" />}
                />
                <StatItem 
                  value="8+" 
                  label="Ani de experiență" 
                  icon={<Clock className="h-6 w-6" />}
                />
                <StatItem 
                  value="1500+" 
                  label="Cafele băute" 
                  icon={<Coffee className="h-6 w-6" />}
                />
                <StatItem 
                  value="10+" 
                  label="Țări servite" 
                  icon={<Globe className="h-6 w-6" />}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Echipa noastră
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Oamenii din spatele WebStudio
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Cunoaște echipa noastră talentată de specialiști care fac totul posibil.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember 
                name="Adrian Popescu" 
                role="Fondator & Director tehnic" 
                image="/placeholder.svg" 
                description="Cu peste 12 ani de experiență în dezvoltare web, Adrian conduce echipa tehnică și stabilește direcția strategică a companiei."
              />
              
              <TeamMember 
                name="Maria Ionescu" 
                role="Lead UI/UX Designer" 
                image="/placeholder.svg" 
                description="Maria transformă concepte în interfețe intuitive și atractive, cu un ochi atent la detalii și experiența utilizatorului."
              />
              
              <TeamMember 
                name="Andrei Dumitrescu" 
                role="Senior Web Developer" 
                image="/placeholder.svg" 
                description="Specializat în frontend și backend, Andrei construiește arhitecturi robuste și soluții tehnice pentru proiecte complexe."
              />
              
              <TeamMember 
                name="Elena Radu" 
                role="Project Manager" 
                image="/placeholder.svg" 
                description="Cu o atenție remarcabilă la detalii, Elena se asigură că toate proiectele sunt livrate la timp și respectă standardele de calitate."
              />
              
              <TeamMember 
                name="Mihai Popa" 
                role="SEO Specialist" 
                image="/placeholder.svg" 
                description="Expert în optimizarea motoarelor de căutare, Mihai ajută clienții să își crească vizibilitatea online și să atragă mai mult trafic."
              />
              
              <TeamMember 
                name="Laura Stan" 
                role="Client Success Manager" 
                image="/placeholder.svg" 
                description="Laura se asigură că fiecare client primește asistența necesară și că experiența lor cu WebStudio este excepțională."
              />
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Valorile noastre
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Ce ne ghidează
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Valorile și principiile care definesc modul nostru de lucru și relațiile cu clienții.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Calitate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nu facem compromisuri când vine vorba de calitate. Fiecare proiect este livrat la cele mai înalte standarde.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Inovație</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Suntem mereu la curent cu cele mai noi tehnologii și tendințe pentru a oferi soluții moderne și eficiente.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Transparență</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comunicăm deschis și transparent în fiecare etapă a proiectului, fără costuri ascunse sau surprize.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Punctualitate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Respectăm cu strictețe termenele limită și ne asigurăm că proiectele sunt livrate la timp.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Orientare spre client</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Punem nevoile și obiectivele tale pe primul loc, adaptându-ne abordarea pentru a obține cele mai bune rezultate.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Rezultate măsurabile</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ne concentrăm pe obținerea de rezultate concrete și măsurabile care să contribuie la succesul afacerii tale.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Testimoniale
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Ce spun clienții despre noi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Descoperă experiențele clienților noștri și modul în care i-am ajutat să își atingă obiectivele.
              </p>
            </div>
            
            <TestimonialsSection />
          </div>
        </section>
        
        {/* Call to Action */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default DespreNoi;
