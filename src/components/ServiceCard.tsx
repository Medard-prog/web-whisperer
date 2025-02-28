
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  linkTo: string;
}

const ServiceCard = ({ title, description, icon, benefits, linkTo }: ServiceCardProps) => {
  return (
    <Card className="border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 h-full">
      <CardContent className="pt-6">
        <div className="mb-4 h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-purple-600 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>
        
        <Link 
          to={linkTo} 
          className="text-purple-600 font-medium text-sm hover:text-purple-700 inline-block"
        >
          Află mai multe
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
