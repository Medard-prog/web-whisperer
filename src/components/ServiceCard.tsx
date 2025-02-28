
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

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
    <Card 
      className="hover-card-effect overflow-hidden border border-gray-200 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className={`p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 transition-colors duration-300 ${
          isHovered ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-500"
        }`}>
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-gray-600 mb-4">
          {description}
        </CardDescription>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 mr-2"></div>
              <span className="text-gray-600 text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link to={linkTo} className="w-full">
          <Button variant="outline" className="w-full">
            Află mai multe
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
