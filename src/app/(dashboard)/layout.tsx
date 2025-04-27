"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MenuIcon, X, BookOpen } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Sidebar } from "@/components/navigation/sidebar";
import { UserAvatar } from "@/components/navigation/user-avatar";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  
  // Load user theme preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.id) {
      const userRole = session.user.role.toLowerCase();
      // First try role-specific settings
      const savedSettings = localStorage.getItem(`${userRole}Settings`);
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.theme) {
            // Apply through next-themes
            setTheme(settings.theme);
            
            // Also apply directly to DOM
            document.documentElement.setAttribute('data-theme', settings.theme);
            
            // Update dark mode class
            if (settings.theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else if (settings.theme === 'light') {
              document.documentElement.classList.remove('dark');
            }
            
            // Also apply font settings if available
            if (settings.fontSize) {
              document.documentElement.style.fontSize = `${settings.fontSize}px`;
            }
            
            if (settings.fontFamily) {
              document.documentElement.style.fontFamily = settings.fontFamily;
            }
          }
        } catch (error) {
          console.error("Error parsing settings:", error);
          setTheme("dark"); // Fallback to dark theme
        }
      } else {
        // Try general user settings
        const generalSettings = localStorage.getItem("userSettings");
        if (generalSettings) {
          try {
            const settings = JSON.parse(generalSettings);
            if (settings.theme) {
              setTheme(settings.theme);
              
              // Also apply directly to DOM
              document.documentElement.setAttribute('data-theme', settings.theme);
              
              // Update dark mode class
              if (settings.theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (settings.theme === 'light') {
                document.documentElement.classList.remove('dark');
              }
              
              // Also apply font settings if available
              if (settings.fontSize) {
                document.documentElement.style.fontSize = `${settings.fontSize}px`;
              }
              
              if (settings.fontFamily) {
                document.documentElement.style.fontFamily = settings.fontFamily;
              }
            }
          } catch (error) {
            console.error("Error parsing settings:", error);
            setTheme("dark"); // Fallback to dark theme
          }
        } else {
          setTheme("dark"); // Default to dark theme if no settings found
        }
      }
    }
  }, [session, setTheme]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top header bar */}
      <div className="h-16 fixed inset-x-0 top-0 z-30 border-b bg-background md:left-64">
        <div className="flex items-center justify-between h-full px-4">
          <button 
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          
          {/* Dashboard branding */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative h-6 w-6 flex items-center justify-center bg-primary rounded-md text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">LearnHub Dashboard</span>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <UserAvatar 
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user?.image}
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card z-50 border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 flex items-center justify-center bg-primary rounded-md text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-semibold">LearnHub</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-full">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-20 w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pl-64 bg-background">
        {children}
      </main>
    </div>
  );
} 