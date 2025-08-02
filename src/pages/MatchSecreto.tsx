import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileOnboarding from "@/components/ProfileOnboarding";
import { Eye, Users, Heart } from "lucide-react";

export const MatchSecreto = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartProfile = () => {
    setShowOnboarding(true);
  };

  const handleProfileComplete = (profileData: any) => {
    console.log('Perfil criado:', profileData);
    // Redirecionar para a página de curtir perfis
    window.location.href = '/curtir';
  };

  if (showOnboarding) {
    return <ProfileOnboarding onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-black flex items-center justify-center px-4 sm:px-6 md:px-8 py-8">
      <div className="w-full max-w-2xl">
        <Card className="modern-card border-red-500/20 bg-black/60 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            {/* Ícones decorativos */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              </div>
            </div>
            
            {/* Headline Principal */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="font-playfair bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Você foi notado...
              </span>
              <br />
              <span className="text-heading text-white mt-2 block">
                Mulheres perto de você estão curiosas 😈
              </span>
            </h1>
            
            {/* Subheadline Emocional */}
            <p className="text-lg sm:text-xl md:text-2xl text-body text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
              Participe da rede privada onde homens comuns recebem atenção incomum.
            </p>
            
            {/* Elementos de Prova Social */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-sm">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                <div className="text-red-400 font-bold text-base sm:text-lg">2.847</div>
                <div className="text-gray-400 text-xs sm:text-sm">Homens ativos hoje</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 sm:p-4">
                <div className="text-purple-400 font-bold text-base sm:text-lg">156</div>
                <div className="text-gray-400 text-xs sm:text-sm">Matches nas últimas 24h</div>
              </div>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 sm:p-4">
                <div className="text-pink-400 font-bold text-base sm:text-lg">89%</div>
                <div className="text-gray-400 text-xs sm:text-sm">Taxa de sucesso</div>
              </div>
            </div>
            
            {/* CTA Principal */}
            <Button 
              onClick={handleStartProfile}
              className="w-full professional-button text-lg sm:text-xl py-4 sm:py-6 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 shadow-2xl shadow-red-500/25 touch-manipulation font-semibold"
              size="lg"
            >
              INICIAR AGORA
            </Button>
            
            {/* Disclaimer de Privacidade */}
            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 text-caption px-2">
              🔒 Seus dados são protegidos e nunca compartilhados publicamente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};