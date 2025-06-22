import { useState, useRef } from "react";
import { SongWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import ContextMenu from "@/components/context-menu";
import { 
  Play, 
  Pause,
  GripVertical, 
  MoreHorizontal,
  Heart,
  Clock
} from "lucide-react";

interface DragDropPlaylistProps {
  playlistId: number;
  songs: SongWithDetails[];
  onReorder?: (songs: SongWithDetails[]) => void;
}

export default function DragDropPlaylist({ playlistId, songs, onReorder }: DragDropPlaylistProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<number>>(new Set());
  const dragOverIndex = useRef<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const removeSongMutation = useMutation({
    mutationFn: async (songId: number) => {
      return apiRequest(`/api/playlists/${playlistId}/songs/${songId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playlists/${playlistId}`] });
      toast({
        title: "Song removed",
        description: "Track has been removed from the playlist",
      });
    },
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;

    const newSongs = [...songs];
    const draggedSong = newSongs[draggedIndex];
    
    // Remove the dragged song
    newSongs.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newSongs.splice(dropIndex, 0, draggedSong);
    
    setDraggedIndex(null);
    dragOverIndex.current = null;
    
    if (onReorder) {
      onReorder(newSongs);
    }
  };

  const handleSongSelect = (songId: number, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      const newSelected = new Set(selectedSongs);
      if (newSelected.has(songId)) {
        newSelected.delete(songId);
      } else {
        newSelected.add(songId);
      }
      setSelectedSongs(newSelected);
    } else {
      setSelectedSongs(new Set([songId]));
    }
  };

  const handleBatchDelete = () => {
    if (selectedSongs.size === 0) return;
    
    selectedSongs.forEach(songId => {
      removeSongMutation.mutate(songId);
    });
    
    setSelectedSongs(new Set());
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-secondary text-sm border-b border-surface">
        <div className="col-span-1">#</div>
        <div className="col-span-6">TITLE</div>
        <div className="col-span-3">ALBUM</div>
        <div className="col-span-2 flex justify-end">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Batch Actions */}
      {selectedSongs.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface-hover rounded">
          <span className="text-primary text-sm">
            {selectedSongs.size} song{selectedSongs.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedSongs(new Set())}
              className="border-surface text-secondary hover:text-primary"
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={removeSongMutation.isPending}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Songs List */}
      {songs.map((song, index) => {
        const isSelected = selectedSongs.has(song.id);
        const isCurrentTrack = currentTrack?.id === song.id;
        const isDraggedOver = dragOverIndex.current === index;
        
        return (
          <ContextMenu
            key={song.id}
            song={song}
            onPlay={() => playTrack(song)}
            onAddToQueue={() => toast({ title: "Added to queue", description: song.title })}
            onStartRadio={() => toast({ title: "Starting radio", description: `Based on ${song.title}` })}
            onLike={() => toast({ title: "Liked", description: song.title })}
            onShare={() => toast({ title: "Shared", description: song.title })}
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onClick={(e) => handleSongSelect(song.id, e.ctrlKey || e.metaKey)}
              className={`grid grid-cols-12 gap-4 px-4 py-2 hover:bg-surface-hover rounded group cursor-pointer transition-all ${
                isSelected ? 'bg-surface-hover' : ''
              } ${isDraggedOver ? 'border-t-2 border-accent' : ''} ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="col-span-1 flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`text-sm ${isCurrentTrack ? 'text-accent' : 'text-secondary'} group-hover:hidden`}>
                  {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(song);
                  }}
                  className="w-4 h-4 p-0 hidden group-hover:flex items-center justify-center"
                >
                  {isCurrentTrack && isPlaying ? (
                    <Pause className="w-3 h-3 text-primary" />
                  ) : (
                    <Play className="w-3 h-3 text-primary" />
                  )}
                </Button>
              </div>
              
              <div className="col-span-6 flex items-center space-x-3">
                <img
                  src={song.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <h4 className={`font-medium ${isCurrentTrack ? 'text-accent' : 'text-primary'}`}>
                    {song.title}
                  </h4>
                  <p className="text-secondary text-sm">{song.artist.name}</p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <span className="text-secondary text-sm">
                  {song.album?.title || "Unknown Album"}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center justify-end space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({ title: "Liked", description: song.title });
                  }}
                >
                  <Heart className="w-3 h-3 text-secondary hover:text-accent" />
                </Button>
                <span className="text-secondary text-sm">
                  {formatTime(song.duration || 0)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3 text-secondary" />
                </Button>
              </div>
            </div>
          </ContextMenu>
        );
      })}
    </div>
  );
}