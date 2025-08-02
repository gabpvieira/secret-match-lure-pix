import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = [
    "Ela viu seu perfil... e parou por alguns segundos 👀",
    "Buscando perfis femininos que curtiram sua vibe…",
    "Analisando compatibilidades com alto desejo de resposta…",
    "3 mulheres online agora com interesse no seu tipo…",
    "Conexões reais encontradas. Validando intenção…"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 180); // Duração total de ~18 segundos

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000); // Troca a cada 3 segundos

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md modern-card">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-heading">
            Analisando seu perfil...
          </h2>
          
          <p className="text-muted-foreground mb-6 text-body transition-opacity duration-500 ease-in-out">
            {messages[currentMessage]}
          </p>
          
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-caption">
            {progress}% concluído
          </p>
        </CardContent>
      </Card>
    </div>
  );
};