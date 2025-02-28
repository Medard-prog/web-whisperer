
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import PricingCalculator from "@/components/PricingCalculator";
import { 
  Globe, 
  ShoppingCart, 
  Smartphone, 
  Search, 
  Layers, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown, 
  Eye
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: "Website-uri de prezentare",
      description: "Creăm site-uri de prezentare care reflectă identitatea brandului tău și atrag clienți noi.",
      icon: Globe,
      benefits: [
        "Design modern și responsive",
        "Optimizat pentru motoarele de căutare",
        "Încărcare rapidă pe toate dispozitivele",
        "Integrare cu social media"
      ],
      linkTo: "/servicii/website-prezentare"
    },
    {
      title: "Magazine online",
      description: "Dezvoltăm soluții eCommerce personalizate pentru a-ți vinde produsele online.",
      icon: ShoppingCart,
      benefits: [
        "Sistem de administrare ușor de utilizat",
        "Procesare plăți securizată",
        "Gestionare simplă a stocurilor",
        "Optimizat pentru conversii"
      ],
      linkTo: "/servicii/magazin-online"
    },
    {
      title: "Aplicații web",
      description: "Creăm aplicații web personalizate care automatizează și optimizează procesele afacerii tale.",
      icon: Layers,
      benefits: [
        "Soluții personalizate pentru nevoile tale",
        "Interfață intuitivă și ușor de utilizat",
        "Scalabile pe măsură ce afacerea crește",
        "Securitate avansată"
      ],
      linkTo: "/servicii/aplicatii-web"
    },
    {
      title: "Optimizare SEO",
      description: "Îmbunătățim vizibilitatea ta online și atragem mai mulți clienți prin strategii SEO eficiente.",
      icon: Search,
      benefits: [
        "Analiză competitivă a pieței",
        "Optimizare on-page și off-page",
        "Content marketing strategic",
        "Rapoarte lunare de performanță"
      ],
      linkTo: "/servicii/optimizare-seo"
    },
    {
      title: "Design UX/UI",
      description: "Creăm experiențe digitale intuitive și atractive care convertesc vizitatorii în clienți.",
      icon: Eye,
      benefits: [
        "Design centrat pe utilizator",
        "Interfețe moderne și intuitive",
        "Optimizat pentru conversii",
        "Testare și îmbunătățire continuă"
      ],
      linkTo: "/servicii/design-ux-ui"
    },
    {
      title: "Dezvoltare personalizată",
      description: "Dezvoltăm soluții web personalizate pentru a rezolva provocările unice ale afacerii tale.",
      icon: Code,
      benefits: [
        "Analiză detaliată a nevoilor",
        "Arhitectură scalabilă",
        "Integrare cu sisteme existente",
        "Suport tehnic continuu"
      ],
      linkTo: "/servicii/dezvoltare-personalizata"
    }
  ];

  const testimonials = [
    {
      content: "Echipa WebCreator a livrat un site web care a depășit toate așteptările noastre. Procesul a fost simplu, transparent și profesionist de la început până la sfârșit.",
      author: {
        name: "Elena Popescu",
        role: "Director Marketing",
        company: "TechRo Solutions"
      }
    },
    {
      content: "După lansarea noului nostru magazin online creat de WebCreator, vânzările au crescut cu 45% în prima lună. Designul intuitiv și experiența de cumpărare fluidă au făcut toată diferența.",
      author: {
        name: "Andrei Ionescu",
        role: "Proprietar",
        company: "ElectroShop"
      }
    },
    {
      content: "Am apreciat foarte mult abordarea consultativă și atenția la detalii. Nu doar că au construit site-ul, ci ne-au și sfătuit strategic pentru a obține rezultate optime.",
      author: {
        name: "Cristina Dumitrescu",
        role: "CEO",
        company: "Artisan Bakery"
      }
    }
  ];

  const portfolioItems = [
    {
      id: 1,
      title: "TechRo Solutions",
      description: "Website corporativ cu design modern și funcționalități avansate.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=TechRo+Solutions",
      category: "corporate"
    },
    {
      id: 2,
      title: "ElectroShop",
      description: "Magazin online cu peste 1000 de produse și sistem de plată integrat.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=ElectroShop",
      category: "ecommerce"
    },
    {
      id: 3,
      title: "Artisan Bakery",
      description: "Site de prezentare pentru o brutărie artizanală cu sistem de comenzi online.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=Artisan+Bakery",
      category: "presentation"
    },
    {
      id: 4,
      title: "FitLife Gym",
      description: "Aplicație web pentru gestionarea membrilor și programărilor la sală.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=FitLife+Gym",
      category: "application"
    },
    {
      id: 5,
      title: "Travel Explorer",
      description: "Portal turistic cu funcționalități de rezervare și recenzii.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=Travel+Explorer",
      category: "ecommerce"
    },
    {
      id: 6,
      title: "Studio Design",
      description: "Portofoliu digital pentru un studio de design interior.",
      image: "https://placehold.co/600x400/9b87f5/ffffff?text=Studio+Design",
      category: "presentation"
    }
  ];

  const filteredPortfolio = activeTab === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeTab);

  const faqItems = [
    {
      question: "Cât durează dezvoltarea unui website?",
      answer: "Durata depinde de complexitatea proiectului. Un site de prezentare simplu poate fi gata în 2-3 săptămâni, în timp ce un magazin online complex poate necesita 1-2 luni. Vom stabili împreună un calendar realist la începutul proiectului."
    },
    {
      question: "Ce informații trebuie să furnizez pentru a începe proiectul?",
      answer: "Pentru a începe, avem nevoie de: detalii despre afacerea ta, publicul țintă, obiectivele site-ului, preferințele de design, conținut (texte, imagini), și orice alte cerințe specifice. Vom discuta toate acestea în detaliu în etapa de consultare."
    },
    {
      question: "Oferiți servicii de întreținere după lansare?",
      answer: "Da, oferim pachete de întreținere care includ actualizări de securitate, backup-uri regulate, monitorizare a performanței, și actualizări de conținut la cerere. Acest lucru asigură că website-ul tău funcționează optim în permanență."
    },
    {
      question: "Site-urile sunt optimizate pentru dispozitive mobile?",
      answer: "Absolut! Toate proiectele noastre sunt create cu o abordare 'mobile-first', asigurând o experiență excelentă pe toate dispozitivele: telefoane, tablete și desktop-uri. Testăm riguros compatibilitatea pe multiple dispozitive și browsere."
    },
    {
      question: "Care sunt modalitățile de plată?",
      answer: "Acceptăm plăți prin transfer bancar și plăți online. De obicei, structurăm plățile în 3 tranșe: un avans la începutul proiectului, o plată intermediară după aprobarea designului, și plata finală la livrarea proiectului."
    }
  ];

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-8 mb-10 lg:mb-0">
              <div className="space-y-6 max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 animate-fade-in" style={{animationDelay: "0.1s"}}>
                  Transformăm <span className="text-brand-600">ideile</span> în experiențe digitale excepționale
                </h1>
                <p className="text-xl text-gray-600 animate-fade-in" style={{animationDelay: "0.3s"}}>
                  Echipa noastră de experți creează website-uri și aplicații web personalizate care aduc rezultate reale pentru afacerea ta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: "0.5s"}}>
                  <Link to="/request-project">
                    <Button size="lg" className="w-full sm:w-auto">
                      Solicită o ofertă gratuită
                    </Button>
                  </Link>
                  <Link to="/#servicii">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Descoperă serviciile noastre
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-gray-500 animate-fade-in" style={{animationDelay: "0.7s"}}>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-brand-500 mr-2" />
                    <span>Design modern</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-brand-500 mr-2" />
                    <span>100% responsive</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-brand-500 mr-2" />
                    <span>Optimizat SEO</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative animate-fade-in-right" style={{animationDelay: "0.5s"}}>
              <div className="relative z-10 float-animation">
                <img 
                  src="https://placehold.co/600x400/9b87f5/ffffff?text=Web+Development" 
                  alt="Web Development" 
                  className="rounded-2xl shadow-xl"
                />
              </div>
              <div className="absolute top-0 right-0 -mt-8 -mr-8 z-0 w-full h-full rounded-2xl bg-brand-100"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicii" className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Serviciile noastre</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferim soluții digitale complete pentru a construi și dezvolta prezența ta online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                benefits={service.benefits}
                linkTo={service.linkTo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cum lucrăm</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un proces simplu și eficient pentru rezultate excepționale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-2">Consultare</h3>
              <p className="text-gray-600">Discutăm despre obiectivele tale și definim cerințele proiectului.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-2">Design</h3>
              <p className="text-gray-600">Creăm wireframe-uri și design-uri care reflectă identitatea brandului tău.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-2">Dezvoltare</h3>
              <p className="text-gray-600">Implementăm funcționalitățile și construim experiența digitală.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">4</div>
              <h3 className="text-xl font-bold mb-2">Lansare</h3>
              <p className="text-gray-600">Lansăm proiectul și oferim asistență continuă pentru a asigura succesul.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portofoliu" className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portofoliu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorează o selecție din proiectele noastre recente.
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="all">Toate</TabsTrigger>
                <TabsTrigger value="ecommerce">Magazine online</TabsTrigger>
                <TabsTrigger value="corporate">Corporate</TabsTrigger>
                <TabsTrigger value="presentation">Prezentare</TabsTrigger>
                <TabsTrigger value="application">Aplicații</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPortfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover-card-effect">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <Link to={`/portfolio/${item.id}`} className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
                        Vezi proiectul <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="outline">
                Vezi toate proiectele
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce spun clienții noștri</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descoperă experiențele reale ale clienților cu care am colaborat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                content={testimonial.content}
                author={testimonial.author}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="preturi" className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Estimează costul proiectului tău</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Utilizează calculatorul nostru pentru a obține o estimare rapidă a costului proiectului tău.
            </p>
          </div>
          
          <PricingCalculator />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Întrebări frecvente</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Răspunsuri la cele mai comune întrebări despre serviciile noastre.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium">{item.question}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Gata să transformi viziunea ta în realitate?</h2>
              <p className="text-xl text-white/80 max-w-2xl">
                Solicită acum o ofertă personalizată și descoperă cum putem să te ajutăm să-ți construiești prezența online.
              </p>
            </div>
            <div>
              <Link to="/request-project">
                <Button size="lg" variant="secondary" className="font-medium">
                  Solicită o ofertă gratuită
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
