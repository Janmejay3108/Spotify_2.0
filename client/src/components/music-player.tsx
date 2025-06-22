import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import AudioVisualizer from "@/components/audio-visualizer";
import MiniPlayer from "@/components/mini-player";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Heart, 
  ExternalLink,
  List,
  Monitor,
  Volume2,
  Maximize2,
  ChevronDown
} from "lucide-react";

export default function MusicPlayer() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  if (!currentTrack) {
    return null;
  }

  if (isCollapsed) {
    return (
      <MiniPlayer 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(false)}
      />
    );
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface p-4 z-50">
      <div className="flex items-center justify-between">
        {/* Current Track Info */}
        <div className="flex items-center space-x-3 w-1/4 min-w-0">
          <img
            src={currentTrack.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=56&h=56&fit=crop"}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-primary font-medium truncate">{currentTrack.title}</h4>
            <p className="text-secondary text-sm truncate">{currentTrack.artist.name}</p>
          </div>
          <AudioVisualizer width={60} height={20} className="mr-2" />
          <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-1/2 max-w-md">
          <div className="flex items-center space-x-4 mb-2">
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-secondary hover:text-primary p-1"
              onClick={previousTrack}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 p-0"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-secondary hover:text-primary p-1"
              onClick={nextTrack}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-secondary min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              onValueChange={([value]) => seekTo((value / 100) * duration)}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-secondary min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Other Controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
            <Monitor className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-1">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Slider
              value={[volume * 100]}
              onValueChange={([value]) => setVolume(value / 100)}
              max={100}
              className="w-20"
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-secondary hover:text-primary p-1"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
