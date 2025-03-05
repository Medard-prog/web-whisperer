
import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, ShoppingCart, Code, Search, Palette, Wrench,
  BarChart, Shield, Users, Smartphone, Database, Gauge
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Servicii = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
                <motion.div {...fadeIn}>
                  <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                    Servicii
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    Servicii complete de <span className="text-purple-600 dark:text-purple-400">web development</span>
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Oferim soluții digitale personalizate pentru a răspunde nevoilor afacerii tale, 
                    de la website-uri de prezentare și magazine online, până la aplicații web complexe.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Main Services Section */}
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Serviciile noastre principale</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Aceste servicii reprezintă expertiza noastră de bază și sunt cele mai solicitate de clienții noștri.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ServiceCard 
                  title="Website-uri de prezentare" 
                  description="Creăm site-uri de prezentare profesionale care reflectă identitatea brandului tău și atrag clienți noi."
                  icon={<Globe className="h-8 w-8" />}
                  benefits={[
                    "Design modern și responsive",
                    "Optimizat pentru motoarele de căutare",
                    "Încărcare rapidă pe toate dispozitivele",
                    "Integrare cu social media",
                    "Panou de administrare ușor de utilizat"
                  ]}
                  linkTo="/servicii/website-prezentare"
                />
                
                <ServiceCard 
                  title="Magazine online" 
                  description="Dezvoltăm soluții eCommerce personalizate care îți permit să vinzi produse și servicii online."
                  icon={<ShoppingCart className="h-8 w-8" />}
                  benefits={[
                    "Sistem de administrare ușor de utilizat",
                    "Procesare plăți securizată",
                    "Gestionare simplă a stocurilor",
                    "Optimizat pentru conversii",
                    "Integrare cu sisteme de livrare"
                  ]}
                  linkTo="/servicii/magazine-online"
                />
                
                <ServiceCard 
                  title="Aplicații web" 
                  description="Creăm aplicații web personalizate care automatizează și optimizează procesele afacerii tale."
                  icon={<Code className="h-8 w-8" />}
                  benefits={[
                    "Soluții personalizate pentru nevoile tale",
                    "Interfață intuitivă și ușor de utilizat",
                    "Scalabile pe măsură ce afacerea crește",
                    "Securitate avansată",
                    "Suport tehnic continuu"
                  ]}
                  linkTo="/servicii/aplicatii-web"
                />
                
                <ServiceCard 
                  title="Optimizare SEO" 
                  description="Îmbunătățim vizibilitatea ta online și atragem mai mulți clienți prin strategii SEO eficiente."
                  icon={<Search className="h-8 w-8" />}
                  benefits={[
                    "Analiză competitivă a pieței",
                    "Optimizare on-page și off-page",
                    "Content marketing strategic",
                    "Rapoarte lunare de performanță",
                    "Monitorizare continuă a pozițiilor"
                  ]}
                  linkTo="/servicii/optimizare-seo"
                />
                
                <ServiceCard 
                  title="Design UX/UI" 
                  description="Creăm experiențe digitale intuitive și atractive care convertesc vizitatori în clienți."
                  icon={<Palette className="h-8 w-8" />}
                  benefits={[
                    "Design centrat pe utilizator",
                    "Interfețe moderne și intuitive",
                    "Optimizat pentru conversii",
                    "Testare și îmbunătățire continuă",
                    "Adaptare la toate tipurile de dispozitive"
                  ]}
                  linkTo="/servicii/design-ux-ui"
                />
                
                <ServiceCard 
                  title="Dezvoltare personalizată" 
                  description="Dezvoltăm soluții web personalizate pentru a rezolva provocările unice ale afacerii tale."
                  icon={<Wrench className="h-8 w-8" />}
                  benefits={[
                    "Analiză detaliată a nevoilor",
                    "Arhitectură scalabilă",
                    "Integrare cu sisteme existente",
                    "Suport tehnic continuu",
                    "Documentație completă"
                  ]}
                  linkTo="/servicii/dezvoltare-personalizata"
                />
              </div>
            </div>
          </section>
          
          {/* Additional Services Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Servicii adiționale</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Pe lângă serviciile principale, oferim și o gamă de servicii complementare pentru a asigura succesul proiectului tău.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ServiceCard 
                  title="Analiză și raportare" 
                  description="Monitorizăm traficul și comportamentul utilizatorilor pentru a optimiza continuu performanța site-ului tău."
                  icon={<BarChart className="h-8 w-8" />}
                  benefits={[
                    "Implementare Google Analytics",
                    "Rapoarte periodice personalizate",
                    "Analiză a comportamentului utilizatorilor",
                    "Optimizare continuă a conversiilor"
                  ]}
                  linkTo="/servicii/analiza-raportare"
                />
                
                <ServiceCard 
                  title="Securitate web" 
                  description="Protejăm site-ul tău împotriva amenințărilor cibernetice prin soluții avansate de securitate."
                  icon={<Shield className="h-8 w-8" />}
                  benefits={[
                    "Audit de securitate",
                    "Implementare SSL",
                    "Protecție împotriva atacurilor DDoS",
                    "Backup regulat al datelor"
                  ]}
                  linkTo="/servicii/securitate-web"
                />
                
                <ServiceCard 
                  title="Social media marketing" 
                  description="Creăm și implementăm strategii de social media pentru a crește vizibilitatea brandului tău."
                  icon={<Users className="h-8 w-8" />}
                  benefits={[
                    "Strategie personalizată",
                    "Creare și programare conținut",
                    "Monitorizare și raportare",
                    "Campanii publicitare targetate"
                  ]}
                  linkTo="/servicii/social-media"
                />
                
                <ServiceCard 
                  title="Aplicații mobile" 
                  description="Dezvoltăm aplicații mobile native și hibride pentru iOS și Android."
                  icon={<Smartphone className="h-8 w-8" />}
                  benefits={[
                    "Design intuitiv și atractiv",
                    "Funcționalități personalizate",
                    "Integrare cu sisteme existente",
                    "Publicare în App Store și Google Play"
                  ]}
                  linkTo="/servicii/aplicatii-mobile"
                />
                
                <ServiceCard 
                  title="Hosting și mentenanță" 
                  description="Oferim servicii complete de hosting și mentenanță pentru a asigura funcționarea optimă a site-ului tău."
                  icon={<Database className="h-8 w-8" />}
                  benefits={[
                    "Hosting performant și securizat",
                    "Monitorizare 24/7",
                    "Actualizări de securitate",
                    "Suport tehnic dedicat"
                  ]}
                  linkTo="/servicii/hosting-mentenanta"
                />
                
                <ServiceCard 
                  title="Optimizare performanță" 
                  description="Îmbunătățim viteza de încărcare și performanța generală a site-ului tău."
                  icon={<Gauge className="h-8 w-8" />}
                  benefits={[
                    "Audit de performanță",
                    "Optimizare imagini și resurse",
                    "Implementare caching",
                    "Optimizare baze de date"
                  ]}
                  linkTo="/servicii/optimizare-performanta"
                />
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ai nevoie de servicii personalizate?</h2>
                <p className="text-xl mb-8 text-purple-100">
                  Contactează-ne astăzi pentru o consultare gratuită și află cum te putem ajuta să-ți atingi obiectivele.
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

export default Servicii;
