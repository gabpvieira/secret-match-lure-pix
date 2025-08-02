import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, X, MapPin, Star, Sparkles, Users } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  image: string;
  location: string;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Thaís G.",
    age: 24,
    bio: "meu hobby é dançar na frente do espelho 🤫 quem sabe eu te mostro...",
    image: "https://i.postimg.cc/9fdvnCPh/01.png",
    location: "Online em São Paulo"
  },
  {
    id: 2,
    name: "Jéssica R.",
    age: 28,
    bio: "Libriana safadinha 👀🍷 só dou moral se tiver papo bom e pegada melhor ainda",
    image: "https://i.postimg.cc/k4wL7shY/02.png",
    location: "Online em Rio de Janeiro"
  },
  {
    id: 3,
    name: "Nanda M.",
    age: 22,
    bio: "Não sou fácil, mas sei ser impossível de esquecer 😘 Vem c respeito 😏",
    image: "https://i.postimg.cc/cHdVq2T8/03.png",
    location: "Online em Belo Horizonte"
  },
  {
    id: 4,
    name: "Bruna L.",
    age: 31,
    bio: "🥵 Aqui é zero papo furado... Gosto de conexão real e umas fotinhas privadas",
    image: "https://i.postimg.cc/brBMtJPQ/04.png",
    location: "Online em Porto Alegre"
  },
  {
    id: 5,
    name: "Luiza A.",
    age: 25,
    bio: "🔥 Segura essa energia: carinhosa, mas com fogo nos olhos. topa?",
    image: "https://i.postimg.cc/FzR8zSMr/05.png",
    location: "Online em Curitiba"
  },
  {
    id: 6,
    name: "Duda F.",
    age: 27,
    bio: "Gosto de atenção... e quando elogiam minha tatuagem 😏🍓",
    image: "https://i.postimg.cc/sf6b8nWv/06.png",
    location: "Online em Salvador"
  },
  {
    id: 7,
    name: "Carol V.",
    age: 23,
    bio: "tímida só nos primeiros 5min... depois? já tô te mandando áudio rindo alto kkk 🎧",
    image: "https://i.postimg.cc/3JkzHgj9/07.png",
    location: "Online em Fortaleza"
  },
  {
    id: 8,
    name: "Lívia C.",
    age: 30,
    bio: "gosto de conversa safada inteligente 👠💬 vem sem pressão, mas com intenção",
    image: "https://i.postimg.cc/QxvwNH0D/08.png",
    location: "Online em Recife"
  },
  {
    id: 9,
    name: "Raíssa M.",
    age: 26,
    bio: "📵 sem papo de bom dia e sumiu... se vier, vem inteiro.",
    image: "https://i.postimg.cc/3xp6kYcv/09.png",
    location: "Online em Brasília"
  },
  {
    id: 10,
    name: "Manu T.",
    age: 29,
    bio: "você me ganha no papo... e talvez numa fotinha se eu gostar 🥂📷",
    image: "https://i.postimg.cc/jjb1Nmpk/10.png",
    location: "Online em Florianópolis"
  }
];

export const CurtirPerfis = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<'like' | 'pass' | null>(null);
  const [matches, setMatches] = useState(0);

  const currentProfile = mockProfiles[currentIndex];

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Erro ao reproduzir som:', e));
  };

  const handleLike = () => {
    setButtonPressed('like');
    playSound('/like.mp3');
    
    // Salvar perfil curtido no localStorage
    const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
    likedProfiles.push(currentProfile);
    localStorage.setItem('likedProfiles', JSON.stringify(likedProfiles));
    
    // Simular match (30% de chance)
    const isMatch = Math.random() > 0.7;
    
    if (isMatch) {
      setMatches(matches + 1);
    }
    
    setTimeout(() => {
      nextProfile();
    }, 300);
  };

  const handlePass = () => {
    setButtonPressed('pass');
    playSound('/swipe.mp3');
    
    setTimeout(() => {
      nextProfile();
    }, 300);
  };

  const nextProfile = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentIndex < mockProfiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
        setButtonPressed(null);
      } else {
        // Redirecionar para página de análise final
        navigate('/analise-matches');
      }
    }, 200);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl text-heading">Carregando perfis...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex gap-1">
            {mockProfiles.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-white/70 mt-2 text-sm font-['Poppins']">
            Perfil {currentIndex + 1} de {mockProfiles.length}
          </p>
        </div>

        {/* Profile Card Container */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          {/* Profile Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-purple-500/20">
              <img 
                src={currentProfile.image} 
                alt={currentProfile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Profile info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2 font-['Poppins']">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              
              <div className="flex items-center gap-2 text-sm text-green-400 mb-3 font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {currentProfile.location}
              </div>
              
              <p className="text-sm text-gray-200 leading-relaxed font-['Poppins']">
                {currentProfile.bio}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6">
            <div className="flex gap-4">
              <button
                onClick={handlePass}
                disabled={isTransitioning}
                className={`flex-1 bg-gray-800/80 hover:bg-gray-700/80 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 border border-gray-600/50 font-['Poppins'] ${
                  buttonPressed === 'pass' ? 'scale-95 bg-gray-600/80' : ''
                } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <X className="w-5 h-5" />
                Ignorar
              </button>
              
              <button
                onClick={handleLike}
                disabled={isTransitioning}
                className={`flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-pink-500/25 font-['Poppins'] ${
                  buttonPressed === 'like' ? 'scale-95 from-pink-600 to-red-600' : ''
                } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className="w-5 h-5" />
                Curtir
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CurtirPerfis;