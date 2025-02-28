
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import BentoBox from "@/components/BentoBox";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  return (
    <div className="container mx-auto py-12 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transformă-ți viziunea în realitate digitală
        </motion.h1>
        <motion.p
          className="text-lg text-gray-700 dark:text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Servicii complete de web design, e-commerce și aplicații web personalizate
        </motion.p>
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/request-project" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors">
            Solicită o ofertă
          </Link>
          <Link to="/contact" className="bg-transparent hover:bg-blue-50 text-blue-600 font-bold py-3 px-6 rounded-full border border-blue-600 transition-colors dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20">
            Contactează-ne
          </Link>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="inline-block h-8 w-8 text-yellow-500 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Serviciile noastre
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Descoperă gama noastră de servicii personalizate pentru a-ți atinge obiectivele
          </p>
        </motion.div>

        
            <BentoBox
              items={[
                {
                  id: "1",
                  title: "Website de prezentare",
                  description: "Website-uri elegante pentru afacerea ta",
                  image: "/images/website-prezentare.jpg",
                  link: "/services/website-prezentare",
                  category: "Web Design"
                },
                {
                  id: "2",
                  title: "Magazine online",
                  description: "Soluții e-commerce complete",
                  image: "/images/ecommerce.jpg",
                  link: "/services/magazine-online",
                  category: "E-commerce"
                },
                {
                  id: "3",
                  title: "Aplicații web",
                  description: "Aplicații web personalizate",
                  image: "/images/aplicatii-web.jpg",
                  link: "/services/aplicatii-web",
                  category: "Web Development"
                },
                {
                  id: "4",
                  title: "Optimizare SEO",
                  description: "Crește vizibilitatea online",
                  image: "/images/seo.jpg",
                  link: "/services/seo",
                  category: "Marketing"
                }
              ]}
            />
      </section>

      {/* Testimonials Section */}
      <section>
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="inline-block h-8 w-8 text-yellow-500 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Ce spun clienții noștri
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Părerile clienților noștri sunt cea mai bună carte de vizită
          </p>
        </motion.div>

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
      </section>
    </div>
  );
};

export default Index;
