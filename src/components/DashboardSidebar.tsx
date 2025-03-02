
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Users, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X,
  HelpCircle,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  end?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active, onClick, end }: SidebarItemProps) => (
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      active 
        ? "bg-purple-100 text-purple-900 font-medium" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
    {end && <ChevronRight className="ml-auto h-4 w-4" />}
  </Link>
);

const DashboardSidebar = ({ isAdmin = false }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const userMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FolderKanban, label: "Proiectele mele", href: "/dashboard/projects" },
    { icon: MessageSquare, label: "Mesaje", href: "/dashboard/messages" },
    { icon: CreditCard, label: "Facturi", href: "/dashboard/invoices" },
    { icon: Settings, label: "Setări", href: "/dashboard/settings" },
  ];
  
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FolderKanban, label: "Proiecte", href: "/admin/projects" },
    { icon: Users, label: "Clienți", href: "/admin/clients" },
    { icon: MessageSquare, label: "Mesaje", href: "/admin/messages" },
    { icon: FileText, label: "Rapoarte", href: "/admin/reports" },
    { icon: Settings, label: "Setări", href: "/admin/settings" },
  ];
  
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  
  const sidebar = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-semibold">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-8 w-8 rounded-md flex items-center justify-center">
            <span className="font-bold">W</span>
          </div>
          <span className="text-xl">WebCreator</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="ml-auto md:hidden" 
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 sm:max-w-xs">
            <nav className="flex h-full flex-col gap-2 p-4">
              <div className="flex h-14 items-center px-4">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-semibold">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-8 w-8 rounded-md flex items-center justify-center">
                    <span className="font-bold">W</span>
                  </div>
                  <span className="text-xl">WebCreator</span>
                </Link>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="ml-auto" 
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close Menu</span>
                </Button>
              </div>
              <div className="px-2 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  {isAdmin ? "Administrare" : "Contul meu"}
                </h2>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={isActive(item.href)}
                      onClick={() => setIsMobileOpen(false)}
                    />
                  ))}
                </div>
              </div>
              <Separator />
              <div className="px-2 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Asistență
                </h2>
                <div className="space-y-1">
                  <SidebarItem
                    icon={HelpCircle}
                    label="Ajutor & Suport"
                    href={isAdmin ? "/admin/help" : "/dashboard/help"}
                    active={isActive(isAdmin ? "/admin/help" : "/dashboard/help")}
                    onClick={() => setIsMobileOpen(false)}
                  />
                  <SidebarItem
                    icon={LogOut}
                    label="Deconectare"
                    href="#"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleSignOut();
                    }}
                  />
                </div>
              </div>
              <div className="mt-auto px-2 py-2">
                <div className="rounded-md border bg-gradient-to-r from-purple-50 to-indigo-50 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 overflow-auto px-4">
        <div className="py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            {isAdmin ? "Administrare" : "Contul meu"}
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={isActive(item.href)}
              />
            ))}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Asistență
          </h2>
          <div className="space-y-1">
            <SidebarItem
              icon={HelpCircle}
              label="Ajutor & Suport"
              href={isAdmin ? "/admin/help" : "/dashboard/help"}
              active={isActive(isAdmin ? "/admin/help" : "/dashboard/help")}
            />
            <SidebarItem
              icon={LogOut}
              label="Deconectare"
              href="#"
              onClick={handleSignOut}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-md border bg-gradient-to-r from-purple-50 to-indigo-50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-purple-600 text-white">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 sm:max-w-xs">
          {sidebar}
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r bg-white/80 backdrop-blur-sm">
        {sidebar}
      </div>
    </>
  );
};

export default DashboardSidebar;
