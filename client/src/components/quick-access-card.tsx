import { Button } from "@/components/ui/button";
import { Play, Heart } from "lucide-react";

interface QuickAccessItem {
  type: string;
  name: string;
  gradient?: string;
  image?: string;
}

interface QuickAccessCardProps {
  item: QuickAccessItem;
}

export default function QuickAccessCard({ item }: QuickAccessCardProps) {
  return (
    <div className="bg-spotify-light-gray rounded-md flex items-center overflow-hidden hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
      <div className={`w-20 h-20 flex items-center justify-center ${
        item.type === "liked" 
          ? `bg-gradient-to-br ${item.gradient}` 
          : ""
      }`}>
        {item.type === "liked" ? (
          <Heart className="text-white text-xl w-6 h-6" />
        ) : (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-20 h-20 object-cover" 
          />
        )}
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
      <Button
        size="sm"
        className="mr-4 w-12 h-12 bg-spotify-green text-black rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Play className="w-4 h-4 fill-current" />
      </Button>
    </div>
  );
}
