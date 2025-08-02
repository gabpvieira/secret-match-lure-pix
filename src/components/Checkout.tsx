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
      name: "ESPIADINHA PROIBIDA",
      price: "R$9,90",
      description: "Só o básico... mas já é o suficiente pra subir o sangue.",
      features: ["Veja o que ela separou só pra você", "Acesso direto às fotos liberadas", "Visualização rápida sem enrolação"],
      buttonText: "QUERO DAR UMA ESPIADA 👀"
    },
    {
      id: "premium",
      name: "CONVERSA QUENTE + GALERIA LIBERADA",
      price: "R$29,90",
      description: "Ela quer falar com você. Mas só com quem desbloqueia tudo.",
      features: ["Fotos privadas + chat sem limites", "Converse com quem quiser, na hora", "Receba atenção antes dos outros"],
      popular: true,
      buttonText: "BORA TROCAR IDEIA SUJA 🔥"
    },
    {
      id: "vip",
      name: "ACESSO TOTAL + CONTEÚDO SAFADO VIP",
      price: "R$49,90",
      description: "Desbloqueia tudo. Ela vai te mandar o que ninguém mais vê.",
      features: ["Acesso vitalício sem bloqueios", "Conteúdos secretos só pros VIPs", "Surpresas íntimas exclusivas"],
      buttonText: "QUERO TUDO. TUDO MESMO 😈"
    }
  ];

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-3 sm:mb-4 leading-tight px-2 text-heading">
            Ela já se abriu... agora é tua vez de mostrar que veio.
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-red-400 mb-6 px-2">
            A próxima foto some em minutos... se você não liberar agora.
          </p>
          
          <div className="bg-[#FF0033] border border-red-600 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 mx-2 shadow-lg">
            <div className="text-center">
              <p className="text-white font-bold text-lg sm:text-xl mb-2">🔥 Você tem {formatTime(timeLeft)} pra provar que não é só mais um curioso.</p>
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        <Card className="modern-card mb-8 border-2 border-red-500/30 bg-gradient-to-br from-red-950/20 to-black/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">💣</span>
              <CardTitle className="text-xl sm:text-2xl font-bold gradient-text text-subheading">
                BÔNUS: Método Rei do Match™
              </CardTitle>
            </div>
            <p className="text-lg font-semibold text-red-400 mt-2">
              O pacote secreto que transforma conversa fiada em nude enviado.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✅</span>
                <span className="font-medium">100 mensagens que acendem ela no papo e molham no privado</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✅</span>
                <span className="font-medium">Como prender atenção sem ter beleza, dinheiro ou perfil top</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✅</span>
                <span className="font-medium">Frases que forçam resposta em menos de 1 minuto</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✅</span>
                <span className="font-medium">Estratégia ninja pra sair do chat direto pro motel</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-400 mt-4 font-semibold bg-black/30 rounded-lg p-3">
              <span className="text-lg">🔐</span>
              <span>Liberado automaticamente após qualquer plano</span>
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
                  className={`w-full text-sm sm:text-base min-h-[48px] touch-manipulation professional-button font-bold ${plan.popular ? 'bg-gradient-to-r from-primary via-accent to-secondary' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText || "Escolher Plano"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-caption">
            <Shield className="w-4 h-4 text-green-400" />
            <p className="font-semibold text-white">Pagamento discreto, acesso instantâneo, prazer garantido.</p>
          </div>
          <p className="text-red-400 font-bold mt-2 text-base">Ela já tá pronta... só falta você.</p>
        </div>
      </div>
    </div>
  );
};