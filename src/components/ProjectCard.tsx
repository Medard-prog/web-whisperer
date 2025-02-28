
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Calendar, MessageCircle, Eye, ArrowRight, FileEdit } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, formatPrice } from "@/lib/utils";
import { Project } from "@/types";

export interface ProjectCardProps {
  id?: string;
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  date?: string;
  dueDate?: string;
  price?: number;
  messagesCount?: number;
  image?: string;
  isAdmin?: boolean;
  project?: Project;
  onClick?: () => void;
}

const ProjectCard = ({
  id,
  title,
  description,
  status,
  date,
  dueDate,
  price,
  messagesCount = 0,
  image,
  isAdmin = false,
  project,
  onClick,
}: ProjectCardProps) => {
  
  // If project is provided, use its properties
  const projectId = project?.id || id;
  const projectTitle = project?.title || title;
  const projectDescription = project?.description || description;
  const projectStatus = project?.status || status || "pending";
  const projectDate = project?.createdAt || date;
  const projectDueDate = project?.dueDate || dueDate;
  const projectPrice = project?.price || price;
  
  const statusMap = {
    pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    in_progress: { label: "În progres", color: "bg-blue-100 text-blue-800 border-blue-200" },
    completed: { label: "Finalizat", color: "bg-green-100 text-green-800 border-green-200" },
    cancelled: { label: "Anulat", color: "bg-red-100 text-red-800 border-red-200" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
    >
      <Card className="overflow-hidden border-2 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {image && (
          <div className="h-48 overflow-hidden">
            <img 
              src={image} 
              alt={projectTitle} 
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={`${statusMap[projectStatus].color}`}>
              {statusMap[projectStatus].label}
            </Badge>
            {projectPrice && projectPrice > 0 && (
              <div className="text-lg font-semibold text-gray-900">{formatPrice(projectPrice)}</div>
            )}
          </div>
          <CardTitle className="text-xl line-clamp-1">{projectTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription className="text-gray-600 mb-4 line-clamp-2">
            {projectDescription}
          </CardDescription>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {projectDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(projectDate)}</span>
              </div>
            )}
            {projectDueDate && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Termen: {formatDate(projectDueDate)}</span>
              </div>
            )}
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{messagesCount} mesaje</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Link to={`/${isAdmin ? 'admin' : 'dashboard'}/projects/${projectId}`} className="w-full">
            <Button variant="outline" className="w-full group">
              <Eye className="h-4 w-4 mr-2 group-hover:text-brand-500" /> 
              <span>Vizualizează</span>
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Button>
          </Link>
          {isAdmin && (
            <Link to={`/admin/projects/${projectId}/edit`} className="w-full">
              <Button className="w-full bg-brand-600 hover:bg-brand-700">
                <FileEdit className="h-4 w-4 mr-2" />
                Gestionează
              </Button>
            </Link>
          )}
          {!isAdmin && projectStatus === "pending" && (
            <Link to={`/dashboard/projects/${projectId}/pay`} className="w-full">
              <Button className="w-full bg-brand-600 hover:bg-brand-700">
                Plătește
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
