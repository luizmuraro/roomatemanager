import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Expenses from "./pages/Expenses.tsx";
import Receipts from "./pages/Receipts.tsx";
import Settings from "./pages/Settings.tsx";
import Shopping from "./pages/Shopping.tsx";
import { AppLayout } from "./components/AppLayout.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();
const defaultRootRoute = "/dashboard";

const OnboardingPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center">
    <div>
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <p className="text-muted-foreground mt-2">
        Esta tela sera implementada na proxima etapa.
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={defaultRootRoute} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/onboarding" element={<OnboardingPlaceholder />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/receipts" element={<Receipts />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={defaultRootRoute} replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
