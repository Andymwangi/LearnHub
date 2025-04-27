"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, Search, ShoppingCart, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const { data } = await axios.get("/api/cart");
        if (data?.items) {
          setCartItemCount(data.items.length);
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    
    // Set up an interval to refresh the cart count periodically
    const interval = setInterval(fetchCartCount, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const routes = [
    {
      href: "/courses",
      label: "Browse Courses",
      active: pathname === "/courses",
    },
    {
      href: "/pricing",
      label: "Pricing",
      active: pathname === "/pricing",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ];
  
  return (
    <header className={cn(
      "w-full border-b border-neutral-200/40 dark:border-neutral-800/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30",
      className
    )}>
      <div className="container flex justify-between items-center py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span>LearnHub</span>
          </Link>
          
          <nav className="hidden lg:flex gap-6 items-center">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group",
                  route.active && "text-foreground"
                )}
              >
                {route.label}
                {route.active && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for courses..."
              className={cn(
                "w-full pl-10 pr-4 py-2 transition-all duration-300 focus:ring-2 focus:ring-primary/20",
                searchFocused ? "bg-white dark:bg-card shadow-sm" : "bg-secondary/50"
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              2
            </span>
          </Button>
          
          <Link href="/dashboard/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          <div className="hidden md:flex gap-2">
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="font-medium shadow-sm hover:shadow-md transition-all">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="font-medium shadow-sm hover:shadow-md transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 