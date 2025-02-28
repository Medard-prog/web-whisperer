
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  LayoutDashboard, 
  MessageSquare,

  FileText, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Users,
  FolderKanban,
  Clock,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isAdmin?: boolean;
}

const DashboardSidebar = ({ className, isAdmin = false }: SidebarProps) => {
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const userRoutes = [
    {
      title: "Panou principal",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Proiectele mele",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Mesaje",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Facturi",
      href: "/dashboard/invoices",
      icon: FileText,
    },
    {
      title: "Plăți",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Setări",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Ajutor",
      href: "/dashboard/help",
      icon: HelpCircle,
    },
  ];
  
  const adminRoutes = [
    {
      title: "Panou principal",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Proiecte",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      title: "Clienți",
      href: "/admin/clients",
      icon: Users,
    },
    {
      title: "Sarcini",
      href: "/admin/tasks",
      icon: Clock,
    },
    {
      title: "Mesaje",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "Facturi",
      href: "/admin/invoices",
      icon: FileText,
    },
    {
      title: "Rapoarte",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Setări",
      href: "/admin/settings",
      icon: Settings,
    },
  ];
  
  const routes = isAdmin ? adminRoutes : userRoutes;
  
  return (
    <div
      className={cn(
        "relative flex flex-col border-r h-screen bg-slate-50/50",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      {/* Sidebar header with logo */}
      <div className="flex items-center py-4 px-2 h-16 border-b">
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "px-2"
          )}
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white w-9 h-9 rounded-md flex items-center justify-center">
            W
          </div>
          {!collapsed && (
            <span className="ml-2 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-brand-800 to-brand-600">
              WebCreator
            </span>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-4 h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Home link */}
      <div className={`px-${collapsed ? '3' : '4'} py-4`}>
        <Link to="/">
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-2"
            )}
          >
            <Home className="h-4 w-4 mr-2" />
            {!collapsed && <span>Pagina principală</span>}
          </Button>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center py-2 px-3 text-sm font-medium rounded-md",
                location.pathname === route.href
                  ? "bg-brand-100 text-brand-900"
                  : "text-gray-700 hover:text-brand-900 hover:bg-gray-100",
                collapsed && "justify-center px-2"
              )}
            >
              <route.icon className={cn("h-5 w-5 text-gray-500", location.pathname === route.href && "text-brand-700")} />
              {!collapsed && <span className="ml-3">{route.title}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 mt-auto">
        <Separator className="my-4" />
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
            collapsed && "justify-center px-2"
          )} 
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Deconectare</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
