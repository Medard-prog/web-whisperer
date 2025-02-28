
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building,
  Cog,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMobile } from "@/hooks/use-mobile";

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

const servicesItems: NavItem[] = [
  {
    title: "Dezvoltare Web",
    href: "/services/web-development",
    description: "Site-uri web moderne și responsive, optimizate pentru performanță",
  },
  {
    title: "Dezvoltare Aplicații",
    href: "/services/app-development",
    description: "Aplicații web personalizate și soluții SaaS pentru afaceri",
  },
  {
    title: "E-commerce",
    href: "/services/ecommerce",
    description: "Magazine online complete cu gestiune de produse și plăți",
  },
  {
    title: "Consultanță IT",
    href: "/services/it-consultancy",
    description: "Consultanță tehnică și strategii digitale pentru afacerea ta",
  },
];

const companyItems: NavItem[] = [
  {
    title: "Despre noi",
    href: "/about",
    description: "Află mai multe despre echipa și valorile noastre",
  },
  {
    title: "Portofoliu",
    href: "/portfolio",
    description: "Explorează proiectele noastre anterioare",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Articole, tutoriale și noutăți din domeniul tech",
  },
  {
    title: "Cariere",
    href: "/careers",
    description: "Alătură-te echipei noastre de profesioniști",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (
      names[0].charAt(0).toUpperCase() + 
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-200",
        {
          "bg-white/80 backdrop-blur-md shadow-sm": scrolled,
          "bg-transparent": !scrolled,
        }
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            WebCraft
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Servicii</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {servicesItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Companie</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {companyItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Prețuri
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="hidden md:flex"
                onClick={() => navigate("/request")}
              >
                Solicită ofertă
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                    <Cog className="mr-2 h-4 w-4" />
                    <span>Setări</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Deconectare</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="hidden md:flex">
                  <User className="mr-2 h-4 w-4" />
                  Autentificare
                </Button>
              </Link>
              <Link to="/request">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hidden md:flex">
                  Solicită ofertă
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "overflow-hidden bg-white border-b",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Servicii</div>
              <ul className="pl-4 space-y-2">
                {servicesItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Companie</div>
              <ul className="pl-4 space-y-2">
                {companyItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/pricing"
                className="block font-medium hover:text-foreground"
                onClick={closeMobileMenu}
              >
                Prețuri
              </Link>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/contact"
                className="block font-medium hover:text-foreground"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div>
            
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate("/dashboard");
                      closeMobileMenu();
                    }}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate("/request");
                      closeMobileMenu();
                    }}
                  >
                    Solicită ofertă
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Deconectare
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => {
                      navigate("/request");
                      closeMobileMenu();
                    }}
                  >
                    Solicită ofertă
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate("/auth");
                      closeMobileMenu();
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Autentificare
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    href: string;
  }
>(({ className, title, children, href, ...props }, ref) => {
  const navigate = useNavigate();
  
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            navigate(href);
          }}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
