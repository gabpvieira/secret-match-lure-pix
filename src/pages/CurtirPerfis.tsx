import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, X, MapPin, Star, Sparkles, Users } from 'lucide-react';
import { getFakeCityForProfile, getUserLocationData } from '@/hooks/useGeolocation';

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  image: string;
  location: string;
}

// Perfis base sem localização fixa
const baseProfiles = [
  {
    id: 1,
    name: "Thaís G.",
    age: 24,
    bio: "meu hobby é dançar na frente do espelho 🤫 quem sabe eu te mostro...",
    image: "https://i.postimg.cc/T1mpVFbh/01-nova.png"
  },
  {
    id: 2,
    name: "Jéssica R.",
    age: 28,
    bio: "Libriana safadinha 👀🍷 só dou moral se tiver papo bom e pegada melhor ainda",
    image: "https://i.postimg.cc/RCn6x6Y9/02-nova.png"
  },
  {
    id: 3,
    name: "Nanda M.",
    age: 31,
    bio: "Não sou fácil, mas sei ser impossível de esquecer 😘 Vem c respeito 😏",
    image: "https://i.postimg.cc/cHdVq2T8/03.png"
  },
  {
    id: 4,
    name: "Bruna L.",
    age: 24,
    bio: "🥵 Aqui é zero papo furado... Gosto de conexão real e umas fotinhas privadas",
    image: "https://i.postimg.cc/brBMtJPQ/04.png"
  },
  {
    id: 5,
    name: "Luiza A.",
    age: 25,
    bio: "🔥 Segura essa energia: carinhosa, mas com fogo nos olhos. topa?",
    image: "https://i.postimg.cc/FzR8zSMr/05.png"
  },
  {
    id: 6,
    name: "Duda F.",
    age: 23,
    bio: "Gosto de atenção... e quando elogiam minha tatuagem 😏🍓",
    image: "https://i.postimg.cc/KvSKGcXT/06-nova.png"
  },
  {
    id: 7,
    name: "Carol V.",
    age: 23,
    bio: "tímida só nos primeiros 5min... depois? já tô te mandando áudio rindo alto kkk 🎧",
    image: "https://i.postimg.cc/3JkzHgj9/07.png"
  },
  {
    id: 8,
    name: "Lívia C.",
    age: 22,
    bio: "gosto de conversa safada inteligente 👠💬 vem sem pressão, mas com intenção",
    image: "https://i.postimg.cc/QxvwNH0D/08.png"
  },
  {
    id: 9,
    name: "Raíssa M.",
    age: 22,
    bio: "📵 sem papo de bom dia e sumiu... se vier, vem inteiro.",
    image: "https://i.postimg.cc/3xp6kYcv/09.png"
  },
  {
    id: 10,
    name: "Manu T.",
    age: 29,
    bio: "você me ganha no papo... e talvez numa fotinha se eu gostar 🥂📷",
    image: "https://i.postimg.cc/jjb1Nmpk/10.png"
  }
];

// Função para gerar perfis com cidades falsas baseadas no estado do usuário
const generateProfilesWithFakeCities = (userState: string): Profile[] => {
  return baseProfiles.map(profile => ({
    ...profile,
    location: getFakeCityForProfile(userState)
  }));
};

export const CurtirPerfis = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<'like' | 'pass' | null>(null);
  const [matches, setMatches] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Detectar localização do usuário e gerar perfis com cidades falsas
  useEffect(() => {
    const initializeProfiles = async () => {
      try {
        const locationData = await getUserLocationData();
        console.log('Estado do usuário detectado:', locationData.state);
        
        // Gerar perfis com cidades falsas baseadas no estado do usuário
        const profilesWithFakeCities = generateProfilesWithFakeCities(locationData.state);
        setProfiles(profilesWithFakeCities);
        
        console.log('Perfis gerados com cidades falsas:', profilesWithFakeCities);
      } catch (error) {
        console.error('Erro ao detectar localização:', error);
        // Fallback para SP se houver erro
        const fallbackProfiles = generateProfilesWithFakeCities('SP');
        setProfiles(fallbackProfiles);
      } finally {
        setLoadingProfiles(false);
      }
    };

    initializeProfiles();
  }, []);

  const currentProfile = profiles[currentIndex];

  // Mostrar loading enquanto detecta localização
  if (loadingProfiles) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Detectando sua localização...</p>
          <p className="text-zinc-400 text-sm mt-2">Encontrando perfis próximos a você</p>
        </div>
      </div>
    );
  }

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Erro ao reproduzir som:', e));
  };

  const handleLike = () => {
    if (isSearching || isTransitioning) return; // Prevenir múltiplos cliques
    
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
    
    // Delay aleatório de 2-5 segundos com mensagem de busca
    const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2000ms a 5000ms
    console.log('Delay para like:', randomDelay + 'ms');
    setIsSearching(true);
    
    setTimeout(() => {
      console.log('Finalizando busca após like');
      setIsSearching(false);
      nextProfile();
    }, randomDelay);
  };

  const handlePass = () => {
    if (isSearching || isTransitioning) return; // Prevenir múltiplos cliques
    
    setButtonPressed('pass');
    playSound('/swipe.mp3');
    
    // Delay aleatório de 1-3 segundos com mensagem de busca
    const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1000ms a 3000ms
    console.log('Delay para pass:', randomDelay + 'ms');
    setIsSearching(true);
    
    setTimeout(() => {
      console.log('Finalizando busca após pass');
      setIsSearching(false);
      nextProfile();
    }, randomDelay);
  };

  const nextProfile = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
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
        
        {/* Overlay de busca */}
        {isSearching && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="text-white text-xl font-['Poppins'] font-medium">Procurando mulheres próximas...</p>
            </div>
          </div>
        )}
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex gap-1">
            {profiles.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-white/70 mt-2 text-sm font-['Poppins']">
            {currentIndex + 1} de {profiles.length} perfis
          </p>
        </div>

        {/* Profile Card */}
        <div className="relative mb-8">
          <Card className={`bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden transition-all duration-300 ${
            isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          } ${
            buttonPressed === 'like' ? 'border-green-500 shadow-green-500/50' : 
            buttonPressed === 'pass' ? 'border-red-500 shadow-red-500/50' : ''
          }`}>
            <CardContent className="p-0">
              {/* Image */}
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-500/20 to-purple-500/20 relative">
                <img 
                  src={currentProfile.image} 
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Profile info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold font-['Poppins']">{currentProfile.name}</h2>
                    <span className="text-xl font-['Poppins']">{currentProfile.age}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-['Poppins']">{currentProfile.location}</span>
                  </div>
                  
                  <p className="text-white/90 text-sm leading-relaxed font-['Poppins']">
                    {currentProfile.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={handlePass}
            disabled={isSearching || isTransitioning}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <X className="w-8 h-8" />
          </Button>
          
          <Button
            onClick={handleLike}
            disabled={isSearching || isTransitioning}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurtirPerfis;