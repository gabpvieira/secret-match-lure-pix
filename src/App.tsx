import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Checkout from "./components/Checkout";
import PlanCheckout from "./components/PlanCheckout";
import AmbienteSeguro from "./pages/AmbienteSeguro";
import MatchSecreto from "./pages/MatchSecreto";
import CurtirPerfis from "./pages/CurtirPerfis";
import AnaliseMatches from "./pages/AnaliseMatches";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/ambiente-seguro" replace />} />
          <Route path="/ambiente-seguro" element={<AmbienteSeguro />} />
          <Route path="/match-secreto" element={<MatchSecreto />} />
          <Route path="/curtir" element={<CurtirPerfis />} />
          <Route path="/analise-matches" element={<AnaliseMatches />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:planId" element={<PlanCheckout />} />
          <Route path="/plano/:slug" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
