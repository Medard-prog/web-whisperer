
import { CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    new: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  };

  const statusLabels = {
    pending: "În așteptare",
    in_progress: "În lucru",
    completed: "Finalizat",
    cancelled: "Anulat",
    new: "Nou"
  };

  // Safely format a date with fallback
  const formatSafeDate = (dateStr: string) => {
    try {
      // Check if dateStr is valid by creating a date and checking if it's valid
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Data necunoscută";
      }
      return format(date, "dd.MM.yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateStr, error);
      return "Data necunoscută";
    }
  };

  return (
    <Card 
      className="h-full transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-lg">{project.title}</CardTitle>
          <Badge className={statusColors[project.status as keyof typeof statusColors] || "bg-gray-100"}>
            {statusLabels[project.status as keyof typeof statusLabels] || project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 line-clamp-2 text-sm mb-3">{project.description}</p>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Creat: {project.createdAt ? formatSafeDate(project.createdAt) : "Data necunoscută"}</span>
          </div>
          {project.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Termen: {formatSafeDate(project.dueDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex flex-wrap gap-1">
          {project.hasCMS && <Badge variant="outline" className="text-xs">CMS</Badge>}
          {project.hasEcommerce && <Badge variant="outline" className="text-xs">E-commerce</Badge>}
          {project.hasSEO && <Badge variant="outline" className="text-xs">SEO</Badge>}
          {project.hasMaintenance && <Badge variant="outline" className="text-xs">Mentenanță</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
export type { ProjectCardProps };
