
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Calendar, MessageCircle, Eye } from "lucide-react";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  dueDate?: string;
  price?: number;
  messagesCount: number;
  image?: string;
  isAdmin?: boolean;
}

const ProjectCard = ({
  id,
  title,
  description,
  status,
  date,
  dueDate,
  price,
  messagesCount,
  image,
  isAdmin = false,
}: ProjectCardProps) => {
  
  const statusMap = {
    pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    in_progress: { label: "În progres", color: "bg-blue-100 text-blue-800 border-blue-200" },
    completed: { label: "Finalizat", color: "bg-green-100 text-green-800 border-green-200" },
    cancelled: { label: "Anulat", color: "bg-red-100 text-red-800 border-red-200" },
  };

  return (
    <Card className="overflow-hidden hover-card-effect h-full">
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`${statusMap[status].color}`}>
            {statusMap[status].label}
          </Badge>
          {price && (
            <div className="text-lg font-semibold text-gray-900">{price.toLocaleString()} RON</div>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </CardDescription>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
          {dueDate && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Termen: {dueDate}</span>
            </div>
          )}
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{messagesCount} mesaje</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Link to={`/${isAdmin ? 'admin' : 'dashboard'}/projects/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" /> 
            Vizualizează
          </Button>
        </Link>
        {isAdmin && (
          <Link to={`/admin/projects/${id}/edit`} className="w-full">
            <Button className="w-full">
              Gestionează
            </Button>
          </Link>
        )}
        {!isAdmin && status === "pending" && (
          <Link to={`/dashboard/projects/${id}/pay`} className="w-full">
            <Button className="w-full">
              Plătește
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
