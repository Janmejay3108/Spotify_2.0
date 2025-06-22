import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronUp,
  ChevronDown,
  Heart,
  Volume2
} from "lucide-react";

interface MiniPlayerProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function MiniPlayer({ isCollapsed, onToggleCollapse }: MiniPlayerProps) {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlayPause, 
    nextTrack, 
    previousTrack,
    seekTo,
    setVolume
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 bg-surface border border-surface rounded-lg shadow-lg p-3 z-50 w-80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <img
              src={currentTrack.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-primary font-medium truncate text-sm">{currentTrack.title}</h4>
              <p className="text-secondary text-xs truncate">{currentTrack.artist.name}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleCollapse}
            className="text-secondary hover:text-primary p-1"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previousTrack}
            className="text-secondary hover:text-primary p-1"
          >
            <SkipBack className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            onClick={togglePlayPause}
            className="w-7 h-7 bg-accent rounded-full p-0"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 ml-0.5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextTrack}
            className="text-secondary hover:text-primary p-1"
          >
            <SkipForward className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
            <Heart className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-secondary min-w-[30px]">{formatTime(currentTime)}</span>
          <Slider
            value={[progress]}
            onValueChange={([value]) => seekTo((value / 100) * duration)}
            max={100}
            step={0.1}
            className="flex-1 h-1"
          />
          <span className="text-secondary min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>
    );
  }

  return null;
}