import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar: hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>

        {/* Bottom nav: visible on mobile only */}
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
