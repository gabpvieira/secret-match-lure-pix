import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom CSS for scan animations
const scanStyles = `
  @keyframes scanLine {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  
  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .scan-line {
    animation: scanLine 2s infinite;
  }
  
  .radar-sweep {
    animation: radarSweep 3s linear infinite;
  }
`;

interface Match {
  id: number;
  name: string;
  age: number;
  photo: string;
  compatibility: number;
}

const AnaliseMatches: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const navigate = useNavigate();

  // Carregar foto do usuário do localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      setUserPhoto(profile.photoUrl || '');
    }
  }, []);

  const analysisSteps = [
    'Analisando seu perfil...',
    'Buscando compatibilidades...',
    'Calculando afinidades...',
    'Encontrando matches perfeitos...'
  ];

  const mockMatches: Match[] = [
    {
      id: 1,
      name: 'Ana',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      compatibility: 95
    },
    {
      id: 2,
      name: 'Beatriz',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      compatibility: 89
    },
    {
      id: 3,
      name: 'Carla',
      age: 23,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      compatibility: 92
    }
  ];

  useEffect(() => {
    // Simular análise por 20 segundos
    const analysisTimer = setTimeout(() => {
      setIsAnalyzing(false);
      setMatches(mockMatches);
      
      // Mostrar resultados após 2 segundos
      setTimeout(() => setShowResults(true), 2000);
      
      // Mostrar oferta após 5 segundos
      setTimeout(() => setShowOffer(true), 5000);
    }, 20000);

    // Atualizar texto da análise a cada 5 segundos
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 5000);

    return () => {
      clearTimeout(analysisTimer);
      clearInterval(stepTimer);
    };
  }, []);

  const handleContinue = () => {
    // Redirecionar para página principal ou checkout
    navigate('/');
  };

  const handleUpgrade = () => {
    // Redirecionar para checkout Premium
    navigate('/checkout');
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <style>{scanStyles}</style>
        <div className="text-center max-w-md mx-auto">
          {/* Loading Animation with User Photo */}
          <div className="relative mb-8">
            <div className="w-40 h-40 mx-auto relative">
              {/* User Photo */}
              <div className="absolute inset-4 rounded-full overflow-hidden bg-gray-800 border-4 border-white/30 shadow-2xl">
                <img 
                  src={userPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} 
                  alt="Seu perfil"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Scanning Animation */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 rounded-full border-3 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '1s' }}></div>
              
              {/* Radar Sweep Effect */}
               <div className="absolute inset-0 rounded-full overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/30 to-transparent radar-sweep" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 50%)' }}></div>
               </div>
               
               {/* Vertical Scan Line */}
               <div className="absolute inset-4 rounded-full overflow-hidden">
                 <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line" style={{ top: '50%', left: '0' }}></div>
               </div>
              
              {/* Pulse Rings */}
              <div className="absolute inset-0 border-2 border-green-400/40 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
              
              {/* Corner Scan Lines */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-400 animate-pulse"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-400 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>

          {/* Analysis Text */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Analisando seu perfil...
          </h1>
          
          <p className="text-gray-300 mb-6 transition-all duration-500">
            {analysisSteps[currentStep]}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-red-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((Date.now() % 20000) / 20000) * 100}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-400">
            Aguarde enquanto encontramos seus matches perfeitos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* User Photo in Results */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-green-400 to-blue-500 shadow-xl">
              <img 
                src={userPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} 
                alt="Seu perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            {/* Success Badge */}
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold border-2 border-white">
              ✓ ANALISADO
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            🎉 Análise Completa!
          </h1>
          <p className="text-gray-300">
            Encontramos {matches.length} matches perfeitos para você
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {matches.map((match, index) => (
            <div 
              key={match.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={match.photo}
                    alt={match.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-red-500 to-purple-500"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {match.compatibility}%
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {match.name}
                </h3>
                <p className="text-gray-400 mb-3">
                  {match.age} anos
                </p>
                
                <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-300">
                    💕 {match.compatibility}% de compatibilidade
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resultados Detalhados */}
        {showResults && (
          <div className="mt-12 animate-fade-in">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                🎯 Análise Completa do Seu Perfil
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Atratividade: <strong className="text-green-400">9.2/10</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Compatibilidade: <strong className="text-blue-400">94%</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Popularidade: <strong className="text-purple-400">Alta</strong></span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Matches Potenciais: <strong className="text-yellow-400">127+</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-gray-300">Interesse Recebido: <strong className="text-red-400">89%</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300">Sucesso Esperado: <strong className="text-pink-400">Muito Alto</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Oferta Premium */}
        {showOffer && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-yellow-500/50 relative overflow-hidden">
              {/* Badge de Oferta */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12">
                🔥 OFERTA LIMITADA
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  🚀 Desbloqueie Seu Potencial Máximo!
                </h2>
                <p className="text-gray-300 text-lg">
                  Upgrade para Premium e multiplique seus matches por <strong className="text-yellow-400">10x</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Plano Gratuito */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-gray-300 mb-3">Plano Gratuito</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✅ 3 matches por dia</li>
                    <li>❌ Mensagens limitadas</li>
                    <li>❌ Sem super likes</li>
                    <li>❌ Sem boost de visibilidade</li>
                  </ul>
                </div>

                {/* Plano Premium */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border-2 border-yellow-500/50 relative">
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    RECOMENDADO
                  </div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">Premium VIP</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>🔥 Matches ilimitados</li>
                    <li>💬 Mensagens ilimitadas</li>
                    <li>⭐ 5 super likes por dia</li>
                    <li>🚀 Boost de visibilidade 24h</li>
                    <li>👑 Perfil destacado</li>
                    <li>🎯 Filtros avançados</li>
                  </ul>
                </div>
              </div>

              {/* Preço e CTA */}
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-gray-400 line-through text-lg">R$ 49,90/mês</span>
                  <span className="text-3xl font-bold text-yellow-400 ml-3">R$ 19,90/mês</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm ml-2">60% OFF</span>
                </div>
                
                <button
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
                >
                  🚀 ATIVAR PREMIUM AGORA
                </button>
                
                <p className="text-gray-400 text-sm">
                  ⏰ Oferta válida apenas hoje • 🔒 Pagamento seguro • ❌ Cancele quando quiser
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Final */}
        <div className="text-center mt-8">
          {!showOffer ? (
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-red-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Começar a Conversar 💬
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="bg-gray-700 text-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-600 transition-all duration-300"
            >
              Continuar com Plano Gratuito
            </button>
          )}
          
          <p className="text-gray-400 text-sm mt-4">
            {!showOffer ? 'Seus matches estão esperando por você!' : 'Ou continue com limitações do plano gratuito'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnaliseMatches;