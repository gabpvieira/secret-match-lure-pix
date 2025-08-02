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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Confirmação de Pagamento */}
        <Card className="modern-card mb-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl gradient-text text-heading">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4 text-body">
              Sua confirmação foi processada.<br />
              Aguardando a próxima mensagem dela...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Plano {plan === 'basic' ? 'Inicial' : plan === 'premium' ? 'Intermediário' : 'Vitalício'} ativado
            </div>
          </CardContent>
        </Card>

        {/* Bônus Liberado */}
        <Card className="modern-card mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-secondary" />
              <CardTitle className="gradient-text text-subheading">Seu Bônus Foi Liberado!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-lg text-subheading">Método Conexão Eficiente™</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-body">
                Estratégias práticas para melhorar sua comunicação e aumentar sua presença digital
              </p>
              
              <div className="grid gap-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  100 Mensagens prontas para interação inicial
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Guia rápido de presença digital e engajamento
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  50 frases de abordagem para redes sociais
                </div>
                <div className="flex items-center gap-2 text-body">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Checklist para primeiros encontros de qualidade
                </div>
              </div>
              
              <Button className="w-full professional-button" variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Baixar Conteúdo Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulação de Mensagem */}
        {showMessage && (
          <Card className="modern-card animate-in slide-in-from-bottom-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">TG</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-subheading">Thaís G.</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-muted-foreground text-caption">Online</span>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-body">
                      Oi... gostei de você. Posso te mostrar mais, se você for discreto
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground text-caption">Agora mesmo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};