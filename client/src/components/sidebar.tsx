import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Playlist } from "@shared/schema";
import { Home, Search, Library, Plus, Heart, Podcast } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists/user/1"], // Using userId 1 for demo
  });

  const navigation = [
    { name: "Home", href: "/", icon: Home, active: location === "/" },
    { name: "Search", href: "/search", icon: Search, active: location === "/search" },
    { name: "Your Library", href: "/library", icon: Library, active: location === "/library" },
  ];

  const libraryItems = [
    { name: "Create Playlist", icon: Plus },
    { name: "Liked Songs", icon: Heart },
    { name: "Your Episodes", icon: Podcast },
  ];

  return (
    <div className="w-60 bg-black p-6 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xl font-bold">Spotify 2.0</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2 mb-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left p-3 h-auto ${
                      item.active
                        ? "text-white bg-spotify-light-gray"
                        : "text-spotify-text hover:text-white"
                    } transition-colors duration-300`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="pt-6 border-t border-spotify-light-gray">
          <ul className="space-y-2 mb-6">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left p-3 h-auto text-spotify-text hover:text-white transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Playlists */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {playlists?.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left p-2 h-auto text-spotify-text hover:text-white transition-colors duration-300 ${
                    location === `/playlist/${playlist.id}` ? "text-white" : ""
                  }`}
                >
                  <span className="text-sm truncate">{playlist.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
