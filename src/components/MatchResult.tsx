import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface MatchResultProps {
  onUnlock: () => void;
}

export const MatchResult = ({ onUnlock }: MatchResultProps) => {
  const visibleProfile = {
    name: "Thaís G.",
    age: 24,
    image: "https://i.postimg.cc/9fdvnCPh/01.png",
    bio: "Gosto de música, conversas leves e momentos descontraídos."
  };

  const hiddenProfiles = [
    { name: "Jéssica R.", age: 28, image: "https://i.postimg.cc/k4wL7shY/02.png" },
    { name: "Nanda M.", age: 22, image: "https://i.postimg.cc/cHdVq2T8/03.png" }
  ];

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-heading gradient-text mb-3 sm:mb-4 leading-tight px-2">
            Elas curtiram você… mas só uma deixou tudo liberado. As outras estão esperando seu sinal.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-body text-muted-foreground px-4">
            Pronto pra ver o que ela já mandou? As outras estão só de olho…
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Visible Profile */}
          <Card className="modern-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto relative">
                <img 
                  src={visibleProfile.image} 
                  alt={`${visibleProfile.name}, ${visibleProfile.age} anos`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 sm:p-6 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl md:text-2xl text-subheading mb-2">
                  {visibleProfile.name}, {visibleProfile.age}
                </h3>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base text-body">
                  {visibleProfile.bio}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online agora
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Hidden Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {hiddenProfiles.map((profile, index) => (
              <Card key={index} className="modern-card overflow-hidden relative">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={profile.image} 
                    alt={`${profile.name}, ${profile.age} anos`}
                    className="w-full h-full object-cover blur-md"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-subheading text-base sm:text-lg mb-1">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-xs sm:text-sm text-caption text-muted-foreground">
                    ••• •••••• •••••••• •••••
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center px-4">
          <Button 
            onClick={onUnlock}
            size="lg"
            className="professional-button text-base sm:text-lg text-caption px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto min-h-[48px] touch-manipulation font-semibold"
          >
            Desbloquear Agora e Ver As Fotos
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Ela ainda tá online… mas não por muito tempo.
          </p>
        </div>
      </div>
    </div>
  );
};