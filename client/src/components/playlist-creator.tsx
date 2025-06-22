import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface PlaylistCreatorProps {
  trigger?: React.ReactNode;
}

export default function PlaylistCreator({ trigger }: PlaylistCreatorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; userId: number; isPublic: boolean }) => {
      return apiRequest("/api/playlists", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists/user/1"] });
      setOpen(false);
      setName("");
      setDescription("");
      setIsPublic(false);
      toast({
        title: "Playlist created",
        description: "Your new playlist has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createPlaylistMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      userId: 1, // Using userId 1 for demo
      isPublic,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-surface border-surface max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Create a new playlist</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="playlist-name" className="text-primary">Name</Label>
            <Input
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist #1"
              className="bg-surface-hover border-surface text-primary"
              required
            />
          </div>

          <div>
            <Label htmlFor="playlist-description" className="text-primary">Description (optional)</Label>
            <Textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              className="bg-surface-hover border-surface text-primary resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="playlist-public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-accent bg-surface-hover border-surface rounded focus:ring-accent"
            />
            <Label htmlFor="playlist-public" className="text-secondary">
              Make this playlist public
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-secondary hover:text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createPlaylistMutation.isPending}
              className="bg-accent"
            >
              {createPlaylistMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}