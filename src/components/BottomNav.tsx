import { Home, Receipt, ShoppingCart, Camera, Settings } from "lucide-react";
import { isPathActive } from "@/lib/routes";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Receipt, label: "Despesas", path: "/expenses" },
  { icon: ShoppingCart, label: "Lista", path: "/shopping" },
  { icon: Camera, label: "Recibos", path: "/receipts" },
  { icon: Settings, label: "Ajustes", path: "/settings" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
              isPathActive(location.pathname, tab.path) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
