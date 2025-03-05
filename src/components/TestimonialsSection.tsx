
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    image?: string;
  };
  delay?: number;
}

const TestimonialCard = ({ content, author, delay = 0 }: TestimonialProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 text-yellow-400 flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      
      <Quote className="h-8 w-8 text-purple-200 dark:text-purple-800 mb-4 opacity-50" />
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
        "{content}"
      </p>
      
      <div className="flex items-center">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold mr-3">
          {author.image ? (
            <img src={author.image} alt={author.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            author.name.charAt(0)
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{author.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{author.role}, {author.company}</p>
        </div>
      </div>
      
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-purple-50 dark:bg-purple-900/20"></div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "Colaborarea cu această echipă a fost una dintre cele mai bune decizii pentru afacerea noastră. Profesionalism și calitate la fiecare pas al proiectului!",
      author: {
        name: "Maria Popescu",
        role: "Director Marketing",
        company: "TechSolutions Romania"
      }
    },
    {
      content: "Am fost impresionat de creativitatea și atenția la detalii. Recomand cu încredere serviciile lor oricui dorește un website de calitate!",
      author: {
        name: "Ion Gheorghe",
        role: "Fondator",
        company: "StartUp Innovation"
      }
    },
    {
      content: "Echipa a înțeles perfect nevoile noastre și a livrat un produs excelent. Comunicare eficientă și rezultate pe măsură!",
      author: {
        name: "Elena Ionescu",
        role: "Manager Vânzări",
        company: "Global Trading SRL"
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          content={testimonial.content}
          author={testimonial.author}
          delay={index}
        />
      ))}
    </div>
  );
};

export default TestimonialsSection;
