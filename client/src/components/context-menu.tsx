import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SongWithDetails } from "@shared/schema";
import { 
  Play, 
  Plus, 
  Heart, 
  Share, 
  Radio,
  ListPlus,
  Download,
  Info,
  MoreHorizontal
} from "lucide-react";

interface ContextMenuProps {
  song?: SongWithDetails;
  onPlay?: () => void;
  onAddToPlaylist?: () => void;
  onAddToQueue?: () => void;
  onStartRadio?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onShowInfo?: () => void;
  children: React.ReactNode;
}

export default function ContextMenu({
  song,
  onPlay,
  onAddToPlaylist,
  onAddToQueue,
  onStartRadio,
  onLike,
  onShare,
  onDownload,
  onShowInfo,
  children
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleItemClick = (action?: () => void) => {
    if (action) action();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuItems = [
    { icon: Play, label: "Play", action: onPlay },
    { icon: Plus, label: "Add to queue", action: onAddToQueue },
    { icon: ListPlus, label: "Add to playlist", action: onAddToPlaylist },
    { icon: Radio, label: "Go to song radio", action: onStartRadio },
    { icon: Heart, label: "Like", action: onLike },
    { icon: Share, label: "Share", action: onShare },
    { icon: Download, label: "Download", action: onDownload },
    { icon: Info, label: "Show credits", action: onShowInfo },
  ].filter(item => item.action);

  return (
    <>
      <div onContextMenu={handleContextMenu} className="relative">
        {children}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={menuRef}
            className="fixed z-50 bg-surface border border-surface rounded-lg shadow-lg py-2 min-w-[200px]"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -10px)'
            }}
          >
            {song && (
              <div className="px-4 py-2 border-b border-surface">
                <div className="text-primary font-medium truncate">{song.title}</div>
                <div className="text-secondary text-sm truncate">{song.artist.name}</div>
              </div>
            )}
            
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-primary hover:bg-surface-hover rounded-none"
                  onClick={() => handleItemClick(item.action)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}