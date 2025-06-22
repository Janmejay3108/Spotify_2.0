import { Artist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="bg-spotify-gray p-4 rounded-lg hover:bg-spotify-light-gray transition-all duration-300 cursor-pointer group hover-lift">
      <div className="relative">
        <img
          src={artist.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"}
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full mb-4"
        />
        <Button
          size="sm"
          className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full w-12 h-12 p-0 play-button-appear shadow-lg"
        >
          <Play className="w-4 h-4 fill-current" />
        </Button>
      </div>
      <h3 className="font-semibold mb-1 truncate text-center">{artist.name}</h3>
      <p className="text-spotify-text text-sm text-center">Artist</p>
    </div>
  );
}
