import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  image: string;
  bio: string;
  onLike: () => void;
  isLiked: boolean;
}

export const ProfileCard = ({ name, age, image, bio, onLike, isLiked }: ProfileCardProps) => {
  return (
    <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img 
          src={image} 
          alt={`${name}, ${age} anos`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <h3 className="text-white text-subheading text-fluid-base sm:text-fluid-lg mb-1">
            {name}, {age}
          </h3>
          <p className="text-white/90 text-fluid-xs sm:text-fluid-sm text-body leading-relaxed">
            {bio}
          </p>
        </div>
        <Button
          onClick={onLike}
          size="icon"
          className={`absolute top-3 sm:top-4 right-3 sm:right-4 rounded-full min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] touch-manipulation ${
            isLiked 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30'
          }`}
          variant={isLiked ? "default" : "outline"}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </Card>
  );
};