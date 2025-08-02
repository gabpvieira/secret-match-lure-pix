import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AmbienteSeguro } from "./pages/AmbienteSeguro";
import { MatchSecreto } from "./pages/MatchSecreto";
import CurtirPerfis from "./pages/CurtirPerfis";
import AnaliseMatches from "./pages/AnaliseMatches";
import { Checkout } from "./components/Checkout";
import { AcessoPremiumLiberado } from "./pages/AcessoPremiumLiberado";
import PlanoDetalhes from "./pages/PlanoDetalhes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ambiente-seguro" element={<AmbienteSeguro />} />
          <Route path="/match-secreto" element={<MatchSecreto />} />
          <Route path="/curtir" element={<CurtirPerfis />} />
          <Route path="/final" element={<AnaliseMatches />} />
          <Route path="/analise-matches" element={<AnaliseMatches />} />
          <Route path="/checkout" element={<Checkout onPurchase={(plan) => console.log('Plano selecionado:', plan)} />} />
          <Route path="/plano/:slug" element={<PlanoDetalhes />} />
          <Route path="/acesso-premium-liberado" element={<AcessoPremiumLiberado />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
