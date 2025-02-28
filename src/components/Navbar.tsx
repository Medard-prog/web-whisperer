
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
    { name: "Prețuri", path: "/#preturi" },
    { name: "Contact", path: "/#contact" },
  ];

  const isHomePage = location.pathname === '/';

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-brand-800 flex items-center"
          >
            <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white w-10 h-10 rounded-md flex items-center justify-center mr-2 transition-transform hover:scale-110">W</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-800 to-brand-600">WebCreator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div className="flex space-x-6">
              {navItems.map((item, index) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-brand-600 font-medium transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="flex items-center space-x-4" variants={itemVariants}>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to={user.isAdmin ? "/admin" : "/dashboard"}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.isAdmin ? "Admin" : "Contul meu"}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => signOut()} size="icon" title="Deconectare">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline">
                      Autentificare
                    </Button>
                  </Link>
                  <Link to="/request-project">
                    <Button className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800">
                      Solicită ofertă
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Meniu</span>
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
                    {user ? (
                      <>
                        <Link to={user.isAdmin ? "/admin" : "/dashboard"}>
                          <Button variant="outline" className="w-full">
                            <User className="h-4 w-4 mr-2" />
                            {user.isAdmin ? "Admin" : "Contul meu"}
                          </Button>
                        </Link>
                        <Button variant="destructive" onClick={() => signOut()} className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Deconectare
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
