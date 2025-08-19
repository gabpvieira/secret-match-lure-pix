import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

// Estilos CSS para animações de varredura
const scanStyles = `
  .scan-animation {
    position: relative;
    overflow: hidden;
  }
  
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scanDown 2s ease-in-out infinite;
  }
  
  .radar-sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;
    border: 2px solid #00ff00;
    border-radius: 50%;
    animation: radarSweep 3s linear infinite;
  }
  
  .radar-sweep::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 50px;
    background: #00ff00;
    transform-origin: bottom;
    animation: radarLine 3s linear infinite;
  }
  
  @keyframes scanDown {
    0% { top: 0; opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  
  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes radarLine {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .vertical-scan {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, #00ff00, transparent);
    animation: scanRight 1.5s ease-in-out infinite;
  }
  
  @keyframes scanRight {
    0% { left: 0; opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }
  
  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid #00ff00;
    border-radius: 50%;
    animation: pulseRing 2s ease-out infinite;
  }
  
  @keyframes pulseRing {
    0% {
      transform: scale(0.1);
      opacity: 1;
    }
    80%, 100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
  .corner-lines {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    pointer-events: none;
  }
  
  .corner-lines::before,
  .corner-lines::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #00ff00;
  }
  
  .corner-lines::before {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  
  .corner-lines::after {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
`;

interface Match {
  id: number;
  name: string;
  age: number;
  image: string;
  location: string;
}

const AnaliseMatches = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Iniciando análise...');
  const [showPreview, setShowPreview] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Carregar foto do usuário do cache de sessão
  useEffect(() => {
    const loadUserPhoto = () => {
      // Tentar carregar do sessionStorage primeiro (chave correta)
      const cachedPhoto = sessionStorage.getItem('userPhotoCache');
      if (cachedPhoto) {
        console.log('Foto carregada do sessionStorage:', cachedPhoto);
        setUserPhoto(cachedPhoto);
        return;
      }
      
      // Fallback para localStorage (perfil do usuário)
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          if (profile.photoUrl) {
            console.log('Foto carregada do localStorage:', profile.photoUrl);
            setUserPhoto(profile.photoUrl);
            return;
          }
        } catch (error) {
          console.error('Erro ao parsear perfil do localStorage:', error);
        }
      }
      
      console.log('Nenhuma foto encontrada no cache');
    };

    loadUserPhoto();
  }, []);

  // Simular análise com progresso real
  useEffect(() => {
    if (!isAnalyzing) return;

    const analysisSteps = [
      { text: 'Analisando seu perfil...', duration: 2000 },
      { text: 'Buscando perfis compatíveis...', duration: 3000 },
      { text: 'Verificando interesses mútuos...', duration: 2500 },
      { text: 'Calculando compatibilidade...', duration: 2000 },
      { text: 'Processando matches...', duration: 2500 },
      { text: 'Finalizando análise...', duration: 3000 }
    ];

    let currentStepIndex = 0;
    let totalDuration = 0;
    const totalTime = analysisSteps.reduce((sum, step) => sum + step.duration, 0);

    const runStep = () => {
      if (currentStepIndex >= analysisSteps.length) {
        setProgress(100);
        setAnalysisText('Análise concluída!');
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowPreview(true);
        }, 1000);
        return;
      }

      const step = analysisSteps[currentStepIndex];
      setAnalysisText(step.text);
      setCurrentStep(currentStepIndex);

      // Atualizar progresso gradualmente durante o step
      const stepStartProgress = (totalDuration / totalTime) * 100;
      const stepEndProgress = ((totalDuration + step.duration) / totalTime) * 100;
      
      let stepProgress = 0;
      const progressInterval = setInterval(() => {
        stepProgress += 2;
        const currentProgress = stepStartProgress + (stepProgress / 100) * (stepEndProgress - stepStartProgress);
        setProgress(Math.min(currentProgress, stepEndProgress));
        
        if (stepProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, step.duration / 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        totalDuration += step.duration;
        currentStepIndex++;
        runStep();
      }, step.duration);
    };

    runStep();
  }, [isAnalyzing]);

  // Carregar matches do localStorage ou usar padrão
  useEffect(() => {
    const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
    
    if (likedProfiles.length > 0) {
      // Selecionar 3 perfis aleatórios dos curtidos
      const selectedMatches = likedProfiles
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((profile: any, index: number) => ({
          id: index + 1,
          name: profile.name,
          age: profile.age,
          image: profile.image,
          location: profile.location
        }));
      setMatches(selectedMatches);
    } else {
      // Matches padrão se não houver perfis curtidos
      const defaultMatches = [
        {
          id: 1,
          name: "Thaís G.",
          age: 24,
          image: "https://i.postimg.cc/T1mpVFbh/01-nova.png",
          location: "São Paulo, SP"
        },
        {
          id: 2,
          name: "Jéssica R.",
          age: 28,
          image: "https://i.postimg.cc/RCn6x6Y9/02-nova.png",
          location: "Rio de Janeiro, RJ"
        },
        {
          id: 3,
          name: "Nanda M.",
          age: 31,
          image: "https://i.postimg.cc/cHdVq2T8/03.png",
          location: "Belo Horizonte, MG"
        }
      ];
      setMatches(defaultMatches);
    }
  }, []);

  // Função para lidar com o clique no botão
  const handleViewMessages = () => {
    navigate('/checkout');
  };

  if (isAnalyzing) {
    return (
      <>
        <style>{scanStyles}</style>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            
            {/* Foto do usuário com animações */}
            <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden bg-gray-800 border-4 border-green-500 scan-animation">
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="Sua foto" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Erro ao carregar foto do usuário');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
              
              {/* Animações de varredura */}
              <div className="scan-line"></div>
              <div className="vertical-scan"></div>
              <div className="radar-sweep"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring" style={{ animationDelay: '1s' }}></div>
              <div className="corner-lines"></div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-white font-['Poppins']">
              Analisando seu perfil...
            </h1>

            {/* Texto da análise */}
            <p className="text-xl text-gray-300 font-['Poppins']">
              {analysisText}
            </p>

            {/* Barra de progresso real */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Porcentagem */}
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-400 font-['Poppins']">
                {Math.round(progress)}% concluído
              </p>
            </div>

            {/* Mensagem de espera */}
            <p className="text-sm text-gray-500 font-['Poppins']">
              Por favor, aguarde enquanto processamos sua análise...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Preview dos matches
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        
        {/* Título do resultado */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white font-['Poppins']">
            Matches Encontrados!
          </h1>
          <p className="text-lg text-gray-300 font-['Poppins']">
            Essas {matches.length} mulheres curtiram seu perfil.
          </p>
        </div>

        {/* Cards dos matches */}
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div key={match.id} className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-4">
                  <img 
                    src={match.image} 
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-white font-['Poppins']">
                      {match.name}, {match.age}
                    </h3>
                    <p className="text-sm text-gray-400 font-['Poppins']">
                      {match.location}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Overlay para cards bloqueados */}
              {index > 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-black font-bold text-sm">🔒</span>
                    </div>
                    <p className="text-white text-sm font-['Poppins'] font-medium">
                      Desbloqueie para ver
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mensagem final */}
        <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-green-400 font-['Poppins']">
            Essas 3 mulheres curtiram seu perfil.
          </h2>
          <button 
            onClick={handleViewMessages}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 font-['Poppins']"
          >
            VER O QUE ELA ENVIOU
          </button>
          <p className="text-sm text-gray-400 font-['Poppins']">
            Clique no botão acima para continuar
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnaliseMatches;