
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BentoBoxItemProps {
  title: string;
  description: string;
  image: string;
  link: string;
  index: number;
  variant?: "large" | "medium" | "small";
  className?: string;
}

const BentoBoxItem = ({ 
  title, 
  description, 
  image, 
  link, 
  index, 
  variant = "medium",
  className 
}: BentoBoxItemProps) => {
  // Different heights for different variants
  const heightClass = {
    large: "h-96 md:h-[28rem]",
    medium: "h-72 md:h-80",
    small: "h-64",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        heightClass[variant],
        className
      )}
    >
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>
      </div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <motion.h3 
          className="text-xl md:text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-sm text-gray-200 mb-4 line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          {description}
        </motion.p>
        <Link 
          to={link}
          className="inline-flex items-center text-sm font-medium text-white hover:text-brand-300 transition-colors"
        >
          <span>Vezi proiectul</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

interface BentoBoxProps {
  projects: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
  }>;
}

const BentoBox = ({ projects }: BentoBoxProps) => {
  if (!projects.length) return null;
  
  // Assuming the first item is the featured project
  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Featured project (spans 2 columns) */}
      <BentoBoxItem
        title={featuredProject.title}
        description={featuredProject.description}
        image={featuredProject.image}
        link={`/portfolio/${featuredProject.id}`}
        index={0}
        variant="large"
        className="md:col-span-2"
      />
      
      {/* Remaining projects */}
      {remainingProjects.map((project, index) => (
        <BentoBoxItem
          key={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          link={`/portfolio/${project.id}`}
          index={index + 1}
          variant={index % 3 === 0 ? "medium" : "small"}
          className={index % 3 === 0 ? "md:col-span-2" : ""}
        />
      ))}
    </div>
  );
};

export default BentoBox;
