import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import AlbumCard from "@/components/album-card";
import ArtistCard from "@/components/artist-card";
import { SongWithDetails, Artist, Album, Playlist } from "@shared/schema";

interface SearchResults {
  songs: SongWithDetails[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-spotify-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="What do you want to listen to?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white text-black rounded-full py-3 px-4 pl-12 text-lg"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            <Button type="submit" className="bg-spotify-green hover:bg-spotify-green/90 text-black font-semibold px-8 py-3 rounded-full">
              Search
            </Button>
          </form>
        </div>

        {!searchQuery ? (
          /* Browse Categories */
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
          </div>
        ) : (
          /* Search Results */
          <div>
            <h1 className="text-3xl font-bold mb-6">Search results for "{searchQuery}"</h1>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-spotify-text">Searching...</div>
              </div>
            ) : searchResults ? (
              <div className="space-y-8">
                {/* Top Result */}
                {(searchResults.songs.length > 0 || searchResults.artists.length > 0) && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Top result</h2>
                    <div className="bg-spotify-gray p-6 rounded-lg max-w-md hover:bg-spotify-light-gray transition-colors cursor-pointer">
                      {searchResults.artists.length > 0 ? (
                        <div className="flex items-center space-x-4">
                          <img
                            src={searchResults.artists[0].imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"}
                            alt={searchResults.artists[0].name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-2xl font-bold">{searchResults.artists[0].name}</h3>
                            <p className="text-spotify-text">Artist</p>
                          </div>
                        </div>
                      ) : searchResults.songs.length > 0 && (
                        <div className="flex items-center space-x-4">
                          <img
                            src={searchResults.songs[0].album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop"}
                            alt={searchResults.songs[0].title}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div>
                            <h3 className="text-2xl font-bold">{searchResults.songs[0].title}</h3>
                            <p className="text-spotify-text">Song • {searchResults.songs[0].artist.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Songs */}
                {searchResults.songs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Songs</h2>
                    <div className="space-y-2">
                      {searchResults.songs.slice(0, 5).map((song, index) => (
                        <div
                          key={song.id}
                          className="flex items-center space-x-4 p-2 hover:bg-spotify-gray rounded cursor-pointer group"
                        >
                          <div className="w-8 text-spotify-text text-sm font-medium">
                            {index + 1}
                          </div>
                          <img
                            src={song.album?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{song.title}</h4>
                            <p className="text-spotify-text text-sm">{song.artist.name}</p>
                          </div>
                          <div className="text-spotify-text text-sm">
                            {Math.floor(song.duration! / 60)}:{(song.duration! % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Artists */}
                {searchResults.artists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Artists</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {searchResults.artists.map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Albums */}
                {searchResults.albums.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Albums</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {searchResults.albums.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Playlists */}
                {searchResults.playlists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {searchResults.playlists.map((playlist) => (
                        <AlbumCard key={playlist.id} album={playlist} />
                      ))}
                    </div>
                  </section>
                )}

                {/* No Results */}
                {searchResults.songs.length === 0 && 
                 searchResults.artists.length === 0 && 
                 searchResults.albums.length === 0 && 
                 searchResults.playlists.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold mb-2">No results found for "{searchQuery}"</h3>
                    <p className="text-spotify-text">Please make sure your words are spelled correctly or use less or different keywords.</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
