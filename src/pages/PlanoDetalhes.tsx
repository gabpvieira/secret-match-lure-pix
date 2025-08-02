import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';

const PlanoDetalhes: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Configuração dos planos
  const planConfig = {
    'espiadinha': {
      name: 'Espiadinha Básica',
      price: 'R$ 19,90',
      description: 'Acesso básico aos matches',
      features: [
        'Ver quem te curtiu',
        'Fotos sem censura',
        'Chat liberado por 24h'
      ],
      checkoutUrl: 'https://www.ggcheckout.com/checkout/v2/sCpufru9Swlb8JHOKYSh',
      color: 'from-blue-500 to-blue-600'
    },
    'conversaquente': {
      name: 'Conversa Quente + Galeria',
      price: 'R$ 39,90',
      description: 'Acesso completo + galeria',
      features: [
        'Tudo do plano anterior',
        'Galeria completa desbloqueada',
        'Chat ilimitado',
        'Fotos íntimas exclusivas'
      ],
      checkoutUrl: 'https://www.ggcheckout.com/checkout/v2/Rm6m8FX3P0gnfn02pEyM',
      color: 'from-red-500 to-red-600'
    },
    'vipzao': {
      name: 'Acesso Total VIP',
      price: 'R$ 59,90',
      description: 'Experiência premium completa',
      features: [
        'Tudo dos planos anteriores',
        'Vídeos íntimos exclusivos',
        'Chamada de vídeo liberada',
        'Conteúdo VIP atualizado diariamente'
      ],
      checkoutUrl: 'https://www.ggcheckout.com/checkout/v2/XW9SfWHflnGXJsi16gBq',
      color: 'from-purple-500 to-purple-600'
    }
  };

  const currentPlan = slug ? planConfig[slug as keyof typeof planConfig] : null;

  const handleProceedToCheckout = () => {
    if (currentPlan?.checkoutUrl) {
      window.open(currentPlan.checkoutUrl, '_blank');
    }
  };

  const handleGoBack = () => {
    navigate('/checkout');
  };

  // Redirecionar automaticamente após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      handleProceedToCheckout();
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentPlan]);

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Plano não encontrado</h2>
            <Button onClick={handleGoBack} variant="outline">
              Voltar aos Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="modern-card">
          <CardHeader className="text-center p-6">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${currentPlan.color} flex items-center justify-center mb-4`}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl gradient-text mb-2">
              {currentPlan.name}
            </CardTitle>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              {currentPlan.price}
            </div>
            <p className="text-muted-foreground">{currentPlan.description}</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-subheading mb-4">O que está incluído:</h3>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-body">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                <Clock className="w-4 h-4" />
                <span>Redirecionamento automático em 10 segundos...</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleProceedToCheckout}
                className="w-full professional-button text-lg py-4 font-bold"
                size="lg"
              >
                Prosseguir para Pagamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                Voltar aos Planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanoDetalhes;