import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Playlist } from "@shared/schema";
import PlaylistCreator from "@/components/playlist-creator";
import { Plus, List, Grid3X3, Search } from "lucide-react";
import { Link } from "wouter";

export default function Library() {
  const { data: playlists, isLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists/user/1"], // Using userId 1 for demo
  });

  return (
    <div className="min-h-screen bg-spotify-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-spotify-text hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-spotify-text hover:text-white">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-spotify-text hover:text-white">
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <PlaylistCreator />
          <Button variant="outline" className="border-spotify-text text-spotify-text hover:text-white hover:border-white">
            Recently Added
          </Button>
          <Button variant="outline" className="border-spotify-text text-spotify-text hover:text-white hover:border-white">
            Made by You
          </Button>
        </div>

        {/* Library Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-spotify-gray rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-spotify-light-gray rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-spotify-light-gray rounded mb-2 w-1/3" />
                  <div className="h-3 bg-spotify-light-gray rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Liked Songs - Special item */}
            <div className="flex items-center space-x-4 p-4 hover:bg-spotify-gray rounded-lg cursor-pointer group transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Liked Songs</h3>
                <p className="text-spotify-text text-sm">Playlist • Made for you</p>
              </div>
              <Button
                size="sm"
                className="bg-spotify-green text-black rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity play-button-appear"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            {/* User Playlists */}
            {playlists?.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <div className="flex items-center space-x-4 p-4 hover:bg-spotify-gray rounded-lg cursor-pointer group transition-colors">
                  <div className="w-16 h-16 bg-spotify-light-gray rounded flex items-center justify-center">
                    {playlist.imageUrl ? (
                      <img
                        src={playlist.imageUrl}
                        alt={playlist.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-spotify-text" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.607-.475-3.103-1.343-4.343a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{playlist.name}</h3>
                    <p className="text-spotify-text text-sm">
                      Playlist{playlist.description && ` • ${playlist.description}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-spotify-green text-black rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity play-button-appear"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </Link>
            ))}

            {/* Empty State */}
            {playlists?.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">Create your first playlist</h3>
                <p className="text-spotify-text mb-6">It's easy, we'll help you</p>
                <Button className="bg-spotify-green hover:bg-spotify-green/90 text-black font-semibold">
                  Create playlist
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
