import { Album, Playlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface AlbumCardProps {
  album: Album | Playlist;
  showDescription?: boolean;
}

export default function AlbumCard({ album, showDescription = false }: AlbumCardProps) {
  const isPlaylist = 'isPublic' in album;
  
  return (
    <div className="bg-spotify-gray p-4 rounded-lg hover:bg-spotify-light-gray transition-all duration-300 cursor-pointer group hover-lift">
      <div className="relative">
        <img
          src={album.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"}
          alt={isPlaylist ? album.name : album.title}
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        <Button
          size="sm"
          className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full w-12 h-12 p-0 play-button-appear shadow-lg"
        >
          <Play className="w-4 h-4 fill-current" />
        </Button>
      </div>
      <h3 className="font-semibold mb-1 truncate">
        {isPlaylist ? album.name : album.title}
      </h3>
      {showDescription ? (
        <p className="text-spotify-text text-sm">
          {isPlaylist 
            ? album.description || "Playlist" 
            : `Album • ${album.releaseYear || 'Unknown'}`
          }
        </p>
      ) : (
        <p className="text-spotify-text text-sm truncate">
          {isPlaylist ? "Playlist" : `${album.releaseYear || 'Unknown'}`}
        </p>
      )}
    </div>
  );
}
