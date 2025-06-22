import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchWithDebounce from "@/components/search-with-debounce";
import AlbumCard from "@/components/album-card";
import ArtistCard from "@/components/artist-card";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { SongWithDetails, Artist, Album, Playlist } from "@shared/schema";

interface SearchResults {
  songs: SongWithDetails[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export default function Search() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const { playTrack } = useAudioPlayer();

  const handleResultSelect = (type: string, item: any) => {
    if (type === 'song') {
      playTrack(item);
    }
    // Handle other result types as needed
  };

  return (
    <div className="min-h-screen bg-spotify-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Search Header */}
        <div className="mb-8">
          <SearchWithDebounce 
            onResultSelect={handleResultSelect}
            placeholder="What do you want to listen to?"
            showHistory={true}
          />
        </div>

        {/* Browse Categories */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Browse all</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[
              { name: "Pop", color: "bg-pink-500", image: "🎤" },
              { name: "Hip-Hop", color: "bg-orange-500", image: "🎧" },
              { name: "Rock", color: "bg-red-500", image: "🎸" },
              { name: "Electronic", color: "bg-blue-500", image: "🎹" },
              { name: "Jazz", color: "bg-purple-500", image: "🎺" },
              { name: "Classical", color: "bg-green-500", image: "🎻" },
              { name: "Country", color: "bg-yellow-500", image: "🤠" },
              { name: "R&B", color: "bg-indigo-500", image: "🎤" },
            ].map((category) => (
              <div
                key={category.name}
                className={`${category.color} p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform relative overflow-hidden h-32`}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
                <div className="absolute bottom-2 right-2 text-4xl opacity-80">
                  {category.image}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended for You Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* These would normally come from a recommendations API */}
              <div className="bg-surface p-4 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                  alt="Discover Weekly"
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold mb-1">Discover Weekly</h3>
                <p className="text-secondary text-sm">Your weekly mixtape of fresh music</p>
              </div>
              <div className="bg-surface p-4 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                  alt="Release Radar"
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold mb-1">Release Radar</h3>
                <p className="text-secondary text-sm">Catch all the latest music</p>
              </div>
              <div className="bg-surface p-4 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                  alt="Daily Mix 1"
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold mb-1">Daily Mix 1</h3>
                <p className="text-secondary text-sm">The Weeknd, Drake, Travis Scott and more</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
