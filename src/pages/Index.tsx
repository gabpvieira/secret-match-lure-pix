import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, Shield, Eye, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Checkout } from "@/components/Checkout";
import { PostPurchase } from "@/components/PostPurchase";
import { useGeolocation, getFakeCityForProfile, getUserLocationData } from "@/hooks/useGeolocation";
import { SwipeProfileCard } from "@/components/SwipeProfileCard";
import { MatchResult } from "@/components/MatchResult";
import PlanCheckout from "@/components/PlanCheckout";

type Step = 'ambiente-seguro' | 'match-secreto' | 'curtir' | 'analise-matches' | 'checkout' | 'checkout-plan' | 'plano-details';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('ambiente-seguro');
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const { city, loading: locationLoading } = useGeolocation();

  const baseProfiles = [
    {
      id: 1,
      name: "Thaís G.",
      age: 24,
      image: "https://i.postimg.cc/9fdvnCPh/01.png",
      bio: "meu hobby é dançar na frente do espelho 🤫 quem sabe eu te mostro..."
    },
    {
      id: 2,
      name: "Jéssica R.",
      age: 28,
      image: "https://i.postimg.cc/k4wL7shY/02.png",
      bio: "Libriana safadinha 👀🍷 só dou moral se tiver papo bom e pegada melhor ainda"
    },
    {
      id: 3,
      name: "Nanda M.",
      age: 22,
      image: "https://i.postimg.cc/cHdVq2T8/03.png",
      bio: "Não sou fácil, mas sei ser impossível d esquecer 😘 Vem c respeito 😏"
    },
    {
      id: 4,
      name: "Bruna L.",
      age: 31,
      image: "https://i.postimg.cc/brBMtJPQ/04.png",
      bio: "🥵 Aqui é zero papo furado... Gosto de conexão real e umas fotinhas privadas"
    },
    {
      id: 5,
      name: "Luiza A.",
      age: 25,
      image: "https://i.postimg.cc/FzR8zSMr/05.png",
      bio: "Segura essa energia: carinhosa, mas com fogo nos olhos. topa?"
    },
    {
      id: 6,
      name: "Duda F.",
      age: 27,
      image: "https://i.postimg.cc/sf6b8nWv/06.png",
      bio: "Gosto de atenção... e quando elogiam minha tatuagem 😏🍓"
    },
    {
      id: 7,
      name: "Carol V.",
      age: 23,
      image: "https://i.postimg.cc/3JkzHgj9/07.png",
      bio: "tímida só nos primeiros 5min... depois? já tô te mandando áudio rindo alto kkk 🎧"
    },
    {
      id: 8,
      name: "Lívia C.",
      age: 30,
      image: "https://i.postimg.cc/QxvwNH0D/08.png",
      bio: "gosto de conversa safada inteligente 👠💬 vem sem pressão, mas com intenção"
    },
    {
      id: 9,
      name: "Raíssa M.",
      age: 26,
      image: "https://i.postimg.cc/3xp6kYcv/09.png",
      bio: "📵 sem papo de bom dia e sumiu... se vier, vem inteiro."
    },
    {
      id: 10,
      name: "Manu T.",
      age: 29,
      image: "https://i.postimg.cc/jjb1Nmpk/10.png",
      bio: "você me ganha no papo... e talvez numa fotinha se eu gostar 🥂📷"
    }
  ];

  const generateProfilesWithFakeCities = async (userState: string) => {
    return baseProfiles.map(profile => ({
      ...profile,
      location: getFakeCityForProfile(userState)
    }));
  };

  useEffect(() => {
    const initializeProfiles = async () => {
      try {
        const locationData = await getUserLocationData();
        const userState = locationData?.state || 'SP';
        const profilesWithFakeCities = await generateProfilesWithFakeCities(userState);
        setProfiles(profilesWithFakeCities);
      } catch (error) {
        console.error('Erro ao detectar localização:', error);
        const fallbackProfiles = await generateProfilesWithFakeCities('SP');
        setProfiles(fallbackProfiles);
      } finally {
        setLoadingProfiles(false);
      }
    };

    initializeProfiles();
  }, []);

  const handleLikeProfile = (profileId: string) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  const handleMatchSecretoComplete = () => {
    setCurrentStep('curtir');
  };

  const handleCurtirComplete = () => {
    setCurrentStep('analise-matches');
  };

  const handleAnaliseComplete = () => {
    setCurrentStep('checkout');
  };

  const handleViewProfiles = () => {
    setCurrentProfileIndex(0);
    setCurrentStep('profiles');
  };

  const handleLoadingComplete = () => {
    setCurrentStep('matches');
  };

  const handleUnlock = () => {
    setCurrentStep('checkout');
  };

  const handlePurchase = (plan: string) => {
    setSelectedPlan(plan);
    setCurrentStep('success');
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCurrentStep('plan-details');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
  };

  const handleBackToMatches = () => {
    setCurrentStep('matches');
  };

  const handleContinueFromAmbiente = () => {
    setCurrentStep('match-secreto');
  };



  if (currentStep === 'ambiente-seguro') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="modern-card w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Shield className="w-16 h-16 mx-auto text-green-400 mb-4" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-6 leading-tight">
              Você está entrando numa área segura e privada 🔒
            </h1>
            
            <p className="text-lg text-body text-muted-foreground mb-8">
              Clique abaixo para continuar. Suas preferências serão mantidas com sigilo total.
            </p>
            
            <Button 
              onClick={handleContinueFromAmbiente}
              className="w-full professional-button text-lg py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              size="lg"
            >
              Tudo Certo, Quero Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'match-secreto') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="modern-card w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Eye className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-6 leading-tight">
              Match Secreto 🔮
            </h1>
            
            <p className="text-lg text-body text-muted-foreground mb-8">
              Prepare-se para descobrir conexões únicas e exclusivas. Seu próximo match está a um clique de distância.
            </p>
            
            <Button 
              onClick={handleMatchSecretoComplete}
              className="w-full professional-button text-lg py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              size="lg"
            >
              Descobrir Matches Secretos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'curtir') {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center text-heading mb-6">
              Quem você quer conhecer? 💕
            </h1>
            
            <div className="space-y-4">
              {profiles.slice(0, 3).map((profile) => (
                <div key={profile.id} className="modern-card p-4 flex items-center space-x-4">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading">{profile.name}, {profile.age}</h3>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeProfile(profile.id)}
                    className={likedProfiles.has(profile.id) ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className="w-5 h-5" fill={likedProfiles.has(profile.id) ? "currentColor" : "none"} />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleCurtirComplete}
              className="w-full mt-8 professional-button bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600"
              size="lg"
            >
              Continuar para Análise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'analise-matches') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="modern-card w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-6 leading-tight">
              Analisando seus Matches ✨
            </h1>
            
            <p className="text-lg text-body text-muted-foreground mb-8">
              Encontramos {likedProfiles.size} perfis compatíveis com você! Prepare-se para desbloquear conexões exclusivas.
            </p>
            
            <Button 
              onClick={handleAnaliseComplete}
              className="w-full professional-button text-lg py-6 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600"
              size="lg"
            >
              Ver Resultados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (currentStep === 'matches') {
    return <MatchResult onUnlock={handleUnlock} />;
  }

  if (currentStep === 'checkout') {
    return <Checkout onPurchase={handlePurchase} onSelectPlan={handleSelectPlan} />;
  }

  if (currentStep === 'success') {
    return <PostPurchase plan={selectedPlan} />;
  }

  if (currentStep === 'plan-details') {
    return <PlanCheckout planId={selectedPlanId} onBack={handleBackToLanding} />;
  }

  if (currentStep === 'profiles') {
    if (loadingProfiles) {
      return (
        <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-zinc-950">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando perfis...</p>
          </div>
        </div>
      );
    }

    const profile = profiles[currentProfileIndex];
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-zinc-950 p-4">
        <SwipeProfileCard
          key={profile.id}
          name={profile.name}
          age={profile.age}
          image={profile.image}
          bio={profile.bio}
          city={profile.location}
          loadingLocation={false}
          onLike={() => {
            setLikedProfiles(new Set([...likedProfiles, profile.id]));
            if (currentProfileIndex === profiles.length - 1) {
              setTimeout(() => setCurrentStep('loading'), 400);
            } else {
              setCurrentProfileIndex(currentProfileIndex + 1);
            }
          }}
          onIgnore={() => {
            if (currentProfileIndex === profiles.length - 1) {
              setTimeout(() => setCurrentStep('loading'), 400);
            } else {
              setCurrentProfileIndex(currentProfileIndex + 1);
            }
          }}
          isLast={currentProfileIndex === profiles.length - 1}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh]">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-4 sm:pt-8 md:pt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
        <div className="relative container-mobile py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <Badge className="mb-3 sm:mb-4 md:mb-6 text-fluid-xs" variant="outline">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {locationLoading ? 'Detectando localização...' : `Online em ${city}`}
            </Badge>
            
            <h1 className="text-fluid-3xl sm:text-fluid-4xl md:text-fluid-5xl text-heading gradient-text mb-3 sm:mb-4 md:mb-6 leading-tight px-2 flex items-center justify-center flex-wrap gap-2">
              3 mulheres viram seu perfil… e uma já mandou algo que você vai querer ver
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent animate-pulse flex-shrink-0" />
            </h1>
            
            <h2 className="text-fluid-lg sm:text-fluid-xl md:text-fluid-2xl text-subheading mb-2 sm:mb-3 md:mb-4 px-2">
              Você foi convidado para acessar perfis próximos com base no seu perfil
            </h2>
            
            <p className="text-fluid-sm sm:text-fluid-base text-body text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Ative seu acesso e descubra quem está disponível na sua região. 
              Conexões reais com pessoas que compartilham seus interesses.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleViewProfiles}
              className="professional-button text-fluid-base sm:text-fluid-lg text-caption px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto max-w-sm mx-auto touch-manipulation font-semibold"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              INICIAR AGORA
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container-mobile">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-primary mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">Perfis Verificados</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Todos os perfis são verificados para garantir autenticidade e segurança
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-accent mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">Localização Precisa</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Encontre pessoas próximas com base na sua localização atual
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-secondary mb-2 sm:mb-3" />
                <CardTitle className="text-fluid-base sm:text-fluid-lg text-subheading">100% Discreto</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-fluid-sm text-body">
                  Sua privacidade é nossa prioridade. Interações seguras e confidenciais
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing */}
      <div className="pb-6 sm:pb-8 md:pb-12"></div>
    </div>
  );
};

export default Index;
