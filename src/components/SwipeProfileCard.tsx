import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, X, Heart } from "lucide-react";

interface SwipeProfileCardProps {
  name: string;
  age: number;
  image: string;
  bio: string;
  city: string;
  loadingLocation: boolean;
  onLike: () => void;
  onIgnore: () => void;
  isLast: boolean;
}

export const SwipeProfileCard = ({
  name,
  age,
  image,
  bio,
  city,
  loadingLocation,
  onLike,
  onIgnore,
  isLast
}: SwipeProfileCardProps) => {
  const [animating, setAnimating] = useState<string | null>(null);
  const likeAudio = useRef<HTMLAudioElement>(null);
  const ignoreAudio = useRef<HTMLAudioElement>(null);

  const handleLike = () => {
    setAnimating("right");
    likeAudio.current?.play();
    setTimeout(() => {
      setAnimating(null);
      onLike();
    }, 350);
  };

  const handleIgnore = () => {
    setAnimating("left");
    ignoreAudio.current?.play();
    setTimeout(() => {
      setAnimating(null);
      onIgnore();
    }, 350);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen w-full max-w-sm sm:max-w-md mx-auto bg-gradient-to-b from-black via-zinc-900 to-zinc-800 rounded-none sm:rounded-xl shadow-lg p-3 sm:p-4 transition-transform duration-300 ${
        animating === "right" ? "animate-swipe-right" : ""
      } ${animating === "left" ? "animate-swipe-left" : ""}`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <audio ref={likeAudio} src="/like.mp3" preload="auto" />
      <audio ref={ignoreAudio} src="/swipe.mp3" preload="auto" />
      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-3 sm:mb-4 shadow-lg">
        <img
          src={image}
          alt={`${name}, ${age} anos`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center w-full px-1 sm:px-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white text-lg sm:text-xl font-semibold">{name}, {age}</span>
        </div>
        <p className="text-zinc-200 text-sm sm:text-base text-center mb-3 sm:mb-4 leading-relaxed px-2" style={{ fontFamily: "Poppins, sans-serif" }}>{bio}</p>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          <span className="text-xs sm:text-sm text-zinc-300">
            {loadingLocation ? "Detectando localização..." : `Online em ${city}`}
          </span>
        </div>
        <div className="flex w-full gap-3 sm:gap-4 mt-2">
          <Button
            onClick={handleIgnore}
            size="lg"
            className="flex-1 bg-zinc-700 text-white hover:bg-zinc-600 transition-all text-sm sm:text-base py-4 sm:py-6 rounded-xl shadow-md active:scale-95 touch-manipulation min-h-[48px]"
            style={{ fontFamily: "Poppins, sans-serif" }}
            aria-label="Ignorar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Ignorar
          </Button>
          <Button
            onClick={handleLike}
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-white hover:brightness-110 transition-all text-sm sm:text-base py-4 sm:py-6 rounded-xl shadow-md active:scale-95 touch-manipulation min-h-[48px]"
            style={{ fontFamily: "Poppins, sans-serif" }}
            aria-label="Curtir"
          >
            Curtir <Heart className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// CSS animations (add to global CSS or Tailwind config):
// .animate-swipe-right { transform: translateX(100vw); opacity: 0; transition: transform 0.3s, opacity 0.3s; }
// .animate-swipe-left { transform: translateX(-100vw); opacity: 0; transition: transform 0.3s, opacity 0.3s; }