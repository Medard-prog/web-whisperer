
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pregătit să începi proiectul tău?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Contactează-ne astăzi pentru o discuție despre proiectul tău.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/request">
            <Button 
              size="lg" 
              className="bg-white text-purple-700 hover:bg-purple-50 hover:text-purple-800 px-8 py-6 h-auto text-base"
            >
              Solicită o ofertă
            </Button>
          </Link>
          <Link to="/contact">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 h-auto text-base"
            >
              Contactează-ne
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
