import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
type AccentColor = "green" | "blue" | "purple" | "pink" | "orange";

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState<AccentColor>("green");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("spotify-theme") as Theme;
    const savedAccent = localStorage.getItem("spotify-accent") as AccentColor;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccentColor(savedAccent);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Apply accent color
    root.setAttribute("data-accent", accentColor);
    
    // Save to localStorage
    localStorage.setItem("spotify-theme", theme);
    localStorage.setItem("spotify-accent", accentColor);
  }, [theme, accentColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const setAccentColorHandler = (color: AccentColor) => {
    setAccentColor(color);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      accentColor,
      toggleTheme,
      setAccentColor: setAccentColorHandler
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}