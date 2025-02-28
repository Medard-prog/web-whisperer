
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#servicii" },
    { name: "Portofoliu", path: "/#portofoliu" },
    { name: "Despre noi", path: "/#despre" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-brand-800 flex items-center"
          >
            <span className="bg-brand-500 text-white w-8 h-8 rounded-md flex items-center justify-center mr-2">W</span>
            WebCreator
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-brand-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">
                  Autentificare
                </Button>
              </Link>
              <Link to="/request-project">
                <Button>
                  Solicită ofertă
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full justify-between py-6">
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="text-gray-700 hover:text-brand-600 font-medium transition-colors py-2 px-4 rounded-md hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">
                        Autentificare
                      </Button>
                    </Link>
                    <Link to="/request-project">
                      <Button className="w-full">
                        Solicită ofertă
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
