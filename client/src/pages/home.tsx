import { useQuery } from "@tanstack/react-query";
import { SongWithDetails, Artist, Album } from "@shared/schema";
import AlbumCard from "@/components/album-card";
import ArtistCard from "@/components/artist-card";
import QuickAccessCard from "@/components/quick-access-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Download, User } from "lucide-react";

export default function Home() {
  const { data: recentlyPlayed, isLoading: recentlyPlayedLoading } = useQuery<SongWithDetails[]>({
    queryKey: ["/api/recently-played/1"], // Using userId 1 for demo
  });

  const { data: artists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const { data: albums, isLoading: albumsLoading } = useQuery<Album[]>({
    queryKey: ["/api/albums"],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickAccessItems = [
    { type: "liked", name: "Liked Songs", gradient: "from-purple-500 to-blue-600" },
    { type: "album", name: "Electronic Hits", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop" },
    { type: "playlist", name: "Discover Weekly", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-spotify-dark">
      {/* Header */}
      <header className="bg-gradient-to-b from-spotify-light-gray to-transparent p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button size="sm" variant="ghost" className="w-8 h-8 bg-black bg-opacity-70 rounded-full p-0">
            <ChevronLeft className="w-4 h-4 text-spotify-text" />
          </Button>
          <Button size="sm" variant="ghost" className="w-8 h-8 bg-black bg-opacity-70 rounded-full p-0">
            <ChevronRight className="w-4 h-4 text-spotify-text" />
          </Button>
        </div>

        <div className="relative flex-1 max-w-md mx-8">
          <Input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            className="w-full bg-white text-black rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-spotify-green border-0"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full hover:bg-opacity-90">
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
        </div>
      </header>

      <div className="p-6 pb-32">
        {/* Good Morning Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-6">{getGreeting()}</h1>
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {quickAccessItems.map((item, index) => (
              <QuickAccessCard key={index} item={item} />
            ))}
          </div>
        </section>

        {/* Recently Played Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recently played</h2>
            <Button variant="link" className="text-spotify-text hover:text-white text-sm font-medium p-0">
              Show all
            </Button>
          </div>
          
          {recentlyPlayedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-spotify-gray p-4 rounded-lg animate-pulse">
                  <div className="w-full aspect-square bg-spotify-light-gray rounded-md mb-4" />
                  <div className="h-4 bg-spotify-light-gray rounded mb-2" />
                  <div className="h-3 bg-spotify-light-gray rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {albums?.slice(0, 5).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </section>

        {/* Made For You Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Made for you</h2>
            <Button variant="link" className="text-spotify-text hover:text-white text-sm font-medium p-0">
              Show all
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums?.slice(0, 3).map((album) => (
              <AlbumCard key={album.id} album={album} showDescription />
            ))}
          </div>
        </section>

        {/* Popular Artists Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular artists</h2>
            <Button variant="link" className="text-spotify-text hover:text-white text-sm font-medium p-0">
              Show all
            </Button>
          </div>
          
          {artistsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-spotify-gray p-4 rounded-lg animate-pulse">
                  <div className="w-full aspect-square bg-spotify-light-gray rounded-full mb-4" />
                  <div className="h-4 bg-spotify-light-gray rounded mb-2" />
                  <div className="h-3 bg-spotify-light-gray rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {artists?.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
