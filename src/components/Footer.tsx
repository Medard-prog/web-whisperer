
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-brand-800 flex items-center mb-4">
              <span className="bg-brand-500 text-white w-8 h-8 rounded-md flex items-center justify-center mr-2">W</span>
              WebCreator
            </Link>
            <p className="text-gray-600 mb-4">
              Transformăm viziunea ta digitală în realitate. Creăm site-uri web moderne, 
              responsive și optimizate pentru rezultate excelente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Link-uri rapide</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link to="/#servicii" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Servicii
                </Link>
              </li>
              <li>
                <Link to="/#portofoliu" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Portofoliu
                </Link>
              </li>
              <li>
                <Link to="/#despre" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
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
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Abonează-te la newsletter</h3>
            <p className="text-gray-600 mb-4">
              Fii la curent cu cele mai noi tendințe din dezvoltarea web și ofertele noastre.
            </p>
            <div className="flex flex-col space-y-2">
              <Input placeholder="Adresa ta de email" className="bg-white" />
              <Button>Abonează-te</Button>
            </div>
          </div>
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
