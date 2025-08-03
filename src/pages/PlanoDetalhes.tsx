import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, ArrowRight, Clock, ChevronDown, Lock, CreditCard, Zap, Shield, Eye } from 'lucide-react';

const PlanoDetalhes: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Configuração dos planos
  const planConfig = {
    'espiadinha': {
      name: 'Espiadinha Básica',
      price: 'R$ 9,90',
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
      price: 'R$ 29,90',
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
      price: 'R$ 49,90',
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
      if (currentPlan?.checkoutUrl) {
        window.open(currentPlan.checkoutUrl, '_blank');
      }
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/50">
          <CardHeader className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-800/50 to-transparent">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r ${currentPlan.color} flex items-center justify-center mb-4 sm:mb-6 overflow-hidden shadow-lg shadow-black/30 ring-2 ring-red-400/30`}>
              <img 
                src="https://i.postimg.cc/KvHHkWNt/LOGO-MATCH-SCRETO-ORIGINAL.png" 
                alt="Match Secreto" 
                className="w-full h-full object-cover" 
              />
            </div>
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl gradient-text mb-2 sm:mb-3 font-bold">
              {currentPlan.name}
            </CardTitle>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-400 mb-2 sm:mb-3 drop-shadow-lg">
              {currentPlan.price}
            </div>
            <p className="text-gray-300 text-base sm:text-lg">{currentPlan.description}</p>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                 <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                 <h3 className="text-lg sm:text-xl font-bold text-white">O que está incluído:</h3>
               </div>
              <ul className="space-y-3 sm:space-y-4">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 sm:gap-4 text-gray-200 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-sm sm:text-base font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-xl p-4 sm:p-5 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-2 sm:gap-3 text-red-300 text-sm sm:text-base font-bold mb-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-red-400" />
                <span className="text-center sm:text-left">Redirecionamento automático em 10 segundos...</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-300 text-xs sm:text-sm">
                 <div className="flex items-center justify-center sm:justify-start gap-2 bg-gray-800/40 p-2 rounded-lg">
                   <Shield className="w-4 h-4 text-red-400" />
                   <span>Acesso sigiloso</span>
                 </div>
                 <div className="flex items-center justify-center sm:justify-start gap-2 bg-gray-800/40 p-2 rounded-lg">
                   <CreditCard className="w-4 h-4 text-red-400" />
                   <span>Cobrança discreta</span>
                 </div>
                 <div className="flex items-center justify-center sm:justify-start gap-2 bg-gray-800/40 p-2 rounded-lg">
                   <Eye className="w-4 h-4 text-red-400" />
                   <span>Visualização imediata</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg sm:text-xl py-4 sm:py-6 font-bold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105"
                size="lg"
              >
                DESBLOQUEAR AGORA
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 text-white" />
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full border-red-600/50 text-red-300 hover:bg-red-900/20 hover:text-red-200 hover:border-red-500 py-3 sm:py-4 rounded-xl transition-all duration-300"
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