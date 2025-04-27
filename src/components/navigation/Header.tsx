"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, X, User, ShoppingCart, Search, Bell, BookOpen, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isDashboard = pathname?.includes("/dashboard");
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDashboard) {
    return null; // Don't show header in dashboard layout
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm" 
          : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 flex items-center justify-center bg-primary rounded-md text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold hidden sm:inline-block">
            <span className="gradient-text">LearnHub</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <>
              {/* Notifications - Only show for authenticated users */}
              <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex">
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* Cart - Only show for authenticated users */}
              <Link href="/dashboard/cart">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              
              {/* Profile button - For authenticated users */}
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Sign in button - For unauthenticated users */}
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
              
              {/* Sign up button - For unauthenticated users */}
              <Link href="/sign-up">
                <Button size="sm" className="hidden sm:flex">
                  <span>Sign Up</span>
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b py-4">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8 flex items-center justify-center bg-primary rounded-md text-primary-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-bold">LearnHub</h1>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col mt-6 space-y-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                          pathname === link.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                
                <div className="mt-auto border-t py-4 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/dashboard">
                          <Button className="w-full">
                            <User className="h-4 w-4 mr-2" />
                            My Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/dashboard/cart">
                          <Button variant="outline" className="w-full">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            My Cart
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/sign-in">
                          <Button className="w-full">
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/sign-up">
                          <Button variant="outline" className="w-full">
                            <User className="h-4 w-4 mr-2" />
                            Sign Up
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 