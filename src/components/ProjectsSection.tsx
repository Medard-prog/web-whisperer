
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("toate");
  
  const projects: Project[] = [
    {
      id: "1",
      title: "TechRo Solutions",
      category: "corporate",
      image: "/lovable-uploads/e5e203e8-9bc0-40fe-8502-79b005b33451.png",
      link: "/portfolio/techro-solutions",
    },
    {
      id: "2",
      title: "ElectroShop",
      category: "ecommerce",
      image: "/lovable-uploads/2f905194-2593-457d-8702-354488b73410.png",
      link: "/portfolio/electroshop",
    },
    {
      id: "3",
      title: "Artisan Bakery",
      category: "prezentare",
      image: "/lovable-uploads/3caa3962-466d-4f1a-a72c-171f4ff83d78.png",
      link: "/portfolio/artisan-bakery",
    },
  ];

  const filteredProjects = activeFilter === "toate" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const filters = [
    { id: "toate", label: "Toate" },
    { id: "ecommerce", label: "Magazine online" },
    { id: "corporate", label: "Corporate" },
    { id: "prezentare", label: "Prezentare" },
    { id: "aplicatii", label: "Aplicații" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Portofoliu</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explorează o selecție din proiectele noastre recente.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              className={`cursor-pointer px-4 py-2 text-sm ${
                activeFilter === filter.id
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={project.link} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-semibold">{project.title}</h3>
                  <Badge className="mt-2 inline-flex bg-purple-600 text-white w-fit">
                    {filters.find(f => f.id === project.category)?.label || project.category}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            Vezi toate proiectele
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
