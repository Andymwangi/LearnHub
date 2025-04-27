declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
    children?: React.ReactNode;
    themes?: string[];
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
  }
  
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  
  export interface UseThemeProps {
    themes?: string[];
    forcedTheme?: string;
    enableSystem?: boolean;
    defaultTheme?: string;
    storageKey?: string;
    disableTransitionOnChange?: boolean;
  }
  
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    forcedTheme: string | undefined;
    resolvedTheme: string | undefined;
    themes: string[];
    systemTheme: string | undefined;
  };
} 