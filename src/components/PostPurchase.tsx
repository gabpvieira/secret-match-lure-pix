import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Gift, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostPurchaseProps {
  plan: string;
}

export const PostPurchase = ({ plan }: PostPurchaseProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Simular recebimento de mensagem após 3 minutos
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 3 segundos para demo

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] py-4 sm:py-6 md:py-8">
      <div className="container-mobile max-w-2xl">
        {/* Confirmação de Pagamento */}
        <Card className="modern-card mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400" />
            </div>
            <CardTitle className="text-fluid-lg sm:text-fluid-xl md:text-fluid-2xl gradient-text text-heading">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-4 sm:p-6">
            <p className="text-muted-foreground mb-3 sm:mb-4 text-fluid-sm sm:text-fluid-base text-body">
              Sua confirmação foi processada.<br />
              Aguardando a próxima mensagem dela...
            </p>
            <div className="flex items-center justify-center gap-2 text-fluid-xs sm:text-fluid-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Plano {plan === 'basic' ? 'Inicial' : plan === 'premium' ? 'Intermediário' : 'Vitalício'} ativado
            </div>
          </CardContent>
        </Card>

        {/* Bônus Liberado */}
        <Card className="modern-card mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              <CardTitle className="gradient-text text-subheading text-fluid-base sm:text-fluid-lg">Seu Bônus Foi Liberado!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="font-semibold text-fluid-sm sm:text-fluid-base md:text-fluid-lg text-subheading">Método Conexão Eficiente™</h3>
              </div>
              <p className="text-fluid-xs sm:text-fluid-sm text-muted-foreground mb-3 sm:mb-4 text-body">
                Estratégias práticas para melhorar sua comunicação e aumentar sua presença digital
              </p>
              
              <div className="grid gap-1 sm:gap-2 text-fluid-xs sm:text-fluid-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  100 Mensagens prontas para interação inicial
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  Guia rápido de presença digital e engajamento
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  50 frases de abordagem para redes sociais
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  Checklist para primeiros encontros de qualidade
                </div>
              </div>
              
              <Button className="w-full professional-button text-fluid-xs sm:text-fluid-sm min-h-[44px] sm:min-h-[48px] touch-manipulation" variant="secondary">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Baixar Conteúdo Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem Simulada */}
        {showMessage && (
          <Card className="modern-card border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" 
                    alt="Thaís G." 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-subheading text-fluid-sm sm:text-fluid-base">Thaís G.</h4>
                    <span className="text-fluid-xs text-green-400 font-medium">Online agora</span>
                  </div>
                  <p className="text-fluid-xs sm:text-fluid-sm text-muted-foreground mb-3 text-body">
                    "Oi! Vi que você tem um perfil interessante... que tal conversarmos? 😉"
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="professional-button text-fluid-xs min-h-[36px] sm:min-h-[40px] touch-manipulation">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Responder
                    </Button>
                    <Button size="sm" variant="outline" className="border-secondary/30 text-fluid-xs min-h-[36px] sm:min-h-[40px] touch-manipulation">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Curtir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};