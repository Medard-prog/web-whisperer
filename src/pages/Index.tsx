
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Code,
  PanelTop,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import WavyBackground from "@/components/WavyBackground";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import BentoBox from "@/components/BentoBox";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const services = [
  {
    title: "Dezvoltare Website",
    description:
      "Îți construim un website modern, responsive și optimizat pentru performanță.",
    icon: PanelTop,
    benefits: ["Design responsive", "SEO optimizat", "Încărcare rapidă"],
    linkTo: "/request-project",
  },
  {
    title: "E-commerce",
    description:
      "Creăm magazine online complete cu cos de cumpărături, plăți, și gestionare de produse.",
    icon: ShoppingBag,
    benefits: ["Coș de cumpărături", "Procesare plăți", "Gestionare produse"],
    linkTo: "/request-project",
  },
  {
    title: "Aplicații Web",
    description:
      "Dezvoltăm aplicații web personalizate cu funcționalități avansate pentru afacerea ta.",
    icon: Code,
    benefits: ["Funcționalități custom", "Integrări API", "Scalabilitate"],
    linkTo: "/request-project",
  },
];

const testimonials = [
  {
    author: "Elena Popescu",
    role: "Director",
    company: "Alinda Fashion",
    content:
      "Serviciu excelent! Echipa a înțeles perfect cerințele noastre și a livrat un website care a depășit așteptările. Profesionalism și atenție la detalii.",
    avatar: "/placeholder.svg",
  },
  {
    author: "Mihai Dumitrescu",
    role: "CEO",
    company: "TehnoMax",
    content:
      "Am colaborat pentru magazinul nostru online și suntem foarte mulțumiți de rezultat. De la design până la funcționalități, totul a fost implementat impecabil.",
    avatar: "/placeholder.svg",
  },
  {
    author: "Ana Ionescu",
    role: "Fondator",
    company: "Green Gardens",
    content:
      "Un partener de încredere pentru dezvoltarea prezenței noastre online. Recomand cu căldură pentru orice afacere care dorește să aibă un website de calitate.",
    avatar: "/placeholder.svg",
  },
];

const bentoItems = {
  items: [
    {
      title: "Website corporate",
      description: "Un website elegant pentru o firmă de consultanță",
      image: "/placeholder.svg",
      link: "/projects/1",
    },
    {
      title: "E-commerce fashion",
      description: "Magazin online pentru un brand de haine",
      image: "/placeholder.svg",
      link: "/projects/2",
    },
    {
      title: "Aplicație gestiune stocuri",
      description: "Sistem de gestiune pentru un distribuitor",
      image: "/placeholder.svg",
      link: "/projects/3",
    },
    {
      title: "Portal educațional",
      description: "Platformă de cursuri online",
      image: "/placeholder.svg",
      link: "/projects/4",
    },
    {
      title: "Website restaurant",
      description: "Site cu rezervări online pentru un restaurant",
      image: "/placeholder.svg",
      link: "/projects/5",
    },
  ],
};

