import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PlaylistWithSongs } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play, Heart, MoreHorizontal, Download, Clock } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export default function Playlist() {
  const { id } = useParams();
  const { playTrack } = useAudioPlayer();

  const { data: playlist, isLoading } = useQuery<PlaylistWithSongs>({
    queryKey: [`/api/playlists/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-dark p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-spotify-gray rounded-lg mb-8" />
          <div className="h-8 bg-spotify-gray rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-spotify-gray rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-spotify-dark p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
          <p className="text-spotify-text">The playlist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalDuration = playlist.songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  return (
    <div className="min-h-screen bg-spotify-dark">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-purple-800 to-spotify-dark p-8">
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-spotify-light-gray rounded-lg flex items-center justify-center shadow-2xl">
            {playlist.imageUrl ? (
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : playlist.name === "Liked Songs" ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-16 h-16 text-white fill-current" />
              </div>
            ) : (
              <div className="w-full h-full bg-spotify-light-gray rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-spotify-text" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-2">PLAYLIST</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-spotify-text text-lg mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center text-sm text-spotify-text">
              <span className="font-semibold text-white">Spotify</span>
              {playlist.songs.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span>{playlist.songs.length} songs</span>
                  <span className="mx-1">•</span>
                  <span>
                    {totalHours > 0 ? `${totalHours} hr ` : ''}
                    {totalMinutes % 60} min
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="px-8 py-6 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center space-x-6">
          <Button
            size="lg"
            className="bg-spotify-green hover:bg-spotify-green/90 text-black rounded-full w-14 h-14 p-0"
            onClick={() => playlist.songs.length > 0 && playTrack(playlist.songs[0])}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
          <Button variant="ghost" size="lg" className="text-spotify-text hover:text-white p-0">
            <Heart className="w-8 h-8" />
          </Button>
          <Button variant="ghost" size="lg" className="text-spotify-text hover:text-white p-0">
            <Download className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="lg" className="text-spotify-text hover:text-white p-0">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-8 pb-32">
        {playlist.songs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">This playlist is empty</h3>
            <p className="text-spotify-text">Find something to add to this playlist.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-spotify-text text-sm border-b border-spotify-light-gray/20">
              <div className="col-span-1">#</div>
              <div className="col-span-6">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2 flex justify-end">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Tracks */}
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-spotify-light-gray/10 rounded group cursor-pointer"
                onClick={() => playTrack(song)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-spotify-text text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block" />
                </div>
                <div className="col-span-6 flex items-center space-x-3">
                  <img
                    src={song.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-white">{song.title}</h4>
                    <p className="text-spotify-text text-sm">{song.artist.name}</p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-spotify-text text-sm">
                    {song.album?.title || "Unknown Album"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span className="text-spotify-text text-sm">
                    {Math.floor(song.duration! / 60)}:{(song.duration! % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
