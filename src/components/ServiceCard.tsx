
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  linkTo: string;
}

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  benefits,
  linkTo,
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="group overflow-hidden border-2 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-brand-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-2">
          <motion.div 
            className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 transition-all duration-500 ease-out ${
              isHovered ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-500"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>
          <CardTitle className="text-xl group-hover:text-brand-600 transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription className="text-gray-600 mb-4">
            {description}
          </CardDescription>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Link to={linkTo} className="w-full">
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all"
            >
              Află mai multe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
