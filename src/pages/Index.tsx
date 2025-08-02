import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, Shield, Eye, Sparkles } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MatchResult } from "@/components/MatchResult";
import { Checkout } from "@/components/Checkout";
import { PostPurchase } from "@/components/PostPurchase";
import { useGeolocation } from "@/hooks/useGeolocation";
import { SwipeProfileCard } from "@/components/SwipeProfileCard";
import ProfileOnboarding from "@/components/ProfileOnboarding";

type Step = 'onboarding' | 'landing' | 'profiles' | 'loading' | 'matches' | 'checkout' | 'success';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('onboarding');
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const { city, loading: locationLoading } = useGeolocation();

  const profiles = [
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

  const handleLikeProfile = (profileId: number) => {
    const newLiked = new Set(likedProfiles);
    if (newLiked.has(profileId)) {
      newLiked.delete(profileId);
    } else {
      newLiked.add(profileId);
    }
    setLikedProfiles(newLiked);

    // Se curtiu todos os perfis, iniciar análise
    if (newLiked.size === profiles.length) {
      setCurrentStep('loading');
    }
  };

  const handleOnboardingComplete = (profileData: any) => {
    setUserProfileData(profileData);
    setCurrentStep('profiles');
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

  if (currentStep === 'onboarding') {
    return <ProfileOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentStep === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (currentStep === 'matches') {
    return <MatchResult onUnlock={handleUnlock} />;
  }

  if (currentStep === 'checkout') {
    return <Checkout onPurchase={handlePurchase} />;
  }

  if (currentStep === 'success') {
    return <PostPurchase plan={selectedPlan} />;
  }

  if (currentStep === 'profiles') {
    const profile = profiles[currentProfileIndex];
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <SwipeProfileCard
          key={profile.id}
          name={profile.name}
          age={profile.age}
          image={profile.image}
          bio={profile.bio}
          city={city}
          loadingLocation={locationLoading}
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <Badge className="mb-4 sm:mb-6 text-xs sm:text-sm" variant="outline">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {locationLoading ? 'Detectando localização...' : `Online em ${city}`}
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-heading gradient-text mb-4 sm:mb-6 leading-tight px-2 flex items-center justify-center flex-wrap gap-2">
              3 mulheres viram seu perfil… e uma já mandou algo que você vai querer ver
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent animate-pulse" />
            </h1>
            
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-subheading mb-3 sm:mb-4 px-2">
              Você foi convidado para acessar perfis próximos com base no seu perfil
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-body text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Ative seu acesso e descubra quem está disponível na sua região. 
              Conexões reais com pessoas que compartilham seus interesses.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleViewProfiles}
              className="professional-button text-base sm:text-lg text-caption px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto max-w-sm mx-auto touch-manipulation font-semibold"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Ver Quem Me Quer Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-primary mb-2 sm:mb-3 md:mb-4" />
                <CardTitle className="text-base sm:text-lg md:text-xl text-subheading">Perfis Verificados</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm sm:text-base text-body">
                  Todos os perfis são verificados para garantir autenticidade e segurança
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-accent mb-2 sm:mb-3 md:mb-4" />
                <CardTitle className="text-base sm:text-lg md:text-xl text-subheading">Localização Precisa</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm sm:text-base text-body">
                  Encontre pessoas próximas com base na sua localização atual
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card text-center sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-secondary mb-2 sm:mb-3 md:mb-4" />
                <CardTitle className="text-base sm:text-lg md:text-xl text-subheading">100% Discreto</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm sm:text-base text-body">
                  Sua privacidade é nossa prioridade. Interações seguras e confidenciais
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
