
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <span className="text-xl font-bold text-purple-600">WebStudio</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Transformăm ideile în experiențe digitale excepționale pentru afacerea ta.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicii/website-prezentare" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Website-uri de prezentare
                </Link>
              </li>
              <li>
                <Link to="/servicii/magazine-online" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Magazine online
                </Link>
              </li>
              <li>
                <Link to="/servicii/aplicatii-web" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Aplicații web
                </Link>
              </li>
              <li>
                <Link to="/servicii/optimizare-seo" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Optimizare SEO
                </Link>
              </li>
              <li>
                <Link to="/servicii" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Toate serviciile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Companie</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/despre-noi" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link to="/portofoliu" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Portofoliu
                </Link>
              </li>
              <li>
                <Link to="/servicii#pricing" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Prețuri
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-4 h-4 text-purple-600 mt-1 mr-3" />
                <a href="mailto:contact@webstudio.ro" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  contact@webstudio.ro
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-purple-600 mt-1 mr-3" />
                <a href="tel:+40723456789" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  +40 723 456 789
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-purple-600 mt-1 mr-3" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Str. Exemplu nr. 123, București
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} WebStudio. Toate drepturile rezervate.
          </p>
          <div className="flex space-x-6">
            <Link to="/termeni-si-conditii" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
              Termeni și condiții
            </Link>
            <Link to="/politica-de-confidentialitate" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
              Politica de confidențialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
