import { Home, Receipt, ShoppingCart, Camera, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { isPathActive } from "@/lib/routes";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Início", url: "/dashboard", icon: Home },
  { title: "Despesas", url: "/expenses", icon: Receipt },
  { title: "Lista", url: "/shopping", icon: ShoppingCart },
  { title: "Recibos", url: "/receipts", icon: Camera },
  { title: "Ajustes", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="py-4">
        {/* Logo / Brand - only show when expanded */}
        {!collapsed && (
          <div className="flex items-center justify-between px-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">Share House</span>
            </div>
            <button onClick={toggleSidebar} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        )}

        <SidebarMenu className="space-y-1 px-2">
          {items.map((item) => {
            const active = isPathActive(location.pathname, item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => navigate(item.url)}
                  className={`
                    h-10 rounded-lg transition-all cursor-pointer
                    ${active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${collapsed ? "justify-center px-0" : "px-3"}
                  `}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-primary-foreground" : ""}`} />
                  {!collapsed && <span className="font-medium">{item.title}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Expand button at the bottom when collapsed */}
      {collapsed && (
        <SidebarFooter className="flex items-center justify-center py-4">
          <button onClick={toggleSidebar} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <PanelLeft className="w-4 h-4" />
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
