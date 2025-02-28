
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transformăm <span className="text-purple-600">ideile</span> în experiențe digitale excepționale
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Echipa noastră de experți creează website-uri și aplicații web personalizate care aduc rezultate reale pentru afacerea ta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/request-project">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-base rounded-md w-full sm:w-auto">
                  Solicită o ofertă gratuită
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 px-6 py-3 text-base rounded-md w-full sm:w-auto">
                  Descoperă serviciile noastre
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                <span>Design modern</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                <span>100% responsive</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                <span>Optimizat SEO</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-8 md:p-12 bg-purple-600 text-white text-center rounded-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Web Development</h2>
                <p className="text-purple-100">Soluții digitale personalizate</p>
              </div>
            </div>
            <div className="absolute top-12 -right-8 w-40 h-40 bg-yellow-200 dark:bg-yellow-400/30 rounded-full opacity-50 z-0 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-blue-200 dark:bg-blue-400/30 rounded-full opacity-50 z-0 blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
