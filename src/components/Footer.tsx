
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-2xl font-bold text-brand-800 flex items-center mb-4">
              <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white w-10 h-10 rounded-md flex items-center justify-center mr-2">W</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-800 to-brand-600">WebCreator</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Transformăm viziunea ta digitală în realitate. Creăm site-uri web moderne, 
              responsive și optimizate pentru rezultate excelente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors transform hover:scale-110 duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors transform hover:scale-110 duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors transform hover:scale-110 duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors transform hover:scale-110 duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-medium text-lg mb-4">Link-uri rapide</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                  Acasă
                </Link>
              </li>
              <li>
                <Link to="/#servicii" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                  Servicii
                </Link>
              </li>
              <li>
                <Link to="/#portofoliu" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                  Portofoliu
                </Link>
              </li>
              <li>
                <Link to="/#preturi" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                  Prețuri
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Str. Exemplu 123, București, România</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-brand-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">+40 712 345 678</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-brand-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">contact@webcreator.ro</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-medium text-lg mb-4">Abonează-te la newsletter</h3>
            <p className="text-gray-600 mb-4">
              Fii la curent cu cele mai noi tendințe din dezvoltarea web și ofertele noastre.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Input placeholder="Adresa ta de email" className="bg-white pr-10" />
                <Button size="icon" className="absolute right-1 top-1 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800">
                Abonează-te
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} WebCreator. Toate drepturile rezervate.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/termeni-conditii" className="text-gray-500 hover:text-brand-600 text-sm">
              Termeni și condiții
            </Link>
            <Link to="/politica-confidentialitate" className="text-gray-500 hover:text-brand-600 text-sm">
              Politica de confidențialitate
            </Link>
            <Link to="/cookies" className="text-gray-500 hover:text-brand-600 text-sm">
              Politica de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
