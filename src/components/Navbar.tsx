
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-100 py-4 bg-white dark:bg-gray-950 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
            W
          </div>
          <span className="text-xl font-bold text-purple-600">WebCreator</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Acasă
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Servicii
          </Link>
          <Link to="/portfolio" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Portofoliu
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Prețuri
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Contact
          </Link>
          <Link to="/auth" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
            Autentificare
          </Link>
        </div>

        {/* CTA Button */}
        <Link to="/request-project">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            Solicită ofertă
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
