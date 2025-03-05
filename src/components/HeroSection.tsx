
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const HeroSection = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.div
              variants={item}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300"
            >
              Agenție de web development
            </motion.div>
            
            <motion.h1 
              variants={item} 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-300"
            >
              Transformăm <span className="text-purple-600 dark:text-purple-400">ideile</span> în experiențe digitale excepționale
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-gray-700 dark:text-gray-300 text-lg mb-8"
            >
              Echipa noastră de experți creează website-uri și aplicații web personalizate care aduc rezultate reale pentru afacerea ta, combinând designul modern cu funcționalități avansate.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link to="/request">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 text-base rounded-full w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                  Solicită o ofertă gratuită
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/servicii">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 px-7 py-3 text-base rounded-full w-full sm:w-auto">
                  Descoperă serviciile noastre
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={item} className="flex flex-wrap gap-x-8 gap-y-3">
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
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-yellow-300 dark:bg-yellow-500/30 rounded-full opacity-30 blur-3xl z-0"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-300 dark:bg-purple-500/30 rounded-full opacity-30 blur-3xl z-0"></div>
            
            <motion.div 
              animate={floatingAnimation}
              className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="col-span-2 h-40 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-purple-600"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-blue-100 dark:bg-blue-900/40 rounded-lg"></div>
                  <div className="h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg"></div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="h-10 w-28 bg-purple-600 rounded-lg"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
