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
  const [progress, setProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Analisando seu perfil...');
  const [showPreview, setShowPreview] = useState(false);
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
    // Simular análise de perfil por 15 segundos
    const analysisTimer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowPreview(true);
      
      // Redirecionar para checkout após 5 segundos do preview
      setTimeout(() => {
        navigate('/checkout');
      }, 5000);
    }, 15000); // 15 segundos de análise

    // Atualizar progresso
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 6.67; // ~6.67% a cada segundo (15 segundos total)
      });
    }, 1000);

    // Atualizar texto da análise a cada 3 segundos
    const textTimer = setInterval(() => {
      setAnalysisText(prev => {
        const texts = [
          'Analisando seu perfil...',
          'Ela tá vendo seu perfil agora...',
          'Calculando compatibilidade...',
          'Encontrando matches perfeitos...',
          'Quase pronto...'
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 3000);

    return () => {
      clearTimeout(analysisTimer);
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, [navigate]);

  // Função removida - redirecionamento automático implementado

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
        {/* Preview Section */}
        {showPreview && (
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">
              🔥 Matches Encontrados!
            </h1>
            <p className="text-gray-300 mb-8">
              Encontramos 3 matches com alta compatibilidade para você
            </p>
            
            {/* Preview Matches - Blurred */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {mockMatches.slice(0, 3).map((match, index) => (
                <div 
                  key={match.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {/* Blur Overlay */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-2xl z-10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-white font-bold text-sm">PREMIUM</p>
                    </div>
                  </div>
                  
                  <div className="text-center relative">
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
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-yellow-500/50">
              <h2 className="text-2xl font-bold text-white mb-2">
                🚀 Desbloqueie Agora!
              </h2>
              <p className="text-gray-300 mb-4">
                Upgrade para Premium e converse com seus matches
              </p>
              <div className="text-yellow-400 font-bold text-lg">
                Redirecionando para ofertas especiais...
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default AnaliseMatches;