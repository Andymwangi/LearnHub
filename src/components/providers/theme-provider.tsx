"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Define theme context types
type ThemeContextType = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  saveThemePreference: (theme: string) => void;
};

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => {},
  saveThemePreference: () => {},
});

// Custom hook to use theme
export const useAppTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<string | undefined>(undefined);

  // This ensures that the initial theme is applied correctly after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme from localStorage directly to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      // Try to get settings from localStorage
      const userSettings = localStorage.getItem("userSettings");
      const storedTheme = userSettings ? JSON.parse(userSettings)?.theme : null;
      
      if (storedTheme) {
        // Update state
        setThemeState(storedTheme);
        
        // Apply the theme immediately
        applyTheme(storedTheme);
      } else {
        // Default to system theme if no stored preference
        const defaultTheme = "system";
        setThemeState(defaultTheme);
        applyTheme(defaultTheme);
      }
    }
  }, [mounted]);

  // Function to apply theme directly to DOM
  const applyTheme = (newTheme: string) => {
    // Apply theme class on html element
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      // Handle system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      document.documentElement.classList.toggle('light', !systemPrefersDark);
      document.documentElement.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
    }
  };

  // Function to set theme and save to localStorage
  const setTheme = (newTheme: string) => {
    if (!mounted) return;
    
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage
    saveThemePreference(newTheme);
  };

  // Function to save theme preference
  const saveThemePreference = (newTheme: string) => {
    try {
      const userSettings = localStorage.getItem("userSettings");
      const settings = userSettings ? JSON.parse(userSettings) : {};
      
      settings.theme = newTheme;
      localStorage.setItem("userSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const contextValue = {
    theme,
    setTheme,
    saveThemePreference
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider 
        attribute="data-theme"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
        forcedTheme={theme}
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
} 