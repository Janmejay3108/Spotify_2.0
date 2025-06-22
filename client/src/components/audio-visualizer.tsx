import { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface AudioVisualizerProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AudioVisualizer({ 
  width = 200, 
  height = 60, 
  className = "" 
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { isPlaying, currentTrack } = useAudioPlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Generate bars data
    const barCount = 40;
    const bars = Array.from({ length: barCount }, () => ({
      height: Math.random() * 0.8 + 0.2,
      targetHeight: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.01
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying && currentTrack) {
        // Update bar heights
        bars.forEach(bar => {
          // Generate new target occasionally
          if (Math.random() < 0.02) {
            bar.targetHeight = Math.random() * 0.8 + 0.2;
          }
          
          // Animate towards target
          const diff = bar.targetHeight - bar.height;
          bar.height += diff * bar.speed;
        });

        // Draw bars
        const barWidth = width / barCount;
        bars.forEach((bar, i) => {
          const barHeight = bar.height * height * 0.8;
          const x = i * barWidth;
          const y = height - barHeight;

          // Create gradient
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, 'var(--accent-primary)');
          gradient.addColorStop(1, 'var(--accent-hover)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
      } else {
        // Static state - draw minimal bars
        const barWidth = width / barCount;
        bars.forEach((_, i) => {
          const barHeight = 2;
          const x = i * barWidth;
          const y = height - barHeight;

          ctx.fillStyle = 'var(--spotify-text-secondary)';
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTrack, width, height]);

  return (
    <canvas 
      ref={canvasRef}
      className={`${className}`}
      style={{ width, height }}
    />
  );
}