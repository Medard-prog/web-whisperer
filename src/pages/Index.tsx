
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Globe, ShoppingCart, Code, Search, 
  Palette, Wrench, Clock, Target, 
  Phone, Mail, MapPin
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import WorkProcess from "@/components/WorkProcess";
import PortfolioGrid from "@/components/PortfolioGrid";
import PricingCalculator from "@/components/PricingCalculator";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  // Animation controls for scroll reveal animations
  const controlsServices = useAnimation();
  const controlsProcess = useAnimation();
  const controlsPortfolio = useAnimation();
  const controlsPricing = useAnimation();
  const controlsTestimonials = useAnimation();

  // Refs for detecting when sections come into view
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [portfolioRef, portfolioInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [pricingRef, pricingInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Trigger animations when sections come into view
  useEffect(() => {
    if (servicesInView) controlsServices.start({ opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } });
    if (processInView) controlsProcess.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
    if (portfolioInView) controlsPortfolio.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
    if (pricingInView) controlsPricing.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
    if (testimonialsInView) controlsTestimonials.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
  }, [
    servicesInView, processInView, portfolioInView, pricingInView, testimonialsInView,
    controlsServices, controlsProcess, controlsPortfolio, controlsPricing, controlsTestimonials
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Services Section */}
        <motion.section 
          ref={servicesRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsServices}
          id="services"
          className="py-20 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controlsServices}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Serviciile noastre
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Soluții digitale complete
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  Oferim servicii personalizate pentru a construi și dezvolta prezența ta online, de la website-uri de prezentare până la aplicații complexe.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.3 }}>
                <ServiceCard 
                  title="Website-uri de prezentare" 
                  description="Creăm site-uri de prezentare care reflectă identitatea brandului tău și atrag clienți noi."
                  icon={<Globe className="h-8 w-8" />}
                  benefits={[
                    "Design modern și responsive",
                    "Optimizat pentru motoarele de căutare",
                    "Încărcare rapidă pe toate dispozitivele",
                    "Integrare cu social media"
                  ]}
                  linkTo="/servicii/website-prezentare"
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.4 }}>
                <ServiceCard 
                  title="Magazine online" 
                  description="Dezvoltăm soluții eCommerce personalizate pentru a-ți vinde produsele online."
                  icon={<ShoppingCart className="h-8 w-8" />}
                  benefits={[
                    "Sistem de administrare ușor de utilizat",
                    "Procesare plăți securizată",
                    "Gestionare simplă a stocurilor",
                    "Optimizat pentru conversii"
                  ]}
                  linkTo="/servicii/magazine-online"
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.5 }}>
                <ServiceCard 
                  title="Aplicații web" 
                  description="Creăm aplicații web personalizate care automatizează și optimizează procesele afacerii tale."
                  icon={<Code className="h-8 w-8" />}
                  benefits={[
                    "Soluții personalizate pentru nevoile tale",
                    "Interfață intuitivă și ușor de utilizat",
                    "Scalabile pe măsură ce afacerea crește",
                    "Securitate avansată"
                  ]}
                  linkTo="/servicii/aplicatii-web"
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.6 }}>
                <ServiceCard 
                  title="Optimizare SEO" 
                  description="Îmbunătățim vizibilitatea ta online și atragem mai mulți clienți prin strategii SEO eficiente."
                  icon={<Search className="h-8 w-8" />}
                  benefits={[
                    "Analiză competitivă a pieței",
                    "Optimizare on-page și off-page",
                    "Content marketing strategic",
                    "Rapoarte lunare de performanță"
                  ]}
                  linkTo="/servicii/optimizare-seo"
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.7 }}>
                <ServiceCard 
                  title="Design UX/UI" 
                  description="Creăm experiențe digitale intuitive și atractive care convertesc vizitatori în clienți."
                  icon={<Palette className="h-8 w-8" />}
                  benefits={[
                    "Design centrat pe utilizator",
                    "Interfețe moderne și intuitive",
                    "Optimizat pentru conversii",
                    "Testare și îmbunătățire continuă"
                  ]}
                  linkTo="/servicii/design-ux-ui"
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsServices} transition={{ delay: 0.8 }}>
                <ServiceCard 
                  title="Dezvoltare personalizată" 
                  description="Dezvoltăm soluții web personalizate pentru a rezolva provocările unice ale afacerii tale."
                  icon={<Wrench className="h-8 w-8" />}
                  benefits={[
                    "Analiză detaliată a nevoilor",
                    "Arhitectură scalabilă",
                    "Integrare cu sisteme existente",
                    "Suport tehnic continuu"
                  ]}
                  linkTo="/servicii/dezvoltare-personalizata"
                />
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/servicii">
                <Button 
                  variant="outline" 
                  className="rounded-full border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8"
                >
                  Vezi toate serviciile
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
        
        {/* How We Work Section */}
        <motion.div
          ref={processRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsProcess}
        >
          <WorkProcess />
        </motion.div>
        
        {/* Portfolio Section */}
        <motion.section 
          ref={portfolioRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsPortfolio}
          id="portfolio"
          className="py-20 bg-white dark:bg-gray-950"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controlsPortfolio}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Portofoliu
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Proiecte recente
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  Explorează cele mai recente proiecte realizate pentru clienții noștri.
                </p>
              </motion.div>
            </div>
            
            <PortfolioGrid />
            
            <div className="mt-12 text-center">
              <Link to="/portofoliu">
                <Button 
                  variant="outline" 
                  className="rounded-full border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8"
                >
                  Vezi toate proiectele
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
        
        {/* Pricing Calculator Section */}
        <motion.section 
          ref={pricingRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsPricing}
          id="calculator"
          className="py-20 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controlsPricing}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Calculator de preț
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Estimează costul proiectului tău
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  Utilizează calculatorul nostru pentru a obține o estimare rapidă a costului proiectului tău.
                </p>
              </motion.div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <PricingCalculator />
            </div>
          </div>
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section 
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsTestimonials}
          id="testimoniale"
          className="py-20 bg-white dark:bg-gray-950"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controlsTestimonials}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Testimoniale
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Ce spun clienții noștri
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  Părerile clienților noștri sunt cea mai bună carte de vizită.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsTestimonials} transition={{ delay: 0.3 }}>
                <TestimonialCard
                  content="Colaborarea cu această echipă a fost una dintre cele mai bune decizii pentru afacerea noastră. Profesionalism și calitate!"
                  author={{
                    name: "Maria Popescu",
                    role: "Director Marketing",
                    company: "TechSolutions Romania",
                    image: "/images/testimonial-1.jpg"
                  }}
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsTestimonials} transition={{ delay: 0.4 }}>
                <TestimonialCard
                  content="Am fost impresionat de creativitatea și atenția la detalii. Recomand cu încredere!"
                  author={{
                    name: "Ion Gheorghe",
                    role: "Fondator",
                    company: "StartUp Innovation",
                    image: "/images/testimonial-2.jpg"
                  }}
                />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={controlsTestimonials} transition={{ delay: 0.5 }}>
                <TestimonialCard
                  content="Echipa a înțeles perfect nevoile noastre și a livrat un produs excelent. Comunicare eficientă și rezultate pe măsură!"
                  author={{
                    name: "Elena Ionescu",
                    role: "Manager Vânzări",
                    company: "Global Trading SRL",
                    image: "/images/testimonial-3.jpg"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pregătit să începi proiectul tău?</h2>
              <p className="text-xl mb-8 text-purple-100">Contactează-ne astăzi pentru o discuție despre proiectul tău.</p>
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
  );
};

export default Index;
