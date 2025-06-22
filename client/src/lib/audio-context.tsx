import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import { SongWithDetails } from "@shared/schema";

interface AudioContextType {
  currentTrack: SongWithDetails | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: SongWithDetails) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<SongWithDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.75);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track would go here
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = (track: SongWithDetails) => {
    if (!audioRef.current) return;

    setCurrentTrack(track);
    // In a real app, you would set audio.src to the track's audioUrl
    // For demo purposes, we'll just simulate playback
    audioRef.current.src = track.audioUrl || '';
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.log('Playback failed:', error);
      // For demo, we'll still show as playing
      setIsPlaying(true);
      setDuration(track.duration || 0);
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // For demo purposes, toggle state anyway
        setIsPlaying(true);
      });
    }
  };

  const nextTrack = () => {
    // In a real app, this would play the next track in the queue
    console.log('Next track');
  };

  const previousTrack = () => {
    // In a real app, this would play the previous track
    console.log('Previous track');
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  };

  // Simulate time progression for demo
  useEffect(() => {
    if (isPlaying && currentTrack && currentTime < duration) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          return next >= duration ? duration : next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, currentTime, duration]);

  const value: AudioContextType = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
