import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "./lib/audio-context";
import { ThemeProvider } from "./lib/theme-context";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Library from "@/pages/library";
import Playlist from "@/pages/playlist";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";
import MusicPlayer from "@/components/music-player";

function Router() {
  useKeyboardShortcuts();
  
  return (
    <div className="flex h-screen bg-spotify-dark text-primary page-transition">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/library" component={Library} />
            <Route path="/playlist/:id" component={Playlist} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AudioProvider>
            <Toaster />
            <Router />
          </AudioProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
