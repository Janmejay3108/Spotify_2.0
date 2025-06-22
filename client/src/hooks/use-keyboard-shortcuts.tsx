import { useEffect } from "react";
import { useAudioPlayer } from "./use-audio-player";
import { useLocation } from "wouter";

export function useKeyboardShortcuts() {
  const { togglePlayPause, nextTrack, previousTrack, setVolume, volume } = useAudioPlayer();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isModifier = ctrlKey || metaKey;

      switch (key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;

        case 'arrowright':
          if (shiftKey) {
            nextTrack();
          }
          break;

        case 'arrowleft':
          if (shiftKey) {
            previousTrack();
          }
          break;

        case 'arrowup':
          if (isModifier) {
            event.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
          }
          break;

        case 'arrowdown':
          if (isModifier) {
            event.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
          }
          break;

        case 'h':
          if (isModifier) {
            event.preventDefault();
            setLocation('/');
          }
          break;

        case 'k':
          if (isModifier) {
            event.preventDefault();
            setLocation('/search');
          }
          break;

        case 'l':
          if (isModifier) {
            event.preventDefault();
            setLocation('/library');
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, nextTrack, previousTrack, setVolume, volume, setLocation]);
}