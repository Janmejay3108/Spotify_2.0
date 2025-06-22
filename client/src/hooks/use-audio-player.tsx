import { useContext } from "react";
import { AudioContext } from "@/lib/audio-context";

export function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioProvider");
  }
  return context;
}
