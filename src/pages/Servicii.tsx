
import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesBentoGrid from "@/components/ServicesBentoGrid";
import CtaSection from "@/components/CtaSection";
import { Button } from "@/components/ui/button";

const ServiceItem = ({ title, description, icon, isLast = false }: { title: string; description: string; icon: React.ReactNode; isLast?: boolean }) => {
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
      className={`p-8 ${!isLast ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 md:mb-0 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false 
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[]; 
  isPopular?: boolean;
}) => {
  return (
    <div className={`p-6 rounded-lg border ${isPopular ? 'border-purple-500 shadow-xl' : 'border-gray-200 dark:border-gray-800'}`}>
      {isPopular && (
        <div className="bg-purple-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-4">
          Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Personalizat" && <span className="text-gray-500 dark:text-gray-400">/proiect</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/request">
        <Button className={`w-full ${isPopular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'}`}>
          Solicită o ofertă
        </Button>
      </Link>
    </div>
  );
};

const Servicii = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Servicii | WebStudio - Agenție de Web Development</title>
        <meta name="description" content="Oferim servicii complete de web development, design UI/UX, eCommerce și soluții digitale personalizate pentru afacerea ta." />
        <meta name="keywords" content="servicii web, website, ecommerce, aplicații web, SEO, optimizare website" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Serviciile Noastre
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Oferim soluții digitale complete pentru a-ți transforma ideile în realitate și pentru a-ți dezvolta afacerea online.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/request">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 h-auto text-base">
                    Solicită o ofertă
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:text-purple-400 px-8 py-6 h-auto text-base">
                    Contactează-ne
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Ce oferim
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Soluții digitale complete
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Explorează serviciile noastre și descoperă cum te putem ajuta să îți construiești prezența online.
              </p>
            </div>
            
            <ServicesBentoGrid />
          </div>
        </section>
        
        {/* Detailed Services */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Detalii
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Servicii detaliate
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Fiecare serviciu este personalizat pentru a răspunde nevoilor tale specifice și pentru a te ajuta să îți atingi obiectivele.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden">
              <ServiceItem 
                title="Website-uri de prezentare" 
                description="Creăm website-uri profesionale care reflectă identitatea brandului tău și te ajută să îți crești vizibilitatea online. Designul este modern, responsiv și optimizat pentru toate dispozitivele."
                icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>}
              />
              
              <ServiceItem 
                title="Magazine online (eCommerce)" 
                description="Dezvoltăm platforme eCommerce complete, cu sisteme de plată integrate, gestionare a stocurilor și experiență de utilizare optimizată pentru conversii și vânzări."
                icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>}
              />
              
              <ServiceItem 
                title="Aplicații web personalizate" 
                description="Construim aplicații web complexe, adaptate perfect nevoilor afacerii tale, cu funcționalități avansate și interfețe intuitive pentru utilizatori."
                icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>}
              />
              
              <ServiceItem 
                title="Optimizare SEO" 
                description="Implementăm strategii SEO avansate pentru a-ți crește vizibilitatea în motoarele de căutare, atrăgând mai mult trafic organic și potențiali clienți."
                icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>}
              />
              
              <ServiceItem 
                title="Mentenanță și suport" 
                description="Oferim servicii de mentenanță și suport tehnic continuu pentru a asigura funcționarea optimă a site-ului tău și pentru a implementa îmbunătățiri periodice."
                icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>}
                isLast
              />
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Prețuri
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Pachete transparente
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Oferim pachete transparente și personalizate pentru a răspunde nevoilor tale specifice.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard 
                title="Website Basic" 
                price="500€" 
                description="Ideal pentru afaceri mici sau startup-uri care au nevoie de o prezență online de bază."
                features={[
                  "Design responsive",
                  "Până la 5 pagini",
                  "Integrare social media",
                  "Formular de contact",
                  "Optimizare SEO de bază",
                  "Suport tehnic 30 zile"
                ]}
              />
              
              <PricingCard 
                title="Website Premium" 
                price="1200€" 
                description="Perfect pentru afaceri în creștere care necesită funcționalități avansate."
                features={[
                  "Design personalizat premium",
                  "Până la 10 pagini",
                  "CMS pentru actualizare conținut",
                  "Integrare Google Analytics",
                  "Optimizare SEO avansată",
                  "Suport tehnic 60 zile",
                  "Integrare blog"
                ]}
                isPopular
              />
              
              <PricingCard 
                title="eCommerce & App" 
                price="Personalizat" 
                description="Soluții complexe pentru afaceri care necesită magazine online sau aplicații web."
                features={[
                  "Design complet personalizat",
                  "Funcționalități avansate",
                  "Integrare sistem de plăți",
                  "Gestionare produse/servicii",
                  "Sistem de utilizatori",
                  "Optimizare pentru conversii",
                  "Suport tehnic extins",
                  "Consultanță continuă"
                ]}
              />
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ai nevoie de o soluție personalizată? Contactează-ne pentru o ofertă adaptată nevoilor tale.
              </p>
              <Link to="/calculator-pret">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  Calculează prețul exact
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Servicii;
