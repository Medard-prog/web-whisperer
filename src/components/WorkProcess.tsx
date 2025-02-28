
import React from "react";

interface WorkStepProps {
  number: number;
  title: string;
  description: string;
}

const WorkStep = ({ number, title, description }: WorkStepProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const WorkProcess = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Cum lucrăm</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Un proces simplu și eficient pentru rezultate excepționale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <WorkStep 
            number={1} 
            title="Consultare" 
            description="Discutăm despre obiectivele tale și definim cerințele proiectului."
          />
          <WorkStep 
            number={2} 
            title="Design" 
            description="Cream wireframe-uri și design-uri care reflectă identitatea brandului tău."
          />
          <WorkStep 
            number={3} 
            title="Dezvoltare" 
            description="Implementăm funcționalitățile și construim experiența digitală."
          />
          <WorkStep 
            number={4} 
            title="Lansare" 
            description="Lansăm proiectul și oferim asistență continuă pentru a asigura succesul."
          />
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
