
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  featured?: boolean;
  size?: "small" | "medium" | "large";
}

const PortfolioGrid = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const projects: Project[] = [
    {
      id: "1",
      title: "TechRo Solutions",
      description: "Website de prezentare pentru o companie de tehnologie, cu secțiuni pentru servicii, despre noi și pagină de contact.",
      category: "corporate",
      image: "/lovable-uploads/e5e203e8-9bc0-40fe-8502-79b005b33451.png",
      link: "/portfolio/techro-solutions",
      featured: true,
      size: "large"
    },
    {
      id: "2",
      title: "ElectroShop",
      description: "Magazin online de produse electronice, cu funcționalități de filtrare, coș de cumpărături și gateway de plată.",
      category: "ecommerce",
      image: "/lovable-uploads/2f905194-2593-457d-8702-354488b73410.png",
      link: "/portfolio/electroshop",
      size: "medium"
    },
    {
      id: "3",
      title: "Artisan Bakery",
      description: "Website pentru o brutărie artizanală, cu galerie de produse și sistem de comenzi online.",
      category: "prezentare",
      image: "/lovable-uploads/3caa3962-466d-4f1a-a72c-171f4ff83d78.png",
      link: "/portfolio/artisan-bakery",
      size: "medium"
    },
    {
      id: "4",
      title: "FitLife App",
      description: "Aplicație web pentru monitorizarea activității fizice și a dietei, cu dashboard personalizat.",
      category: "aplicatii",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      link: "/portfolio/fitlife-app",
      size: "small"
    },
    {
      id: "5",
      title: "Travel Explorer",
      description: "Platform de rezervări pentru călătorii, cu recomandări personalizate și sistem de review-uri.",
      category: "aplicatii",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      link: "/portfolio/travel-explorer",
      size: "small"
    },
  ];

  // Helper for getting cell span classes based on project size
  const getCellClass = (size?: "small" | "medium" | "large") => {
    switch(size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "medium":
        return "md:col-span-1 md:row-span-2";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={item}
          className={`group relative overflow-hidden rounded-xl shadow-md ${getCellClass(project.size)}`}
          onMouseEnter={() => setHoveredId(project.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Link 
            to={project.link}
            className="block w-full h-full"
          >
            <div 
              className="w-full h-full min-h-[240px] md:min-h-[300px] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {project.featured && (
                  <Badge className="mb-auto self-start bg-purple-500 hover:bg-purple-600 text-white">
                    Proiect Featured
                  </Badge>
                )}
                
                <h3 className="text-white text-xl font-semibold">{project.title}</h3>
                
                <div className="mt-2 flex items-center">
                  <Badge className="bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm">
                    {project.category === "corporate" && "Corporate"}
                    {project.category === "ecommerce" && "eCommerce"}
                    {project.category === "prezentare" && "Prezentare"}
                    {project.category === "aplicatii" && "Aplicație"}
                  </Badge>
                </div>
                
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: hoveredId === project.id ? 1 : 0,
                    height: hoveredId === project.id ? "auto" : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-200 text-sm mt-2 line-clamp-2"
                >
                  {project.description}
                </motion.p>
                
                <motion.div 
                  className="mt-4 flex items-center text-white text-sm font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredId === project.id ? 1 : 0,
                    y: hoveredId === project.id ? 0 : 10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Vezi proiect</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </motion.div>
              </div>
              
              {/* Arrow indicator - only visible on hover */}
              <motion.div 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: hoveredId === project.id ? 1 : 0,
                  scale: hoveredId === project.id ? 1 : 0.8,
                }}
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PortfolioGrid;
