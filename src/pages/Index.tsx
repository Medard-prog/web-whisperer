
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WorkProcess from "@/components/WorkProcess";
import ServicesBentoGrid from "@/components/ServicesBentoGrid";
import PortfolioGrid from "@/components/PortfolioGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection"; 
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RequestForm } from "@/components/RequestForm";

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
      <Helmet>
        <title>WebStudio - Agenție de Web Development | Soluții digitale complete</title>
        <meta name="description" content="Transformăm ideile în experiențe digitale excepționale pentru afacerea ta. Servicii de web development, design UI/UX, eCommerce și aplicații web personalizate." />
        <meta name="keywords" content="web development, aplicații web, eCommerce, website, design UI/UX, dezvoltare web, Romania" />
        <meta property="og:title" content="WebStudio - Agenție de Web Development" />
        <meta property="og:description" content="Transformăm ideile în experiențe digitale excepționale pentru afacerea ta." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web-studio.ro" />
        <meta property="og:image" content="/og-image.png" />
        <link rel="canonical" href="https://web-studio.ro" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Services Section */}
        <motion.section 
          ref={servicesRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsServices}
          id="services"
          className="py-24 bg-gray-50 dark:bg-gray-900"
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
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                  Oferim servicii personalizate pentru a construi și dezvolta prezența ta online.
                </p>
              </motion.div>
            </div>
            
            <ServicesBentoGrid />
            
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
          className="py-24 bg-gray-50 dark:bg-gray-900"
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
          className="py-24 bg-white dark:bg-gray-950"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controlsPricing}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                  Solicită o ofertă
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Estimează costul proiectului tău
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                  Completează formularul și vom reveni cu o ofertă personalizată în cel mai scurt timp.
                </p>
              </motion.div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <RequestForm simplified={true} />
            </div>
          </div>
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section 
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={controlsTestimonials}
          id="testimoniale"
          className="py-24 bg-gray-50 dark:bg-gray-900"
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
            
            <TestimonialsSection />
          </div>
        </motion.section>

        {/* Call to Action */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
