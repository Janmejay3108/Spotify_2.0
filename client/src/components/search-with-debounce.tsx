import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X, Clock, TrendingUp } from "lucide-react";
import { SongWithDetails, Artist, Album, Playlist } from "@shared/schema";

interface SearchResults {
  songs: SongWithDetails[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

interface SearchWithDebounceProps {
  onResultSelect?: (type: string, item: any) => void;
  placeholder?: string;
  showHistory?: boolean;
}

export default function SearchWithDebounce({ 
  onResultSelect, 
  placeholder = "What do you want to listen to?",
  showHistory = true 
}: SearchWithDebounceProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("spotify-search-history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", { q: debouncedQuery }],
    enabled: !!debouncedQuery && debouncedQuery.length > 1,
  });

  const addToHistory = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("spotify-search-history", JSON.stringify(newHistory));
  }, [searchHistory]);

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("spotify-search-history");
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setDebouncedQuery(searchTerm);
    addToHistory(searchTerm);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const suggestions = query.length > 0 ? 
      (searchResults ? getAllSuggestions(searchResults) : []) : 
      searchHistory.map(item => ({ type: 'history', text: item, item: undefined }));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          const suggestion = suggestions[focusedIndex];
          handleSearch(suggestion.text);
          if (suggestion.item && onResultSelect) {
            onResultSelect(suggestion.type, suggestion.item);
          }
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const getAllSuggestions = (results: SearchResults) => {
    const suggestions: Array<{
      type: string;
      text: string;
      subtitle?: string;
      item?: any;
    }> = [];
    
    // Add top search results as suggestions
    results.songs.slice(0, 3).forEach(song => {
      suggestions.push({
        type: 'song',
        text: song.title,
        subtitle: song.artist.name,
        item: song
      });
    });
    
    results.artists.slice(0, 2).forEach(artist => {
      suggestions.push({
        type: 'artist',
        text: artist.name,
        subtitle: 'Artist',
        item: artist
      });
    });
    
    results.albums.slice(0, 2).forEach(album => {
      suggestions.push({
        type: 'album',
        text: album.title,
        subtitle: 'Album',
        item: album
      });
    });

    return suggestions;
  };

  const trendingSearches = [
    "Christmas music", "Hip hop hits", "Chill vibes", "Workout playlist", "Jazz classics"
  ];

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white dark:bg-surface text-black dark:text-primary rounded-full py-3 px-4 pl-12 pr-10 text-lg border-0 focus:ring-2 focus:ring-accent"
        />
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              setShowSuggestions(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-surface-hover rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {query.length > 0 ? (
            // Search results suggestions
            <div>
              {isLoading ? (
                <div className="p-4 text-center text-secondary">Searching...</div>
              ) : searchResults && getAllSuggestions(searchResults).length > 0 ? (
                <div>
                  {getAllSuggestions(searchResults).map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${index}`}
                      onClick={() => {
                        handleSearch(suggestion.text);
                        if (suggestion.item && onResultSelect) {
                          onResultSelect(suggestion.type, suggestion.item);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors ${
                        index === focusedIndex ? 'bg-surface-hover' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <SearchIcon className="w-4 h-4 text-secondary" />
                        <div>
                          <div className="text-primary font-medium">{suggestion.text}</div>
                          {suggestion.subtitle && (
                            <div className="text-secondary text-sm">{suggestion.subtitle}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : debouncedQuery && (
                <div className="p-4 text-center text-secondary">No results found</div>
              )}
            </div>
          ) : (
            // Search history and trending
            <div>
              {showHistory && searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-surface">
                    <span className="text-secondary text-sm font-medium">Recent searches</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-secondary hover:text-primary text-xs p-1"
                    >
                      Clear all
                    </Button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className={`w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors ${
                        index === focusedIndex ? 'bg-surface-hover' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className="text-primary">{item}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="px-4 py-2 border-b border-surface">
                  <span className="text-secondary text-sm font-medium">Trending searches</span>
                </div>
                {trendingSearches.map((item, index) => (
                  <button
                    key={item}
                    onClick={() => handleSearch(item)}
                    className={`w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors ${
                      index + searchHistory.length === focusedIndex ? 'bg-surface-hover' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-secondary" />
                      <span className="text-primary">{item}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}