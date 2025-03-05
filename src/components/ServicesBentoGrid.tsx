
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Globe, ShoppingCart, Code, Search, 
  Palette, Wrench, ArrowRight, Zap,
  BarChart, Phone
} from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  delay?: number;
  size?: "small" | "medium" | "large";
}

const ServiceCard = ({ title, description, icon, link, color, delay = 0, size = "medium" }: ServiceCardProps) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-1 row-span-1",
    large: "col-span-1 md:col-span-2 row-span-1"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`${sizeClasses[size]} group hover-card-effect`}
    >
      <Link to={link} className={`block h-full p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative`}>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
        
        <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 mt-auto">
          <span>Află mai multe</span>
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
        
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${color} opacity-10 transition-all duration-300 group-hover:scale-150`}></div>
      </Link>
    </motion.div>
  );
};

const ServicesBentoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <ServiceCard
        title="Website-uri de prezentare"
        description="Creăm site-uri de prezentare care reflectă identitatea brandului tău și atrag clienți noi."
        icon={<Globe className="h-6 w-6 text-white" />}
        link="/servicii/website-prezentare"
        color="bg-blue-500"
        delay={0}
        size="large"
      />
      
      <ServiceCard
        title="Magazine online"
        description="Dezvoltăm soluții eCommerce personalizate pentru a-ți vinde produsele online."
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
        link="/servicii/magazine-online"
        color="bg-green-500"
        delay={1}
      />
      
      <ServiceCard
        title="Optimizare SEO"
        description="Îmbunătățim vizibilitatea ta online și atragem mai mulți clienți prin strategii SEO eficiente."
        icon={<Search className="h-6 w-6 text-white" />}
        link="/servicii/optimizare-seo"
        color="bg-orange-500"
        delay={2}
      />
      
      <ServiceCard
        title="Aplicații web"
        description="Creăm aplicații web personalizate care automatizează și optimizează procesele afacerii tale."
        icon={<Code className="h-6 w-6 text-white" />}
        link="/servicii/aplicatii-web"
        color="bg-purple-500"
        delay={3}
      />
      
      <ServiceCard
        title="Design UX/UI"
        description="Experiențe digitale intuitive și atractive care convertesc vizitatori în clienți."
        icon={<Palette className="h-6 w-6 text-white" />}
        link="/servicii/design-ux-ui"
        color="bg-pink-500"
        delay={4}
        size="large"
      />
      
      <ServiceCard
        title="Dezvoltare personalizată"
        description="Soluții web customizate pentru provocările unice ale afacerii tale."
        icon={<Wrench className="h-6 w-6 text-white" />}
        link="/servicii/dezvoltare-personalizata"
        color="bg-yellow-500"
        delay={5}
      />
    </div>
  );
};

export default ServicesBentoGrid;
