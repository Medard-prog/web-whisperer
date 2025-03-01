
import React from "react";
import { Globe, ShoppingCart, Code, Search, Palette, Wrench } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import WorkProcess from "@/components/WorkProcess";
import ProjectsSection from "@/components/ProjectsSection";
import PricingCalculator from "@/components/PricingCalculator";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Services Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Serviciile noastre</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Oferim soluții digitale complete pentru a construi și dezvolta prezența ta online.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                linkTo="/services/websites"
              />
              
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
                linkTo="/services/ecommerce"
              />
              
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
                linkTo="/services/applications"
              />
              
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
                linkTo="/services/seo"
              />
              
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
                linkTo="/services/design"
              />
              
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
                linkTo="/services/custom-development"
              />
            </div>
          </div>
        </section>
        
        {/* How We Work Section */}
        <WorkProcess />
        
        {/* Portfolio Section */}
        <ProjectsSection />
        
        {/* Pricing Calculator Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Estimează costul proiectului tău</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Utilizează calculatorul nostru pentru a obține o estimare rapidă a costului proiectului tău.
              </p>
            </div>
            
            <PricingCalculator />
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Ce spun clienții noștri</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Părerile clienților noștri sunt cea mai bună carte de vizită
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                content="Colaborarea cu această echipă a fost una dintre cele mai bune decizii pentru afacerea noastră. Profesionalism și calitate!"
                author={{
                  name: "Maria Popescu",
                  role: "Director Marketing",
                  company: "TechSolutions Romania",
                  image: "/images/testimonial-1.jpg"
                }}
              />
              
              <TestimonialCard
                content="Am fost impresionat de creativitatea și atenția la detalii. Recomand cu încredere!"
                author={{
                  name: "Ion Gheorghe",
                  role: "Fondator",
                  company: "StartUp Innovation",
                  image: "/images/testimonial-2.jpg"
                }}
              />
              
              <TestimonialCard
                content="Echipa a înțeles perfect nevoile noastre și a livrat un produs excelent. Comunicare eficientă și rezultate pe măsură!"
                author={{
                  name: "Elena Ionescu",
                  role: "Manager Vânzări",
                  company: "Global Trading SRL",
                  image: "/images/testimonial-3.jpg"
                }}
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
