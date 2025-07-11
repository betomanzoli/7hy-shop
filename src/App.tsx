
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Amazon from "./pages/marketplace/Amazon";
import Shopee from "./pages/marketplace/Shopee";
import MercadoLivre from "./pages/marketplace/MercadoLivre";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Marketplaces from "./pages/admin/marketplaces/Marketplaces";
import AmazonSetup from "./pages/admin/marketplaces/AmazonSetup";
import ShopeeSetup from "./pages/admin/marketplaces/ShopeeSetup";
import ProductsPage from "./pages/admin/products/ProductsPage";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import AffiliateAnalytics from "./pages/admin/analytics/AffiliateAnalytics";
import Cart from "./pages/Cart";
import ManageProducts from "./pages/admin/products/ManageProducts";
import CustomerSuggestions from "./pages/admin/products/CustomerSuggestions";
import Tools from "./pages/Tools";
import PromoLanding from "./pages/PromoLanding";
import NewProductPage from "./pages/admin/products/NewProductPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Front-end Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/amazon" element={<Amazon />} />
          <Route path="/shopee" element={<Shopee />} />
          <Route path="/mercadolivre" element={<MercadoLivre />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* New Promo Landing Page */}
          <Route path="/promo" element={<PromoLanding />} />
          
          {/* Admin Pages */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/marketplaces" element={<Marketplaces />} />
          <Route path="/admin/marketplaces/amazon" element={<AmazonSetup />} />
          <Route path="/admin/marketplaces/shopee" element={<ShopeeSetup />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/products/manage" element={<ManageProducts />} />
          <Route path="/admin/products/new" element={<NewProductPage />} />
          <Route path="/admin/products/suggestions" element={<CustomerSuggestions />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/analytics" element={<AffiliateAnalytics />} />
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
