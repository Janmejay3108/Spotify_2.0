import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/lib/theme-context";
import { Settings, Sun, Moon, Palette } from "lucide-react";

export default function ThemeSettings() {
  const { theme, accentColor, toggleTheme, setAccentColor } = useTheme();

  const accentColors = [
    { name: "Green", value: "green" as const, color: "hsl(141, 73%, 42%)" },
    { name: "Blue", value: "blue" as const, color: "hsl(217, 91%, 60%)" },
    { name: "Purple", value: "purple" as const, color: "hsl(262, 83%, 58%)" },
    { name: "Pink", value: "pink" as const, color: "hsl(330, 81%, 60%)" },
    { name: "Orange", value: "orange" as const, color: "hsl(24, 95%, 53%)" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-secondary hover:text-primary p-2">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-surface max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Theme Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div>
            <h3 className="text-primary font-medium mb-3">Appearance</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={toggleTheme}
                className={theme === "light" ? "bg-accent" : "border-surface text-secondary hover:text-primary"}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={toggleTheme}
                className={theme === "dark" ? "bg-accent" : "border-surface text-secondary hover:text-primary"}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <h3 className="text-primary font-medium mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              Accent Color
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setAccentColor(color.value)}
                  className={`h-12 flex flex-col items-center justify-center p-2 border-2 transition-all ${
                    accentColor === color.value 
                      ? "border-accent-primary" 
                      : "border-surface hover:border-surface-hover"
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-1"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-xs text-secondary">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}