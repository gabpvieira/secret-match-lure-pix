import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Gift, Shield, Star, Flame, MessageCircle, Brain, Bolt, Eye, Lock, Zap } from "lucide-react";

interface CheckoutProps {
  onPurchase: (plan: string) => void;
}

interface Notification {
  id: number;
  name: string;
  plan: string;
  timestamp: number;
}

export const Checkout = ({ onPurchase }: CheckoutProps) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(8 * 60); // 8:00 minutes in seconds
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const maleNames = [
    "Carlos", "Rafael", "Bruno", "Diego", "Lucas", "Felipe", "André", "Thiago",
    "Rodrigo", "Marcelo", "Gabriel", "Leonardo", "Gustavo", "Fernando", "Ricardo",
    "Eduardo", "Vinicius", "Matheus", "João", "Pedro", "Daniel", "Renato", "Fabio",
    "Alexandre", "Leandro", "Henrique", "Caio", "Igor", "Julio", "Sergio"
  ];
  
  const planNames = [
    "Espiadinha Proibida", "Conversa Quente + Galeria", "Acesso VIP + Conteúdo Secreto"
  ];

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

  // Disparar evento do Facebook Pixel quando a página de planos for visualizada
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).dispararVisualizouPlanos) {
      (window as any).dispararVisualizouPlanos();
    }
  }, []);

  // Notification system
  useEffect(() => {
    const generateNotification = () => {
      const randomName = maleNames[Math.floor(Math.random() * maleNames.length)];
      const randomPlan = planNames[Math.floor(Math.random() * planNames.length)];
      
      const newNotification: Notification = {
        id: Date.now(),
        name: randomName,
        plan: randomPlan,
        timestamp: Date.now()
      };
      
      // Play notification sound
      try {
        const audio = new Audio('/like.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (error) {
        console.log('Audio not available');
      }
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        // Keep only last 3 notifications
        return updated.slice(0, 3);
      });
      
      // Remove notification after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 6000);
    };
    
    // Generate first notification after 2 seconds
    const initialTimeout = setTimeout(generateNotification, 2000);
    
    // Then generate every 4 seconds
    const notificationInterval = setInterval(generateNotification, 4000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(notificationInterval);
    };
  }, [maleNames, planNames]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePurchase = (planId: string) => {
    // Redirecionar para a página específica do plano
    navigate(`/checkout/${planId}`);
  };



  const plans = [
    {
      id: "espiadinha",
      name: "Espiadinha Básica",
      price: "R$ 9,90",
      description: "Acesso básico aos matches",
      features: [
        "Ver quem te curtiu",
        "Fotos sem censura",
        "Chat liberado por 24h"
      ],
      buttonText: "Espiar Agora"
    },
    {
      id: "conversaquente",
      name: "Conversa Quente + Galeria",
      price: "R$ 29,90",
      description: "Acesso completo + galeria",
      features: [
        "Tudo do plano anterior",
        "Galeria completa desbloqueada",
        "Chat ilimitado",
        "Fotos íntimas exclusivas"
      ],
      popular: true,
      buttonText: "Liberar Tudo"
    },
    {
      id: "vipzao",
      name: "Acesso Total VIP",
      price: "R$ 49,90",
      description: "Experiência premium completa",
      features: [
        "Tudo dos planos anteriores",
        "Vídeos íntimos exclusivos",
        "Chamada de vídeo liberada",
        "Conteúdo VIP atualizado diariamente"
      ],
      buttonText: "Virar VIP"
    }
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] py-4 sm:py-6 md:py-8">
      <div className="container-mobile">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          {/* Logo */}
          <div className="mb-4 sm:mb-6">
            <img 
              src="https://i.postimg.cc/85LBXJdp/LOGO-PNG-MATCH-SECRETO.png" 
              alt="Match Secreto Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
            />
          </div>
          <h1 className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl font-bold gradient-text mb-3 sm:mb-4 leading-tight px-2 text-heading">
            Ela já se abriu... agora é tua vez de mostrar que veio.
          </h1>
          <p className="text-fluid-xl sm:text-fluid-2xl font-semibold text-red-400 mb-4 sm:mb-6 px-2">
            A próxima foto some em minutos... se você não liberar agora.
          </p>
          
          <div className="bg-[#FF0033] border border-red-600 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 shadow-lg">
            <div className="text-center">
              <p className="text-white font-bold text-fluid-base sm:text-fluid-lg mb-2">Você tem {formatTime(timeLeft)} pra provar que não é só mais um curioso.</p>
              <div className="text-center">
                <span className="text-fluid-3xl sm:text-fluid-4xl font-bold text-white">
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section - Redesigned */}
        <div className="relative mb-4 sm:mb-6 md:mb-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-pulse opacity-20 rounded-2xl"></div>
          
          <Card className="relative border-4 border-transparent bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-red-900/40 backdrop-blur-sm rounded-2xl shadow-2xl">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl opacity-75 blur-sm"></div>
            <div className="absolute inset-[2px] bg-black/90 rounded-2xl"></div>
            
            <div className="relative z-10">
              <CardHeader className="text-center p-4 sm:p-6 md:p-8">
                {/* Title with enhanced styling */}
                <div className="mb-6">
                  <div className="text-xs sm:text-sm font-bold text-yellow-400 mb-2 tracking-widest uppercase">
                    BÔNUS EXCLUSIVO
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                    MÉTODO REI DO MATCH™
                  </CardTitle>
                  <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
                </div>
                
                {/* Subtitle with glow effect */}
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 drop-shadow-lg">
                  <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                    O pacote secreto que transforma
                  </span>
                  <br />
                  <span className="text-yellow-400 animate-pulse">
                    conversa fiada em nude enviado!
                  </span>
                </p>
                
                {/* Mockup Image - Original size, responsive */}
                <div className="mb-6">
                  <img 
                    src="https://i.postimg.cc/8cMkxvtC/MOCKUP-REI-DO-MATCH.png" 
                    alt="Mockup Rei do Match" 
                    className="w-full h-auto max-w-full object-contain" 
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Features with professional icons */}
                <div className="grid gap-4 mb-6">
                  <div className="flex items-start gap-4 p-3 bg-black rounded-lg border border-red-500">
                    <div className="bg-red-500 p-2 rounded-full shadow-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      100 mensagens que acendem ela no papo e molham no privado
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-black rounded-lg border border-red-500">
                    <div className="bg-red-500 p-2 rounded-full shadow-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      Como prender atenção sem ter beleza, dinheiro ou perfil top
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-black rounded-lg border border-red-500">
                    <div className="bg-red-500 p-2 rounded-full shadow-lg">
                      <Bolt className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      Frases que forçam resposta em menos de 1 minuto
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-black rounded-lg border border-red-500">
                    <div className="bg-red-500 p-2 rounded-full shadow-lg">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      Estratégia ninja pra sair do chat direto pro motel
                    </span>
                  </div>
                </div>
                
                {/* Call to action with enhanced styling */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-xl border-2 border-yellow-400/50 shadow-2xl">
                    <div className="flex items-center justify-center gap-3 text-black font-black text-sm sm:text-base">
                      <Lock className="w-6 h-6 animate-bounce" />
                      <span className="uppercase tracking-wide">
                        Liberado automaticamente após qualquer plano
                      </span>
                      <Zap className="w-6 h-6 animate-bounce" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Plans */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            // Definir estilos específicos para cada plano
            let cardStyles = '';
            let badgeStyles = '';
            let buttonStyles = '';
            
            if (plan.id === 'espiadinha') {
              cardStyles = 'border-2 border-gray-500/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30';
              badgeStyles = 'bg-gray-600';
              buttonStyles = 'bg-gray-600 hover:bg-gray-500 border-gray-500';
            } else if (plan.id === 'conversaquente') {
              cardStyles = 'border-2 border-red-500 bg-gradient-to-br from-red-950/40 to-red-900/40 shadow-lg shadow-red-500/25 ring-2 ring-red-500/50';
              badgeStyles = 'bg-red-600 shadow-lg shadow-red-500/50';
              buttonStyles = 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/30';
            } else if (plan.id === 'vipzao') {
              cardStyles = 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 shadow-lg shadow-yellow-500/25 ring-2 ring-yellow-500/50';
              badgeStyles = 'bg-yellow-600 shadow-lg shadow-yellow-500/50';
              buttonStyles = 'bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 shadow-lg shadow-yellow-500/30 text-black font-bold';
            }
            
            return (
              <Card key={plan.id} className={`modern-card relative w-full sm:w-72 ${cardStyles}`}>
                {plan.popular && (
                   <Badge className={`absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 text-fluid-xs sm:text-fluid-sm px-3 py-1 ${badgeStyles}`}>
                     Mais Vendido
                   </Badge>
                 )}
                
                <CardHeader className="text-center p-4 sm:p-5">
                  <CardTitle className="text-fluid-base sm:text-fluid-lg md:text-fluid-xl text-subheading font-bold">{plan.name}</CardTitle>
                  <div className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl font-bold gradient-text">{plan.price}</div>
                  <p className="text-fluid-sm sm:text-fluid-base text-muted-foreground text-body">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-5">
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-fluid-sm sm:text-fluid-base text-body">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-500" />
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handlePurchase(plan.id)}
                    className={`w-full text-fluid-base sm:text-fluid-lg min-h-[48px] sm:min-h-[52px] touch-manipulation font-bold ${buttonStyles}`}
                  >
                    {plan.buttonText || "Escolher Plano"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-6 sm:mt-8 text-fluid-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-caption">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <p className="font-semibold text-white text-fluid-xs sm:text-fluid-sm">Pagamento discreto, acesso instantâneo, prazer garantido.</p>
          </div>
          <p className="text-red-400 font-bold mt-2 text-fluid-sm sm:text-fluid-base">Ela já tá pronta... só falta você.</p>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 z-50 space-y-1 sm:space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-lg shadow-lg border border-orange-400 animate-in slide-in-from-left-5 duration-500 max-w-[280px] sm:max-w-xs"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
              <div className="text-fluid-xs sm:text-fluid-sm">
                <span className="font-semibold">{notification.name}</span>
                <span className="text-orange-100"> acabou de comprar </span>
                <span className="font-medium">{notification.plan}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};