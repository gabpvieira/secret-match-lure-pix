import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Shield, Eye, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { city, loading: locationLoading } = useGeolocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-4 sm:pt-8 md:pt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
        <div className="relative container-mobile py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <Badge className="mb-3 sm:mb-4 md:mb-6 text-fluid-xs" variant="outline">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {locationLoading ? 'Detectando localização...' : `Online em ${city}`}
            </Badge>
            
            <h1 className="text-fluid-3xl sm:text-fluid-4xl md:text-fluid-5xl text-heading gradient-text mb-3 sm:mb-4 md:mb-6 leading-tight px-2 flex items-center justify-center flex-wrap gap-2">
              Comece sua experiência e veja quem pode ser o seu próximo match.
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent animate-pulse flex-shrink-0" />
            </h1>
            
            <h2 className="text-fluid-lg sm:text-fluid-xl md:text-fluid-2xl text-subheading mb-2 sm:mb-3 md:mb-4 px-2">
              Você foi convidado para acessar perfis próximos com base no seu perfil
            </h2>
            
            <p className="text-fluid-sm sm:text-fluid-base text-body text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Ative seu acesso e descubra quem está disponível na sua região. 
              Conexões reais com pessoas que compartilham seus interesses.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/ambiente-seguro')}
              className="professional-button text-fluid-base sm:text-fluid-lg text-caption px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto max-w-sm mx-auto touch-manipulation font-semibold"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              INICIAR AGORA
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container-mobile">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-primary mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">Perfis Verificados</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Todos os perfis são verificados para garantir autenticidade e segurança
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-accent mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">Localização Precisa</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Encontre pessoas próximas com base na sua localização atual
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-secondary mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">100% Discreto</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Sua privacidade é nossa prioridade. Interações seguras e confidenciais
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing */}
      <div className="pb-6 sm:pb-8 md:pb-12"></div>
    </div>
  );
};

export default Index;
