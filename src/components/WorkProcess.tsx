
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  MessageSquare, Palette, Code, RocketLaunch
} from "lucide-react";

interface WorkStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const WorkStep = ({ number, title, description, icon, isLast = false }: WorkStepProps) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 relative z-10 shadow-md">
        {icon}
      </div>
      
      {!isLast && (
        <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 dark:from-purple-800/30 dark:via-purple-700/30 dark:to-purple-800/30 transform translate-x-1/2 z-0 hidden md:block"></div>
      )}
      
      <div className="mb-2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
        {number}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">{description}</p>
    </div>
  );
};

const WorkProcess = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="cum-lucram" className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
            Procesul nostru
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Cum lucrăm
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Urmăm un proces simplu și eficient pentru a livra rezultate excepționale pentru fiecare proiect.
          </p>
        </div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <WorkStep 
              number={1} 
              title="Consultare" 
              description="Discutăm despre obiectivele tale de afaceri și definim cerințele proiectului."
              icon={<MessageSquare className="h-8 w-8" />}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WorkStep 
              number={2} 
              title="Design" 
              description="Creăm wireframe-uri și design-uri care reflectă identitatea brandului tău."
              icon={<Palette className="h-8 w-8" />}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WorkStep 
              number={3} 
              title="Dezvoltare" 
              description="Implementăm funcționalitățile și construim experiența digitală folosind tehnologii moderne."
              icon={<Code className="h-8 w-8" />}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WorkStep 
              number={4} 
              title="Lansare" 
              description="Lansăm proiectul și oferim asistență continuă pentru a asigura succesul pe termen lung."
              icon={<RocketLaunch className="h-8 w-8" />}
              isLast
            />
          </motion.div>
        </motion.div>
        
        {/* Visual path connecting the steps - Mobile only */}
        <div className="mt-12 relative h-4 md:hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200 dark:from-purple-800/30 dark:via-purple-700/30 dark:to-purple-800/30 transform -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
