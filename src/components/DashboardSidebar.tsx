
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Menu, 
  X, 
  MessageSquare, 
  FileText, 
  Settings, 
  HelpCircle,
  LogOut,
  UserRound
} from "lucide-react";

type SidebarLink = {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const links: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Proiecte",
    href: "/dashboard/projects",
    icon: FileText,
  },
  {
    label: "Mesaje",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    label: "Suport",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    label: "Setări",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const adminLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Home,
    adminOnly: true,
  },
  {
    label: "Proiecte",
    href: "/admin/projects",
    icon: FileText,
    adminOnly: true,
  },
  {
    label: "Clienți",
    href: "/admin/clients",
    icon: UserRound,
    adminOnly: true,
  },
  {
    label: "Mesaje",
    href: "/admin/messages",
    icon: MessageSquare,
    adminOnly: true,
  },
  {
    label: "Rapoarte",
    href: "/admin/reports",
    icon: FileText,
    adminOnly: true,
  },
  {
    label: "Setări",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: true,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar = ({ className }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const visibleLinks = isAdmin ? adminLinks : links;
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  return (
    <>
      {/* Mobile toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Main sidebar content with scrollable area */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo area */}
          <div className="p-4 border-b">
            <div 
              className="cursor-pointer"
              onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
            >
              <h2 className="text-xl font-bold text-primary">WebDevs</h2>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Admin Panel" : "Client Dashboard"}
              </p>
            </div>
          </div>
          
          {/* Links - scrollable area */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {visibleLinks.map((link) => (
                <Button
                  key={link.label}
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-3 mb-1",
                    isActive(link.href) ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => {
                    navigate(link.href);
                    setIsOpen(false);
                  }}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          
          {/* User profile & logout - fixed at bottom */}
          <div className="border-t p-4 mt-auto">
            {user && (
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-secondary"
                  onClick={() => navigate("/dashboard/settings")}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-primary/10 rounded-full p-1">
                      <UserRound className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="font-medium truncate">{user.name || 'Utilizator'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Deconectare</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