// Redesigned PricingCalculator component
const PricingCalculator = ({ onRequestProject }: { onRequestProject: (data: any) => void }) => {
  const [websiteType, setWebsiteType] = useState("business");
  const [designComplexity, setDesignComplexity] = useState("standard");
  const [pageCount, setPageCount] = useState(5);
  const [features, setFeatures] = useState({
    cms: false,
    ecommerce: false,
    seo: false,
    maintenance: false,
  });

  // Calculate price based on selections
  const calculatePrice = () => {
    let basePrice = 0;
    
    // Base price by website type
    switch (websiteType) {
      case "business":
        basePrice = 1200;
        break;
      case "ecommerce":
        basePrice = 2500;
        break;
      case "blog":
        basePrice = 1000;
        break;
      case "portfolio":
        basePrice = 900;
        break;
      case "custom":
        basePrice = 3000;
        break;
      default:
        basePrice = 1200;
    }
    
    // Adjust for design complexity
    switch (designComplexity) {
      case "simple":
        basePrice *= 0.8;
        break;
      case "premium":
        basePrice *= 1.5;
        break;
      default:
        // standard price, no adjustment
        break;
    }
    
    // Adjust for page count
    basePrice += (pageCount - 5) * 100; // €100 per additional page above 5 (or -€100 for fewer)
    
    // Add features
    if (features.cms) basePrice += 500;
    if (features.ecommerce) basePrice += 1000;
    if (features.seo) basePrice += 300;
    if (features.maintenance) basePrice += 500;

    // Ensure minimum price
    return Math.max(500, Math.round(basePrice));
  };

  const price = calculatePrice();
  
  const handleRequestProject = () => {
    onRequestProject({
      websiteType,
      designComplexity,
      pageCount,
      hasCMS: features.cms,
      hasEcommerce: features.ecommerce,
      hasSEO: features.seo,
      hasMaintenance: features.maintenance,
    });
  };

  // Website type descriptions with examples
  const websiteTypeDescriptions = {
    business: "Website de prezentare pentru compania ta, cu informații despre servicii și formular de contact.",
    ecommerce: "Magazin online complet cu produse, coș de cumpărături și procesare plăți.",
    blog: "Blog sau site de știri pentru conținut regulat și articole.",
    portfolio: "Website pentru prezentarea proiectelor și lucrărilor tale.",
    custom: "Aplicație web personalizată cu funcționalități specifice nevoilor tale."
  };

  // Examples for each website type
  const websiteTypeExamples = {
    business: "Exemple: site-uri corporate, website-uri pentru restaurante, cabinete medicale",
    ecommerce: "Exemple: magazine de modă, produse digitale, servicii cu abonament",
    blog: "Exemple: blog personal, site de știri, revistă online",
    portfolio: "Exemple: portofoliu de fotografie, arhitectură, design",
    custom: "Exemple: platforme educaționale, aplicații de rezervări, dashboard-uri"
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2">Calculator de preț</h3>
            <p className="text-gray-600 dark:text-gray-300">Estimează costul proiectului tău în câțiva pași simpli</p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-purple-700 dark:text-purple-300 font-medium">Tipul website-ului</Label>
              <RadioGroup 
                value={websiteType} 
                onValueChange={setWebsiteType}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${websiteType === "business" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setWebsiteType("business")}>
                  <RadioGroupItem value="business" id="business" className="sr-only" />
                  <div className="flex items-start gap-3">
                    <PanelTop className={`h-5 w-5 mt-0.5 ${websiteType === "business" ? "text-purple-600 dark:text-purple-400" : "text-gray-500"}`} />
                    <div>
                      <Label htmlFor="business" className={`font-medium ${websiteType === "business" ? "text-purple-700 dark:text-purple-300" : ""}`}>Website de prezentare</Label>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${websiteType === "ecommerce" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setWebsiteType("ecommerce")}>
                  <RadioGroupItem value="ecommerce" id="ecommerce" className="sr-only" />
                  <div className="flex items-start gap-3">
                    <ShoppingBag className={`h-5 w-5 mt-0.5 ${websiteType === "ecommerce" ? "text-purple-600 dark:text-purple-400" : "text-gray-500"}`} />
                    <div>
                      <Label htmlFor="ecommerce" className={`font-medium ${websiteType === "ecommerce" ? "text-purple-700 dark:text-purple-300" : ""}`}>Magazin online</Label>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${websiteType === "blog" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setWebsiteType("blog")}>
                  <RadioGroupItem value="blog" id="blog" className="sr-only" />
                  <div className="flex items-start gap-3">
                    <Code className={`h-5 w-5 mt-0.5 ${websiteType === "blog" ? "text-purple-600 dark:text-purple-400" : "text-gray-500"}`} />
                    <div>
                      <Label htmlFor="blog" className={`font-medium ${websiteType === "blog" ? "text-purple-700 dark:text-purple-300" : ""}`}>Blog / Știri</Label>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${websiteType === "portfolio" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setWebsiteType("portfolio")}>
                  <RadioGroupItem value="portfolio" id="portfolio" className="sr-only" />
                  <div className="flex items-start gap-3">
                    <Code className={`h-5 w-5 mt-0.5 ${websiteType === "portfolio" ? "text-purple-600 dark:text-purple-400" : "text-gray-500"}`} />
                    <div>
                      <Label htmlFor="portfolio" className={`font-medium ${websiteType === "portfolio" ? "text-purple-700 dark:text-purple-300" : ""}`}>Portofoliu</Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {websiteTypeDescriptions[websiteType as keyof typeof websiteTypeDescriptions]}
              </p>
              <p className="text-xs text-gray-500/80 dark:text-gray-400/80 italic">
                {websiteTypeExamples[websiteType as keyof typeof websiteTypeExamples]}
              </p>
            </div>
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-3">
              <Label className="text-purple-700 dark:text-purple-300 font-medium">Complexitatea designului</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className={`border rounded-md p-3 cursor-pointer text-center transition-all ${designComplexity === "simple" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setDesignComplexity("simple")}>
                  <RadioGroupItem value="simple" id="simple" className="sr-only" />
                  <Label htmlFor="simple" className={`font-medium block mb-1 ${designComplexity === "simple" ? "text-purple-700 dark:text-purple-300" : ""}`}>Simplu</Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Design basic, funcționalități esențiale</span>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer text-center transition-all ${designComplexity === "standard" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setDesignComplexity("standard")}>
                  <RadioGroupItem value="standard" id="standard" className="sr-only" />
                  <Label htmlFor="standard" className={`font-medium block mb-1 ${designComplexity === "standard" ? "text-purple-700 dark:text-purple-300" : ""}`}>Standard</Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Design modern, funcționalități extinse</span>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer text-center transition-all ${designComplexity === "premium" ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setDesignComplexity("premium")}>
                  <RadioGroupItem value="premium" id="premium" className="sr-only" />
                  <Label htmlFor="premium" className={`font-medium block mb-1 ${designComplexity === "premium" ? "text-purple-700 dark:text-purple-300" : ""}`}>Premium</Label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Design personalizat, animații, interactivitate</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-purple-700 dark:text-purple-300 font-medium">Număr de pagini: <span className="text-purple-600 font-semibold">{pageCount}</span></Label>
                <Badge variant="outline" className="font-normal border-purple-200 dark:border-purple-700">
                  +€100/pagină
                </Badge>
              </div>
              <Slider 
                value={[pageCount]} 
                onValueChange={([value]) => setPageCount(value)} 
                min={1} 
                max={20} 
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 pagină</span>
                <span>20 pagini</span>
              </div>
            </div>
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-3">
              <Label className="text-purple-700 dark:text-purple-300 font-medium">Funcționalități suplimentare</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${features.cms ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setFeatures({...features, cms: !features.cms})}>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={features.cms}
                      onCheckedChange={(checked) => setFeatures({...features, cms: !!checked})}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <div>
                      <p className={`font-medium ${features.cms ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        Sistem de administrare (CMS)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Editează conținutul fără cunoștințe tehnice
                      </p>
                      <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">+€500</Badge>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${features.ecommerce ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setFeatures({...features, ecommerce: !features.ecommerce})}>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={features.ecommerce}
                      onCheckedChange={(checked) => setFeatures({...features, ecommerce: !!checked})}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <div>
                      <p className={`font-medium ${features.ecommerce ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        Funcționalități E-commerce
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Coș de cumpărături, plăți online
                      </p>
                      <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">+€1,000</Badge>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${features.seo ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setFeatures({...features, seo: !features.seo})}>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={features.seo}
                      onCheckedChange={(checked) => setFeatures({...features, seo: !!checked})}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <div>
                      <p className={`font-medium ${features.seo ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        Optimizare SEO
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Optimizare pentru motoarele de căutare
                      </p>
                      <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">+€300</Badge>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer transition-all ${features.maintenance ? "border-purple-400 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => setFeatures({...features, maintenance: !features.maintenance})}>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={features.maintenance}
                      onCheckedChange={(checked) => setFeatures({...features, maintenance: !!checked})}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <div>
                      <p className={`font-medium ${features.maintenance ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        Plan de mentenanță
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Update-uri, backup-uri și suport tehnic
                      </p>
                      <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">+€500</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 md:p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Estimare de preț</h3>
            <p className="opacity-80">Bazată pe selecțiile tale</p>
          </div>
          
          <div className="grow space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Tipul website-ului</span>
                <span className="font-medium capitalize">{
                  websiteType === "business" ? "Website de prezentare" :
                  websiteType === "ecommerce" ? "Magazin online" :
                  websiteType === "blog" ? "Blog / Știri" :
                  websiteType === "portfolio" ? "Portofoliu" :
                  "Aplicație web personalizată"
                }</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Design</span>
                <span className="font-medium capitalize">{
                  designComplexity === "simple" ? "Simplu" :
                  designComplexity === "standard" ? "Standard" :
                  "Premium"
                }</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Pagini</span>
                <span className="font-medium">{pageCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Funcționalități adăugate</span>
                <span className="font-medium">{
                  Object.values(features).filter(Boolean).length
                }</span>
              </div>
            </div>
            
            <Separator className="bg-white/20 my-4" />
            
            <div className="flex flex-col items-center py-6">
              <div className="text-4xl font-bold mb-2">€{price}</div>
              <p className="opacity-70 text-center">Aceasta este o estimare. Prețul final poate varia în funcție de cerințele exacte.</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleRequestProject}
                className="w-full bg-white text-purple-700 hover:bg-purple-50 font-medium text-base py-6"
              >
                Solicită o ofertă personalizată
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-center text-sm opacity-80">
                Vei primi o ofertă detaliată în maxim 48 de ore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Main Index component
const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleRequestProject = (data: any) => {
    navigate("/request-project", { state: data });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <WavyBackground className="pb-40">
        <motion.div
          className="relative pt-24 md:pt-32 px-4 text-center max-w-5xl mx-auto"
          style={{ opacity, scale }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Creăm Experiențe Digitale Remarcabile
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transformăm ideile în soluții digitale inovatoare.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/request-project">Solicită un proiect</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link to="/dashboard">Proiectele mele</Link>
            </Button>
          </motion.div>
        </motion.div>
      </WavyBackground>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center mb-16">
          <Badge className="mb-3">Serviciile Noastre</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce putem face pentru tine
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferim o gamă completă de servicii digitale pentru a te ajuta să îți
            dezvolți prezența online.
          </p>
        </div>

        <div className="container mx-auto grid md:grid-cols-3 gap-8">
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
      </section>

      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3">Calculator de preț</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vezi cât costă proiectul tău
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculează rapid costul estimativ al proiectului tău în funcție de
              cerințele specifice.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <PricingCalculator onRequestProject={handleRequestProject} />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center mb-16">
          <Badge className="mb-3">Portofoliu</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proiecte recente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorează o selecție din proiectele noastre recente pentru a vedea
            cum putem ajuta și afacerea ta.
          </p>
        </div>

        <div className="container mx-auto">
          <BentoBox items={bentoItems.items} />
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto text-center mb-16">
          <Badge className="mb-3">Testimoniale</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce spun clienții noștri
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descoperă experiențele pozitive ale clienților noștri și rezultatele
            obținute.
          </p>
        </div>

        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pregătit să începi proiectul tău?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Hai să transformăm ideile tale în realitate. Contactează-ne pentru o
            consultație gratuită.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-full px-8"
          >
            <Link to="/request-project">
              Solicită acum <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
