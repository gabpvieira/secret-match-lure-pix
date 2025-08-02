import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Gift, Shield, Star } from "lucide-react";

interface CheckoutProps {
  onPurchase: (plan: string) => void;
}

export const Checkout = ({ onPurchase }: CheckoutProps) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const plans = [
    {
      id: "basic",
      name: "Acesso rápido",
      price: "R$9,90",
      description: "Veja agora o que ela já separou pra você",
      features: ["Acesso imediato a fotos", "Visualização rápida", "Sem enrolação"]
    },
    {
      id: "premium",
      name: "Acesso completo + conversa",
      price: "R$29,90",
      description: "Desbloqueie tudo e comece a conversar sem limites",
      features: ["Fotos + Chat liberado", "Converse com quem quiser", "Prioridade no suporte"],
      popular: true
    },
    {
      id: "vip",
      name: "VIP vitalício com conteúdos extras",
      price: "R$49,90",
      description: "Acesso vitalício + conteúdos secretos e exclusivos",
      features: ["Acesso vitalício", "Conteúdos extras", "Bônus exclusivos", "Suporte VIP"]
    }
  ];

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-3 sm:mb-4 leading-tight px-2 text-heading">
            Ela já mandou a primeira… falta só você liberar.
          </h1>
          
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 mx-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-red-400 font-semibold text-sm sm:text-base">Oferta expira em:</span>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-bold text-red-400">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-body">
            Você tem 9 minutos antes que seu acesso expire.
          </p>
        </div>

        {/* Bonus Section */}
        <Card className="modern-card mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-secondary" />
              <CardTitle className="text-xl gradient-text text-subheading">
                BÔNUS Método Rei do Match™
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-subheading">Quer sair do vácuo e entrar no jogo de verdade?</h3>
              </div>
              <p className="text-muted-foreground text-body">
                Ganhe o pacote secreto pra virar mestre da conquista digital em 7 dias.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                100 mensagens que deixam ela curiosa e molhada de vontade
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Frases de abertura que geram resposta imediata
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Guia rápido de como chamar atenção sem ser bonito ou rico
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Estratégias pra transformar o 1º encontro num final feliz
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2 text-caption">
              <Gift className="w-3 h-3" />
              <span>Incluído automaticamente após qualquer plano</span>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`modern-card relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-xs sm:text-sm">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg text-subheading">{plan.name}</CardTitle>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{plan.price}</div>
                <p className="text-xs sm:text-sm text-muted-foreground text-body">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-body">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => onPurchase(plan.id)}
                  className={`w-full text-sm sm:text-base min-h-[48px] touch-manipulation professional-button ${plan.popular ? 'bg-gradient-to-r from-primary via-accent to-secondary' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-caption">
            <Shield className="w-4 h-4 text-green-400" />
            <p>Pagamento 100% seguro • Acesso imediato após confirmação</p>
          </div>
        </div>
      </div>
    </div>
  );
};