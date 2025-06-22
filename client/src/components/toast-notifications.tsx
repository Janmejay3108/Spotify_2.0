import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Play, Pause, SkipForward, Heart } from "lucide-react";

export function useTrackNotifications() {
  const { toast } = useToast();
  const { currentTrack, isPlaying } = useAudioPlayer();

  useEffect(() => {
    if (currentTrack && isPlaying) {
      toast({
        title: "Now Playing",
        description: (
          <div className="flex items-center space-x-3">
            <img
              src={currentTrack.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentTrack.title}</div>
              <div className="text-sm opacity-75 truncate">{currentTrack.artist.name}</div>
            </div>
          </div>
        ),
        duration: 3000,
      });
    }
  }, [currentTrack?.id, isPlaying, toast]);
}

export function usePlaylistNotifications() {
  const { toast } = useToast();

  const notifyPlaylistCreated = (name: string) => {
    toast({
      title: "Playlist Created",
      description: `"${name}" has been added to your library`,
      duration: 4000,
    });
  };

  const notifyTrackAdded = (trackTitle: string, playlistName: string) => {
    toast({
      title: "Added to Playlist",
      description: `"${trackTitle}" added to "${playlistName}"`,
      duration: 3000,
    });
  };

  const notifyTrackLiked = (trackTitle: string) => {
    toast({
      title: "Added to Liked Songs",
      description: `"${trackTitle}" has been liked`,
      duration: 3000,
    });
  };

  return {
    notifyPlaylistCreated,
    notifyTrackAdded,
    notifyTrackLiked,
  };
}