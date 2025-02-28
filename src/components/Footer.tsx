
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <span className="text-xl font-bold text-purple-600">WebCreator</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Transformăm ideile în experiențe digitale excepționale pentru afacerea ta.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/websites" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Website-uri de prezentare
                </Link>
              </li>
              <li>
                <Link to="/services/ecommerce" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Magazine online
                </Link>
              </li>
              <li>
                <Link to="/services/applications" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Aplicații web
                </Link>
              </li>
              <li>
                <Link to="/services/seo" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Optimizare SEO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Companie</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Portofoliu
                </Link>
              </li>
              <li>
                <Link to="/prices" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm">
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
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Email: contact@webcreator.ro
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Telefon: +40 723 456 789
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Adresă: Str. Exemplu nr. 123, București
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} WebCreator. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
