import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const AcessoPremiumLiberado = () => {
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(119); // 1:59 in seconds
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const planoParam = searchParams.get('plano');
  
  const phrases = [
    "Verificando presença dela...",
    "Validando conteúdo exclusivo…",
    "Aguardando sua liberação final…"
  ];
  
  const getPlanName = (plano: string | null) => {
    switch (plano) {
      case 'espiadinha':
        return 'Espiadinha Proibida';
      case 'conversaquente':
        return 'Conversa Quente + Galeria';
      case 'vipzao':
        return 'Acesso Total VIP';
      default:
        return 'Premium';
    }
  };
  
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
  
  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 2000);
    
    return () => clearInterval(phraseTimer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleLiberar = () => {
    // Aqui você pode adicionar a lógica de liberação do acesso
    console.log('Liberando acesso premium...');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline Principal */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 leading-tight">
          ✅ Plano "{getPlanName(planoParam)}" ativado com sucesso!
        </h1>
        
        {/* Subheadline */}
        <h2 className="text-lg sm:text-xl font-semibold text-red-400 mb-8 px-4">
          "Ela já te mandou algo...<br />
          Mas precisa da tua confirmação final pra continuar."
        </h2>
        
        {/* Timer de Urgência */}
        <div className="bg-[#FF0033] border border-red-600 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-xl">
              {formatTime(timeLeft)}
            </span>
          </div>
          <p className="text-white font-medium text-lg animate-pulse">
            {phrases[currentPhrase]}
          </p>
        </div>
        
        {/* Botão Principal */}
        <div className="mb-6">
          <Button 
            onClick={handleLiberar}
            className="w-full max-w-md mx-auto text-lg font-bold py-6 px-8 bg-gradient-to-r from-primary via-accent to-secondary hover:scale-105 transition-transform duration-200"
            size="lg"
          >
            LIBERAR ACESSO PREMIUM AGORA
          </Button>
        </div>
        
        {/* Subtexto */}
        <p className="text-muted-foreground text-sm font-medium">
          Discreto. Imediato. Só você vai ver.
        </p>
      </div>
    </div>
  );
};