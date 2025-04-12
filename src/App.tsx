
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Marketplaces from "./pages/admin/marketplaces/Marketplaces";
import AmazonSetup from "./pages/admin/marketplaces/AmazonSetup";
import ShopeeSetup from "./pages/admin/marketplaces/ShopeeSetup";
import MercadoLivreSetup from "./pages/admin/marketplaces/MercadoLivreSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/marketplaces" element={<Marketplaces />} />
          <Route path="/admin/marketplaces/amazon" element={<AmazonSetup />} />
          <Route path="/admin/marketplaces/shopee" element={<ShopeeSetup />} />
          <Route path="/admin/marketplaces/mercadolivre" element={<MercadoLivreSetup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
